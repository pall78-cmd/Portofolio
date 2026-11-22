import { useCallback, useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, ArrowRight } from 'lucide-react';
import {
  INTRO_DURATION_MS,
  INTRO_FADE_MS,
  playNetflixIntroSound,
} from '../utils/introAudio';

interface NetflixIntroOverlayProps {
  onComplete: () => void;
}

export function NetflixIntroOverlay({ onComplete }: NetflixIntroOverlayProps) {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [audioState, setAudioState] = useState<'pending' | 'played' | 'blocked'>('pending');
  const [animKey, setAnimKey] = useState(0);

  const fadeTimerRef = useRef<number | null>(null);
  const doneTimerRef = useRef<number | null>(null);
  const completedRef = useRef(false);

  const clearTimers = useCallback(() => {
    if (fadeTimerRef.current !== null) {
      window.clearTimeout(fadeTimerRef.current);
      fadeTimerRef.current = null;
    }
    if (doneTimerRef.current !== null) {
      window.clearTimeout(doneTimerRef.current);
      doneTimerRef.current = null;
    }
  }, []);

  const finishIntro = useCallback(
    (immediate = false) => {
      if (completedRef.current) {
        return;
      }
      completedRef.current = true;
      clearTimers();
      setIsFadingOut(true);
      window.setTimeout(() => {
        onComplete();
      }, immediate ? 180 : INTRO_FADE_MS);
    },
    [clearTimers, onComplete]
  );

  const scheduleAutoDismiss = useCallback(
    (totalMs: number) => {
      clearTimers();
      const fadeDelay = Math.max(0, totalMs - INTRO_FADE_MS);
      fadeTimerRef.current = window.setTimeout(() => {
        setIsFadingOut(true);
      }, fadeDelay);
      doneTimerRef.current = window.setTimeout(() => {
        if (!completedRef.current) {
          completedRef.current = true;
          onComplete();
        }
      }, totalMs);
    },
    [clearTimers, onComplete]
  );

  const triggerSoundEffect = useCallback(
    async (replayVisual = false) => {
      if (replayVisual) {
        setAnimKey((prev) => prev + 1);
        setIsFadingOut(false);
        completedRef.current = false;
        scheduleAutoDismiss(2600);
      }
      const outcome = await playNetflixIntroSound({ fromUserGesture: true });
      if (outcome.played) {
        setAudioState('played');
      } else if (outcome.reason === 'autoplay-blocked') {
        setAudioState('blocked');
      }
    },
    [scheduleAutoDismiss]
  );

  useEffect(() => {
    scheduleAutoDismiss(INTRO_DURATION_MS);

    void playNetflixIntroSound({ fromUserGesture: false }).then((outcome) => {
      if (outcome.played) {
        setAudioState('played');
      } else if (outcome.reason === 'autoplay-blocked') {
        setAudioState('blocked');
      }
    });

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        finishIntro(true);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => {
      clearTimers();
      window.removeEventListener('keydown', handleEscape);
    };
  }, [clearTimers, finishIntro, scheduleAutoDismiss]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Intro pembuka Naufal Athallah Rosiyandi"
      data-testid="netflix-intro-overlay"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between bg-[#050608] px-6 py-10 text-white transition-opacity duration-500 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="h-6" aria-hidden="true" />

      <div
        key={animKey}
        className="relative flex flex-col items-center justify-center text-center select-none"
      >
        <div
          aria-hidden="true"
          className="animate-netflix-halo pointer-events-none absolute -inset-12 md:-inset-16 rounded-full bg-radial from-red-600/25 via-red-900/10 to-transparent blur-2xl"
        />

        <div className="animate-netflix-ribbon relative flex items-center justify-center">
          <svg
            viewBox="0 0 120 156"
            className="h-24 w-20 sm:h-32 sm:w-28 md:h-40 md:w-32 drop-shadow-[0_18px_40px_rgba(229,9,20,0.45)]"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="ribbonLeft" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#B20710" />
                <stop offset="100%" stopColor="#7F050B" />
              </linearGradient>
              <linearGradient id="ribbonRight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D60A14" />
                <stop offset="100%" stopColor="#8E060D" />
              </linearGradient>
              <linearGradient id="ribbonDiagonal" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FF2A36" />
                <stop offset="55%" stopColor="#E50914" />
                <stop offset="100%" stopColor="#F59E0B" />
              </linearGradient>
            </defs>
            <path d="M18 12 H42 V144 L18 148 Z" fill="url(#ribbonLeft)" />
            <path d="M78 12 H102 V148 L78 144 Z" fill="url(#ribbonRight)" />
            <path d="M18 12 H42 L102 148 H78 Z" fill="url(#ribbonDiagonal)" />
          </svg>
        </div>

        <div className="animate-netflix-wordmark relative mt-6 md:mt-7 space-y-2 md:space-y-2.5 max-w-md md:max-w-xl">
          <p className="font-serif text-2xl font-semibold tracking-wide text-white sm:text-4xl lg:text-5xl text-balance">
            Naufal Athallah
          </p>
          <p className="text-xs font-medium tracking-wide text-slate-300 md:text-sm">
            Sastra Inggris UINSA · Kabinet Atarascent · EDSA Executive 2026
          </p>
        </div>
      </div>

      <div className="relative z-10 flex w-full max-w-xs flex-col gap-2.5 sm:w-auto sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-3">
        <button
          type="button"
          onClick={() => void triggerSoundEffect(true)}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-white/20 bg-white/10 px-5 py-2.5 text-xs font-semibold text-white hover:bg-white/20 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
        >
          {audioState === 'blocked' ? (
            <VolumeX className="h-4 w-4 text-amber-400" aria-hidden="true" />
          ) : (
            <Volume2 className="h-4 w-4 text-amber-400" aria-hidden="true" />
          )}
          <span>
            {audioState === 'played' ? 'Putar Ulang Ta-Dum' : 'Aktifkan Suara Intro'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => finishIntro(true)}
          className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-md bg-white px-5 py-2.5 text-xs font-semibold text-slate-950 hover:bg-slate-200 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <span>Lewati Intro</span>
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
