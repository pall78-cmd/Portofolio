import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Play, Volume2, VolumeX } from 'lucide-react';
import {
  buildYouTubeEmbedUrl,
  computeExcerptEnvelope,
  EMPTY_MAGNOLIA_EXCERPT,
} from '../utils/excerptMusic';

interface YouTubePlayerInstance {
  playVideo: () => void;
  pauseVideo: () => void;
  stopVideo?: () => void;
  mute: () => void;
  unMute: () => void;
  isMuted?: () => boolean;
  setVolume: (volume: number) => void;
  getVolume?: () => number;
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void;
  getCurrentTime?: () => number;
  getPlayerState?: () => number;
  destroy?: () => void;
}

interface YouTubeNamespace {
  Player: new (
    elementId: string | HTMLElement,
    options: {
      events?: {
        onReady?: (event: { target: YouTubePlayerInstance }) => void;
        onStateChange?: (event: { data: number; target: YouTubePlayerInstance }) => void;
        onError?: (event: { data: number; target: YouTubePlayerInstance }) => void;
      };
    }
  ) => YouTubePlayerInstance;
}

declare global {
  interface Window {
    YT?: YouTubeNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

export type ExcerptPlaybackStatus =
  | 'idle'
  | 'waiting'
  | 'playing'
  | 'needs-tap'
  | 'finished'
  | 'unavailable';

export interface ExcerptMusicPlayerHandle {
  primePlayback: () => void;
  playExcerptNow: () => void;
  stopExcerpt: () => void;
}

interface ExcerptMusicPlayerProps {
  mainVisible: boolean;
}

const YT_IFRAME_API_SRC = 'https://www.youtube.com/iframe_api';
const YT_STATE_PLAYING = 1;
const YT_STATE_BUFFERING = 3;

let apiScriptPromise: Promise<YouTubeNamespace | null> | null = null;

function loadYouTubeIframeApi(): Promise<YouTubeNamespace | null> {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return Promise.resolve(null);
  }
  if (window.YT && typeof window.YT.Player === 'function') {
    return Promise.resolve(window.YT);
  }
  if (apiScriptPromise) {
    return apiScriptPromise;
  }

  apiScriptPromise = new Promise<YouTubeNamespace | null>((resolve) => {
    const previousCallback = window.onYouTubeIframeAPIReady;
    const finish = () => {
      if (window.YT && typeof window.YT.Player === 'function') {
        resolve(window.YT);
      } else {
        resolve(null);
      }
    };

    window.onYouTubeIframeAPIReady = () => {
      if (typeof previousCallback === 'function') {
        try {
          previousCallback();
        } catch {
          // Ignore callback chain errors from unrelated scripts
        }
      }
      finish();
    };

    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${YT_IFRAME_API_SRC}"]`
    );
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = YT_IFRAME_API_SRC;
      script.async = true;
      script.onerror = () => resolve(null);
      document.head.appendChild(script);
    }

    window.setTimeout(() => {
      if (window.YT && typeof window.YT.Player === 'function') {
        resolve(window.YT);
      }
    }, 6000);
  });

  return apiScriptPromise;
}

