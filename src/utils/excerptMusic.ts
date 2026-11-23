export interface ExcerptSpec {
  readonly sourceUrl: string;
  readonly videoId: string;
  readonly fallbackVideoId: string;
  readonly title: string;
  readonly artist: string;
  readonly postIntroDelayMs: number;
  readonly startSec: number;
  readonly endSec: number;
  readonly fadeInSec: number;
  readonly fadeOutSec: number;
  readonly peakVolume: number;
  readonly minStartVolume: number;
  readonly lyricLines: readonly string[];
}

export const EMPTY_MAGNOLIA_EXCERPT: ExcerptSpec = {
  sourceUrl: 'https://music.youtube.com/watch?v=pCmID52lk6Y&si=Jk5Nc77bR3PXn_ry',
  videoId: 'pCmID52lk6Y',
  fallbackVideoId: 'u95YOPIeOD4',
  title: 'Empty',
  artist: 'Magnolia Celebration',
  postIntroDelayMs: 2000,
  // Target verse [01:55.83] - [02:24.62] (+ instrumental release ending before [02:35.06])
  startSec: 115.4,
  endSec: 151.5,
  fadeInSec: 2.4,
  fadeOutSec: 3.0,
  peakVolume: 88,
  minStartVolume: 4,
  lyricLines: [
    'Lonely space in my head and a staggering voice of yours',
    'Smoking red with a piece of word',
    'Lonely space in my head and a staggering voice of yours',
    'Calmly saying in your lips',
    "I've had enough",
    "And once again my head's empty",
  ],
};

export type ExcerptEnvelopePhase = 'before' | 'fade-in' | 'sustain' | 'fade-out' | 'ended';

export interface ExcerptEnvelopeState {
  volume: number;
  phase: ExcerptEnvelopePhase;
  shouldStop: boolean;
}

function clamp01(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.max(0, Math.min(1, value));
}

function smoothCosineEase(t: number): number {
  const clamped = clamp01(t);
  return 0.5 - 0.5 * Math.cos(Math.PI * clamped);
}

/**
 * Computes YouTube IFrame player volume (0-100) for the given playback position
 * so the track fades smoothly in from quiet to peak and fades smoothly down to silence
 * strictly inside the target lyric window.
 */
export function computeExcerptEnvelope(
  currentTimeSec: number,
  spec: ExcerptSpec = EMPTY_MAGNOLIA_EXCERPT
): ExcerptEnvelopeState {
  if (!Number.isFinite(currentTimeSec)) {
    return { volume: 0, phase: 'before', shouldStop: false };
  }

  if (currentTimeSec >= spec.endSec) {
    return { volume: 0, phase: 'ended', shouldStop: true };
  }

  // Allow tiny seek tolerance before startSec so initial seek jitter never pauses playback prematurely
  if (currentTimeSec < spec.startSec - 0.35) {
    return { volume: 0, phase: 'before', shouldStop: false };
  }

  const fadeInEnd = spec.startSec + spec.fadeInSec;
  const fadeOutStart = Math.max(fadeInEnd, spec.endSec - spec.fadeOutSec);

  if (currentTimeSec <= fadeInEnd) {
    const progress =
      spec.fadeInSec > 0 ? clamp01((currentTimeSec - spec.startSec) / spec.fadeInSec) : 1;
    const eased = smoothCosineEase(progress);
    const volume = Math.round(
      spec.minStartVolume + (spec.peakVolume - spec.minStartVolume) * eased
    );
    return {
      volume: Math.max(0, Math.min(100, volume)),
      phase: 'fade-in',
      shouldStop: false,
    };
  }

  if (currentTimeSec >= fadeOutStart) {
    const remainingWindow = Math.max(0.05, spec.endSec - fadeOutStart);
    const progress = clamp01((currentTimeSec - fadeOutStart) / remainingWindow);
    const eased = smoothCosineEase(progress);
    const volume = Math.round(spec.peakVolume * (1 - eased));
    return {
      volume: Math.max(0, Math.min(100, volume)),
      phase: 'fade-out',
      shouldStop: false,
    };
  }

  return {
    volume: Math.max(0, Math.min(100, Math.round(spec.peakVolume))),
    phase: 'sustain',
    shouldStop: false,
  };
}

export function extractYouTubeVideoId(urlOrId: string): string | null {
  const trimmed = urlOrId.trim();
  if (!trimmed) {
    return null;
  }

  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    const vParam = parsed.searchParams.get('v');
    if (vParam && /^[a-zA-Z0-9_-]{11}$/.test(vParam)) {
      return vParam;
    }

    const segments = parsed.pathname.split('/').filter(Boolean);
    const lastSegment = segments[segments.length - 1];
    if (lastSegment && /^[a-zA-Z0-9_-]{11}$/.test(lastSegment)) {
      return lastSegment;
    }
  } catch {
    return null;
  }

  return null;
}

export function buildYouTubeEmbedUrl(options: {
  videoId: string;
  origin?: string;
  startSec?: number;
}): string {
  const params = new URLSearchParams({
    enablejsapi: '1',
    playsinline: '1',
    controls: '0',
    disablekb: '1',
    fs: '0',
    rel: '0',
    modestbranding: '1',
    iv_load_policy: '3',
  });

  if (typeof options.startSec === 'number' && Number.isFinite(options.startSec)) {
    params.set('start', String(Math.max(0, Math.floor(options.startSec))));
  }

  if (options.origin && /^https?:\/\//i.test(options.origin)) {
    params.set('origin', options.origin);
  }

  return `https://www.youtube.com/embed/${encodeURIComponent(options.videoId)}?${params.toString()}`;
}
