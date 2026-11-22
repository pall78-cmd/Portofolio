import { useEffect, useRef, useState } from 'react';
import {
  INTRO_DURATION_MS,
  INTRO_FADE_MS,
  playNetflixIntroSound,
  unlockSharedAudioContextSync,
} from '../utils/introAudio';

interface NetflixIntroOverlayProps {
  onComplete: () => void;
}

const PRISM_STRIPES = [
  { id: 'p1', colorClass: 'w-2 bg-[#7F050B]' },
  { id: 'p2', colorClass: 'w-2.5 bg-[#E50914]' },
  { id: 'p3', colorClass: 'w-1.5 bg-[#F59E0B]' },
  { id: 'p4', colorClass: 'w-3 bg-[#C81E1E]' },
  { id: 'p5', colorClass: 'w-2 bg-[#FAF7F2]/90' },
  { id: 'p6', colorClass: 'w-3.5 bg-[#FF2A36]' },
  { id: 'p7', colorClass: 'w-2.5 bg-[#E50914]' },
  { id: 'p8', colorClass: 'w-3 bg-[#FB7185]' },
  { id: 'p9', colorClass: 'w-2 bg-[#F59E0B]' },
  { id: 'p10', colorClass: 'w-3 bg-[#C81E1E]' },
  { id: 'p11', colorClass: 'w-2.5 bg-[#38BDF8]/80' },
  { id: 'p12', colorClass: 'w-2 bg-[#E50914]' },
  { id: 'p13', colorClass: 'w-2.5 bg-[#FAF7F2]/85' },
  { id: 'p14', colorClass: 'w-2 bg-[#991B1B]' },
  { id: 'p15', colorClass: 'w-2.5 bg-[#F59E0B]/85' },
  { id: 'p16', colorClass: 'w-2 bg-[#E50914]' },
] as const;

export function NetflixIntroOverlay({ onComplete }: NetflixIntroOverlayProps) {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const soundPlayedRef = useRef(false);
  const attemptInFlightRef = useRef(false);
  const completedRef = useRef(false);

  useEffect(() => {
    const mountedAt = Date.now();
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

    const shouldAbortLateIntroSound = () =>
      completedRef.current || Date.now() - mountedAt > 2400;

    void playNetflixIntroSound({
      muted: false,
      fromUserGesture: false,
      shouldAbort: shouldAbortLateIntroSound,
    }).then((outcome) => {
      if (outcome.played) {
        soundPlayedRef.current = true;
      }
    });

    const handleGesture = () => {
      // Always unlock shared Web Audio on any gesture so main-page SFX stay crisp
      unlockSharedAudioContextSync();

      if (soundPlayedRef.current || attemptInFlightRef.current) {
        return;
      }
      if (Date.now() - mountedAt > 2200) {
        return;
      }

      attemptInFlightRef.current = true;
      void playNetflixIntroSound({
        muted: false,
        fromUserGesture: true,
        shouldAbort: shouldAbortLateIntroSound,
      })
        .then((outcome) => {
          if (outcome.played) {
            soundPlayedRef.current = true;
          }
        })
        .finally(() => {
          attemptInFlightRef.current = false;
        });
    };

    window.addEventListener('pointerdown', handleGesture, { passive: true });
    window.addEventListener('pointerup', handleGesture, { passive: true });
    window.addEventListener('touchend', handleGesture, { passive: true });
    window.addEventListener('click', handleGesture, { passive: true });
    window.addEventListener('keydown', handleGesture, { passive: true });

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(fadeTimer);
      window.clearTimeout(doneTimer);
      window.removeEventListener('pointerdown', handleGesture);
      window.removeEventListener('pointerup', handleGesture);
      window.removeEventListener('touchend', handleGesture);
      window.removeEventListener('click', handleGesture);
      window.removeEventListener('keydown', handleGesture);
    };
  }, [onComplete]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Pembuka halaman Naufal Athallah Rosiyandi"
      data-testid="netflix-intro-overlay"
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#050608] px-4 sm:px-6 text-white transition-opacity duration-600 ease-out ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="relative flex w-full max-w-2xl flex-col items-center justify-center text-center select-none">
        <div
          aria-hidden="true"
          className="animate-netflix-halo pointer-events-none absolute left-1/2 top-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 sm:h-[580px] sm:w-[580px] lg:h-[720px] lg:w-[720px] bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.4)_0%,rgba(245,158,11,0.1)_38%,rgba(5,6,8,0)_68%)]"
        />

        {/* Multicolor Netflix vertical light ribbon explosion */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 flex items-center justify-center overflow-hidden"
        >
          {PRISM_STRIPES.map((stripe) => (
            <span
              key={stripe.id}
              className={`netflix-prism-stripe animate-netflix-prism h-44 sm:h-56 md:h-64 rounded-full ${stripe.colorClass}`}
            />
          ))}
        </div>

        {/* Kinetic 3-part N monogram stage + smooth camera zoom-through */}
        <div className="animate-netflix-camera relative overflow-visible p-3 sm:p-4">
          <svg
            viewBox="0 0 120 156"
            className="h-28 w-24 sm:h-36 sm:w-28 md:h-40 md:w-32 lg:h-48 lg:w-40 overflow-visible drop-shadow-[0_18px_42px_rgba(229,9,20,0.42)]"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="ribbonLeft" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D60A14" />
                <stop offset="100%" stopColor="#7F050B" />
              </linearGradient>
              <linearGradient id="ribbonRight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E50914" />
                <stop offset="100%" stopColor="#8E060D" />
              </linearGradient>
              <linearGradient id="ribbonDiagonal" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FF3B47" />
                <stop offset="58%" stopColor="#E50914" />
                <stop offset="100%" stopColor="#F59E0B" />
              </linearGradient>
            </defs>
            <path
              className="animate-netflix-n-left"
              d="M18 12 H42 V144 L18 148 Z"
              fill="url(#ribbonLeft)"
            />
            <path
              className="animate-netflix-n-right"
              d="M78 12 H102 V148 L78 144 Z"
              fill="url(#ribbonRight)"
            />
            <path
              className="animate-netflix-n-diag"
              d="M18 12 H42 L102 148 H78 Z"
              fill="url(#ribbonDiagonal)"
            />
          </svg>

          {/* Specular cinema beam sweeping across emblem */}
          <div
            aria-hidden="true"
            className="animate-netflix-beam pointer-events-none absolute inset-y-0 left-0 w-16 bg-linear-to-r from-transparent via-white/40 to-transparent"
          />
        </div>

        <div className="animate-netflix-wordmark relative mt-4 sm:mt-5 lg:mt-6 space-y-1.5 sm:space-y-2 max-w-xs sm:max-w-md lg:max-w-xl">
          <p className="font-serif text-2xl font-semibold tracking-wide text-white sm:text-4xl lg:text-5xl text-balance">
            Naufal Athallah
          </p>
          <p className="text-[11px] sm:text-xs md:text-sm font-medium tracking-wider text-stone-300">
            Sastra Inggris UINSA · Kabinet Atarascent · EDSA Executive 2026
          </p>
        </div>
      </div>
    </div>
  );
}
