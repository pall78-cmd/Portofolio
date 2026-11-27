import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Play } from 'lucide-react';
import {
  createGrandDoorIntroWavUrl,
  INTRO_DURATION_MS,
  INTRO_FADE_MS,
  playNetflixIntroSound,
  unlockSharedAudioContextSync,
} from '../utils/introAudio';

interface NetflixIntroOverlayProps {
  onComplete: () => void;
  onPlayClick?: () => void;
}

type IntroPhase = 'ready' | 'playing';

/**
 * Cohesive single-silhouette sculpted "N" emblem:
 * Vertical stems and diagonal span share unified deep-crimson lighting with subtle
 * internal fold shading so scaling stays razor-sharp and seamless at any resolution.
 */
function UnifiedMonogramSvg({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 128 156" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="nStemLeft" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E11D2E" />
          <stop offset="55%" stopColor="#A60C16" />
          <stop offset="100%" stopColor="#6E060C" />
        </linearGradient>
        <linearGradient id="nStemRight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E11D2E" />
          <stop offset="55%" stopColor="#AD0D18" />
          <stop offset="100%" stopColor="#72070E" />
        </linearGradient>
        <linearGradient id="nDiagRibbon" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF3B4B" />
          <stop offset="52%" stopColor="#E50914" />
          <stop offset="100%" stopColor="#B80C17" />
        </linearGradient>
        <linearGradient id="nDiagonalShadow" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.46" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="nRimHighlight" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.42" />
          <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="nGlassSheen" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="35%" stopColor="#F59E0B" stopOpacity="0.16" />
          <stop offset="52%" stopColor="#FFFFFF" stopOpacity="0.38" />
          <stop offset="68%" stopColor="#F59E0B" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <clipPath id="nStemLeftClip">
          <path d="M22 14 H48 V144 H22 Z" />
        </clipPath>
        <clipPath id="nDiagClip">
          <path d="M22 14 H48 L106 144 H80 Z" />
        </clipPath>
        <clipPath id="nStemRightClip">
          <path d="M80 14 H106 V144 H80 Z" />
        </clipPath>
        <clipPath id="nUnifiedClip">
          <path d="M22 14 H48 V144 H22 Z M80 14 H106 V144 H80 Z M22 14 H48 L106 144 H80 Z" />
        </clipPath>
      </defs>

      {/* Stroke 1: Left pillar sweeps upward inside its exact architectural clip */}
      <g clipPath="url(#nStemLeftClip)">
        <path
          d="M22 14 H48 V144 H22 Z"
          fill="url(#nStemLeft)"
          className="animate-n-stem-left"
        />
      </g>

      {/* Stroke 3: Right pillar rises seamlessly as diagonal lands */}
      <g clipPath="url(#nStemRightClip)">
        <path
          d="M80 14 H106 V144 H80 Z"
          fill="url(#nStemRight)"
          className="animate-n-stem-right"
        />
      </g>

      {/* Soft fold shadow cast onto stems where diagonal ribbon crosses */}
      <g className="animate-n-depth-shadow">
        <path d="M48 44 L61 72 L48 80 Z" fill="url(#nDiagonalShadow)" />
        <path d="M80 78 L68 106 L80 116 Z" fill="url(#nDiagonalShadow)" />
      </g>

      {/* Stroke 2: Diagonal crimson-gold ribbon glides cleanly along its spine */}
      <g clipPath="url(#nDiagClip)">
        <g className="animate-n-diag">
          <path d="M22 14 H48 L106 144 H80 Z" fill="url(#nDiagRibbon)" />
          <path d="M22 14 H48 L106 144 H102 L46 16 H22 Z" fill="url(#nRimHighlight)" />
        </g>
      </g>

      {/* Warm gold-and-crystal diagonal sheen clipped strictly to the N silhouette */}
      <g clipPath="url(#nUnifiedClip)">
        <rect
          x="0"
          y="-20"
          width="58"
          height="196"
          fill="url(#nGlassSheen)"
          className="animate-cinema-sheen"
        />
      </g>
    </svg>
  );
}