export const ExcerptMusicPlayer = forwardRef<ExcerptMusicPlayerHandle, ExcerptMusicPlayerProps>(
  function ExcerptMusicPlayer({ mainVisible }, ref) {
    const [activeVideoId, setActiveVideoId] = useState(EMPTY_MAGNOLIA_EXCERPT.videoId);
    const [status, setStatus] = useState<ExcerptPlaybackStatus>('idle');
    const [currentVolume, setCurrentVolume] = useState(0);

    const iframeRef = useRef<HTMLIFrameElement | null>(null);
    const playerRef = useRef<YouTubePlayerInstance | null>(null);
    const playerReadyRef = useRef(false);
    const mainVisibleRef = useRef(mainVisible);
    mainVisibleRef.current = mainVisible;
    const playingActiveRef = useRef(false);
    const pendingPrimeRef = useRef(false);
    const pendingStartAfterReadyRef = useRef(false);
    const fallbackTriedRef = useRef(false);
    const hasPlayedOnceRef = useRef(false);
    const userPausedRef = useRef(false);
    const envelopeTimerRef = useRef<number | null>(null);
    const verifyPlayTimerRef = useRef<number | null>(null);
    const primePauseTimerRef = useRef<number | null>(null);
    const delayTimerRef = useRef<number | null>(null);
    const lastVolumeSentRef = useRef<number>(-1);
    const playbackStartedAtMsRef = useRef<number>(0);

    const origin = typeof window !== 'undefined' ? window.location.origin : undefined;

    const embedUrl = useMemo(
      () =>
        buildYouTubeEmbedUrl({
          videoId: activeVideoId,
          origin,
          startSec: EMPTY_MAGNOLIA_EXCERPT.startSec,
        }),
      [activeVideoId, origin]
    );

    const clearPlaybackTimers = useCallback(() => {
      if (envelopeTimerRef.current !== null) {
        window.clearInterval(envelopeTimerRef.current);
        envelopeTimerRef.current = null;
      }
      if (verifyPlayTimerRef.current !== null) {
        window.clearTimeout(verifyPlayTimerRef.current);
        verifyPlayTimerRef.current = null;
      }
      if (primePauseTimerRef.current !== null) {
        window.clearTimeout(primePauseTimerRef.current);
        primePauseTimerRef.current = null;
      }
    }, []);

    const stopExcerptInternal = useCallback(
      (nextStatus: ExcerptPlaybackStatus = 'finished') => {
        playingActiveRef.current = false;
        clearPlaybackTimers();
        const player = playerRef.current;
        if (player && playerReadyRef.current) {
          try {
            player.setVolume(0);
            player.mute();
            player.pauseVideo();
          } catch {
            // Ignore player teardown errors
          }
        }
        lastVolumeSentRef.current = 0;
        setCurrentVolume(0);
        setStatus(nextStatus);
      },
      [clearPlaybackTimers]
    );

    const runEnvelopeStep = useCallback(() => {
      const player = playerRef.current;
      if (!player || !playerReadyRef.current || !playingActiveRef.current) {
        return;
      }

      let rawTime = NaN;
      try {
        rawTime = player.getCurrentTime?.() ?? NaN;
      } catch {
        rawTime = NaN;
      }

      const elapsedSec =
        playbackStartedAtMsRef.current > 0
          ? (Date.now() - playbackStartedAtMsRef.current) / 1000
          : 0;

      // During the first ~1.2s after seekTo(115.4), getCurrentTime may momentarily return 0;
      // fall back to elapsed clock anchored at startSec until the player lands near startSec.
      const effectiveTimeSec =
        Number.isFinite(rawTime) && rawTime >= EMPTY_MAGNOLIA_EXCERPT.startSec - 1
          ? rawTime
          : EMPTY_MAGNOLIA_EXCERPT.startSec + elapsedSec;

      const envelope = computeExcerptEnvelope(effectiveTimeSec, EMPTY_MAGNOLIA_EXCERPT);

      if (envelope.shouldStop || elapsedSec > EMPTY_MAGNOLIA_EXCERPT.endSec - EMPTY_MAGNOLIA_EXCERPT.startSec + 4) {
        stopExcerptInternal('finished');
        return;
      }

      if (envelope.volume !== lastVolumeSentRef.current) {
        lastVolumeSentRef.current = envelope.volume;
        setCurrentVolume(envelope.volume);
        try {
          player.setVolume(envelope.volume);
        } catch {
          // Ignore transient volume call errors
        }
      }
    }, [stopExcerptInternal]);

    const beginExcerptPlayback = useCallback(
      (fromUserTap = false) => {
        userPausedRef.current = false;
        clearPlaybackTimers();

        const player = playerRef.current;
        if (!player || !playerReadyRef.current) {
          pendingStartAfterReadyRef.current = true;
          return;
        }

        pendingStartAfterReadyRef.current = false;
        playingActiveRef.current = true;
        playbackStartedAtMsRef.current = Date.now();
        lastVolumeSentRef.current = EMPTY_MAGNOLIA_EXCERPT.minStartVolume;
        setCurrentVolume(EMPTY_MAGNOLIA_EXCERPT.minStartVolume);

        try {
          player.seekTo(EMPTY_MAGNOLIA_EXCERPT.startSec, true);
          player.unMute();
          player.setVolume(EMPTY_MAGNOLIA_EXCERPT.minStartVolume);
          player.playVideo();
        } catch {
          playingActiveRef.current = false;
          setStatus(fromUserTap ? 'unavailable' : 'needs-tap');
          return;
        }

        setStatus('playing');
        envelopeTimerRef.current = window.setInterval(runEnvelopeStep, 60);

        verifyPlayTimerRef.current = window.setTimeout(() => {
          const currentPlayer = playerRef.current;
          if (!currentPlayer || userPausedRef.current || !playingActiveRef.current) {
            return;
          }
          let state = -1;
          let muted = false;
          try {
            state = currentPlayer.getPlayerState?.() ?? -1;
            muted = currentPlayer.isMuted?.() ?? false;
          } catch {
            // Ignore inspection errors
          }

          if ((state !== YT_STATE_PLAYING && state !== YT_STATE_BUFFERING) || muted) {
            // Retry unMute once if state started playing while muted
            if (state === YT_STATE_PLAYING && muted) {
              try {
                currentPlayer.unMute();
                currentPlayer.setVolume(EMPTY_MAGNOLIA_EXCERPT.peakVolume);
                muted = currentPlayer.isMuted?.() ?? false;
              } catch {
                muted = true;
              }
            }

            if ((state !== YT_STATE_PLAYING && state !== YT_STATE_BUFFERING) || muted) {
              playingActiveRef.current = false;
              clearPlaybackTimers();
              try {
                currentPlayer.pauseVideo();
              } catch {
                // Ignore
              }
              setStatus('needs-tap');
            }
          }
        }, 1600);
      },
      [clearPlaybackTimers, runEnvelopeStep]
    );

    const primePlayback = useCallback(() => {
      const player = playerRef.current;
      if (!player || !playerReadyRef.current) {
        pendingPrimeRef.current = true;
        return;
      }
      pendingPrimeRef.current = false;

      if (primePauseTimerRef.current !== null) {
        window.clearTimeout(primePauseTimerRef.current);
      }

      try {
        player.mute();
        player.setVolume(0);
        player.seekTo(EMPTY_MAGNOLIA_EXCERPT.startSec, true);
        player.playVideo();
        primePauseTimerRef.current = window.setTimeout(() => {
          primePauseTimerRef.current = null;
          if (!mainVisibleRef.current) {
            try {
              player.pauseVideo();
              player.seekTo(EMPTY_MAGNOLIA_EXCERPT.startSec, true);
            } catch {
              // Ignore
            }
          }
        }, 260);
      } catch {
        // Silently ignore pre-warm failures; main timer or tap button handles playback
      }
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        primePlayback,
        playExcerptNow: () => beginExcerptPlayback(true),
        stopExcerpt: () => {
          userPausedRef.current = true;
          stopExcerptInternal('finished');
        },
      }),
      [primePlayback, beginExcerptPlayback, stopExcerptInternal]
    );

    useEffect(() => {
      let cancelled = false;
      playerReadyRef.current = false;

      void loadYouTubeIframeApi().then((YT) => {
        if (cancelled || !YT || !iframeRef.current) {
          return;
        }

        const instance = new YT.Player(iframeRef.current, {
          events: {
            onReady: () => {
              if (cancelled) {
                return;
              }
              playerReadyRef.current = true;
              try {
                instance.mute();
                instance.setVolume(0);
              } catch {
                // Ignore
              }

              if (pendingPrimeRef.current) {
                primePlayback();
              }
              if (pendingStartAfterReadyRef.current && !userPausedRef.current) {
                beginExcerptPlayback(false);
              }
            },
            onStateChange: (event) => {
              if (cancelled) {
                return;
              }
              if (event.data === YT_STATE_PLAYING && playingActiveRef.current) {
                runEnvelopeStep();
              }
            },
            onError: () => {
              if (cancelled) {
                return;
              }
              const wasPlayingOrPending =
                playingActiveRef.current ||
                pendingStartAfterReadyRef.current ||
                (hasPlayedOnceRef.current && delayTimerRef.current === null);
              playingActiveRef.current = false;
              clearPlaybackTimers();
              if (!fallbackTriedRef.current && activeVideoId !== EMPTY_MAGNOLIA_EXCERPT.fallbackVideoId) {
                fallbackTriedRef.current = true;
                if (wasPlayingOrPending && !userPausedRef.current) {
                  pendingStartAfterReadyRef.current = true;
                }
                setActiveVideoId(EMPTY_MAGNOLIA_EXCERPT.fallbackVideoId);
                return;
              }
              setStatus('unavailable');
            },
          },
        });

        playerRef.current = instance;
      });

      return () => {
        cancelled = true;
        clearPlaybackTimers();
        if (playerRef.current?.destroy) {
          try {
            playerRef.current.destroy();
          } catch {
            // Ignore teardown errors
          }
        }
        playerRef.current = null;
        playerReadyRef.current = false;
      };
      // Re-initialize only when video source changes
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeVideoId]);

    const beginExcerptPlaybackRef = useRef(beginExcerptPlayback);
    beginExcerptPlaybackRef.current = beginExcerptPlayback;

    useEffect(() => {
      if (!mainVisible || hasPlayedOnceRef.current || userPausedRef.current) {
        return;
      }

      setStatus('waiting');

      let rafOuter = 0;
      let rafInner = 0;
      let cancelled = false;

      // Wait until the main layout finishes its initial render/paint before counting 1.2s
      rafOuter = window.requestAnimationFrame(() => {
        rafInner = window.requestAnimationFrame(() => {
          if (cancelled || userPausedRef.current) {
            return;
          }
          delayTimerRef.current = window.setTimeout(() => {
            delayTimerRef.current = null;
            hasPlayedOnceRef.current = true;
            if (!userPausedRef.current) {
              beginExcerptPlaybackRef.current(false);
            }
          }, EMPTY_MAGNOLIA_EXCERPT.postIntroDelayMs);
        });
      });

      return () => {
        cancelled = true;
        if (rafOuter !== 0) {
          window.cancelAnimationFrame(rafOuter);
        }
        if (rafInner !== 0) {
          window.cancelAnimationFrame(rafInner);
        }
        if (delayTimerRef.current !== null) {
          window.clearTimeout(delayTimerRef.current);
          delayTimerRef.current = null;
        }
      };
    }, [mainVisible]);

    useEffect(() => {
      return () => {
        clearPlaybackTimers();
        if (delayTimerRef.current !== null) {
          window.clearTimeout(delayTimerRef.current);
        }
      };
    }, [clearPlaybackTimers]);

    const showControl = mainVisible && (status === 'playing' || status === 'needs-tap');

    return (
      <div
        data-testid="excerpt-music-host"
        data-music-status={status}
        data-music-volume={currentVolume}
        data-music-video={activeVideoId}
      >
        {/* Compliant >=200x160 painted iframe mount so browsers & YouTube permit API playback */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed bottom-2 right-2 z-0 h-[160px] w-[220px] overflow-hidden opacity-[0.01]"
        >
          <iframe
            key={activeVideoId}
            ref={iframeRef}
            id="excerpt-youtube-iframe"
            width={220}
            height={160}
            src={embedUrl}
            title={`${EMPTY_MAGNOLIA_EXCERPT.title} oleh ${EMPTY_MAGNOLIA_EXCERPT.artist}`}
            referrerPolicy="strict-origin-when-cross-origin"
            allow="autoplay; encrypted-media"
            tabIndex={-1}
          />
        </div>

        {showControl && (
          <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-30">
            {status === 'playing' ? (
              <button
                type="button"
                onClick={() => {
                  userPausedRef.current = true;
                  stopExcerptInternal('finished');
                }}
                data-testid="excerpt-music-stop"
                aria-label="Hentikan lagu Empty oleh Magnolia Celebration"
                className="group inline-flex min-h-11 items-center gap-2.5 rounded-full border border-stone-700/90 bg-[#0B0C10]/92 px-4 py-2 text-xs font-medium text-stone-100 shadow-lg backdrop-blur-md transition-[background-color,border-color,transform] duration-200 hover:border-amber-400/70 hover:bg-[#14161D] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 cursor-pointer"
              >
                <Volume2 className="h-4 w-4 text-amber-300 shrink-0" aria-hidden="true" />
                <span className="whitespace-nowrap">
                  {EMPTY_MAGNOLIA_EXCERPT.title} · {EMPTY_MAGNOLIA_EXCERPT.artist}
                </span>
                <span className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-stone-300 group-hover:bg-[#C81E1E] group-hover:text-white transition-colors">
                  <VolumeX className="h-3 w-3" aria-hidden="true" />
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => beginExcerptPlayback(true)}
                data-testid="excerpt-music-play"
                aria-label="Putar lagu Empty oleh Magnolia Celebration"
                className="group inline-flex min-h-11 items-center gap-2.5 rounded-full border border-amber-400/50 bg-[#0B0C10]/95 px-4 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur-md transition-[background-color,border-color,transform] duration-200 hover:border-amber-300 hover:bg-[#C81E1E] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 cursor-pointer"
              >
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#C81E1E] text-white group-hover:bg-white group-hover:text-[#C81E1E] transition-colors">
                  <Play className="h-3 w-3 ml-0.5 fill-current" aria-hidden="true" />
                </span>
                <span className="whitespace-nowrap">
                  Putar {EMPTY_MAGNOLIA_EXCERPT.title} · {EMPTY_MAGNOLIA_EXCERPT.artist}
                </span>
              </button>
            )}
          </div>
        )}
      </div>
    );
  }
);