export function NetflixIntroOverlay({ onComplete, onPlayClick }: NetflixIntroOverlayProps) {
  const [phase, setPhase] = useState<IntroPhase>('ready');
  const [isFadingOut, setIsFadingOut] = useState(false);
  const completedRef = useRef(false);
  const startedRef = useRef(false);
  const audioElRef = useRef<HTMLAudioElement | null>(null);

  const introWavUrl = useMemo(() => createGrandDoorIntroWavUrl(), []);

  useEffect(() => {
    if (!introWavUrl || typeof Audio === 'undefined') {
      return;
    }
    const audio = new Audio(introWavUrl);
    audio.preload = 'auto';
    audio.volume = 1.0;
    audioElRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
      audioElRef.current = null;
    };
  }, [introWavUrl]);

  const handleStartIntro = useCallback(() => {
    if (startedRef.current) {
      return;
    }
    startedRef.current = true;

    // 1. Unlock shared Web Audio context synchronously for page UI click/hover SFX
    unlockSharedAudioContextSync();

    // 2. Prime post-intro background music excerpt synchronously inside user gesture
    onPlayClick?.();

    // 3. Play pre-rendered stereo PCM WAV portal-door audio directly on gesture media pipeline
    const mediaEl = audioElRef.current;
    if (mediaEl) {
      mediaEl.currentTime = 0;
      const playPromise = mediaEl.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {
          void playNetflixIntroSound({
            muted: false,
            fromUserGesture: true,
            shouldAbort: () => completedRef.current,
          });
        });
      }
    } else {
      void playNetflixIntroSound({
        muted: false,
        fromUserGesture: true,
        shouldAbort: () => completedRef.current,
      });
    }

    setPhase('playing');
  }, [onPlayClick]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    if (phase !== 'ready') {
      return;
    }

    const handleKeyTrigger = (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleStartIntro();
      }
    };

    window.addEventListener('keydown', handleKeyTrigger);
    return () => window.removeEventListener('keydown', handleKeyTrigger);
  }, [phase, handleStartIntro]);

  useEffect(() => {
    if (phase !== 'playing') {
      return;
    }

    const fadeDelay = Math.max(0, INTRO_DURATION_MS - INTRO_FADE_MS);

    const fadeTimer = window.setTimeout(() => {
      setIsFadingOut(true);
    }, fadeDelay);

    const doneTimer = window.setTimeout(() => {
      if (!completedRef.current) {
        completedRef.current = true;
        onComplete();
      }
    }, INTRO_DURATION_MS);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(doneTimer);
    };
  }, [phase, onComplete]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Pembuka halaman Naufal Athallah Rosiyandi"
      data-testid="netflix-intro-overlay"
      data-intro-phase={phase}
      style={{ contain: 'strict' }}
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#030406] text-white transition-opacity duration-700 ease-in-out ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {phase === 'ready' ? (
        /* Dark unstarted cinema frame: zero preview clutter, just a clean central Play trigger */
        <div className="relative flex flex-col items-center justify-center gap-4">
          <button
            type="button"
            onClick={handleStartIntro}
            data-testid="intro-play-button"
            aria-label="Putar Pembuka"
            className="group relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full border border-white/20 bg-white/[0.06] text-white shadow-[0_0_50px_rgba(0,0,0,0.85)] transition-[transform,background-color,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-105 hover:border-[#E50914]/80 hover:bg-[#C81E1E]/90 hover:shadow-[0_0_60px_rgba(200,30,30,0.45)] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400 cursor-pointer"
          >
            <Play
              className="ml-1 h-8 w-8 sm:h-9 sm:w-9 fill-current transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
              aria-hidden="true"
            />
          </button>
          <span className="text-[11px] font-medium tracking-[0.26em] uppercase text-stone-500">
            Putar
          </span>
        </div>
      ) : (
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden select-none">
          {/* Smooth volumetric radial glow centered via inset-0 m-auto so scale3d stays strictly composited */}
          <div
            aria-hidden="true"
            className="animate-cinema-halo pointer-events-none absolute inset-0 m-auto h-[440px] w-[440px] sm:h-[680px] sm:w-[680px] lg:h-[960px] lg:w-[960px] rounded-full bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.44)_0%,rgba(245,158,11,0.16)_34%,rgba(3,4,6,0)_72%)]"
          />

          {/* Center seam light flare at the moment the portal doors unlatch */}
          <div
            aria-hidden="true"
            className="animate-portal-seam pointer-events-none absolute inset-y-0 left-1/2 z-30 w-10 -translate-x-1/2 bg-linear-to-r from-transparent via-amber-200/80 to-transparent"
          />

          {/* Left & Right Giant Portal Doors parting outward on GPU transform only (zero per-frame shadow repaint) */}
          <div
            aria-hidden="true"
            className="animate-portal-door-left pointer-events-none fixed inset-y-0 left-0 z-20 w-1/2 border-r border-amber-500/25 bg-[linear-gradient(to_left,rgba(245,158,11,0.06)_0%,#040508_12%)]"
          />
          <div
            aria-hidden="true"
            className="animate-portal-door-right pointer-events-none fixed inset-y-0 right-0 z-20 w-1/2 border-l border-amber-500/25 bg-[linear-gradient(to_right,rgba(245,158,11,0.06)_0%,#040508_12%)]"
          />

          {/* Centered Unified Monogram + Non-overlapping Wordmark */}
          <div className="relative z-10 flex flex-col items-center justify-center gap-8 sm:gap-10 lg:gap-12 px-4 text-center">
            <div className="animate-cinema-monogram relative flex items-center justify-center overflow-visible p-4">
              <UnifiedMonogramSvg className="h-32 w-26 sm:h-40 sm:w-32 md:h-48 md:w-40 lg:h-60 lg:w-48 overflow-visible" />
            </div>

            <div className="animate-cinema-wordmark relative space-y-2 max-w-xs sm:max-w-lg lg:max-w-2xl">
              <p className="font-serif text-2xl font-semibold tracking-wide text-white sm:text-4xl lg:text-5xl text-balance">
                Naufal Athallah
              </p>
              <p className="text-[11px] sm:text-xs md:text-sm lg:text-base font-medium tracking-wider text-stone-300">
                Sastra Inggris UINSA · Kabinet Atarascent · EDSA Executive 2026
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
