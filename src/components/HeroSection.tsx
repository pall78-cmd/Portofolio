import { ArrowUpRight, Volume2, VolumeX } from 'lucide-react';
import { OFFICIAL_LINKS, PROFILE_HIGHLIGHTS, PROFILE_IDENTITY } from '../data/profileData';
import { playUiSound } from '../utils/soundFx';
import { EditorialImage } from './EditorialImage';

interface HeroSectionProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
}

const MARQUEE_PHRASES = [
  'THRONE OF ASHES (Tahkta Abu)',
  'Kabinet Atarascent · EDSA Executive 2026',
  'Sastra Inggris FAHUM UINSA',
  'Keindahan yang tak utuh',
  'Program Kerja ELITION HRD',
  'Saluran Puisi, Novel(e-book)',
];

export function HeroSection({ soundEnabled, onToggleSound }: HeroSectionProps) {
  const wattpadLink = OFFICIAL_LINKS.find((item) => item.id === 'wattpad');
  const instagramLink = OFFICIAL_LINKS.find((item) => item.id === 'instagram');

  return (
    <section
      id="profil"
      className="reveal-stage scroll-mt-16 border-b border-stone-800 bg-[#FAF7F2]"
    >
      <div className="mx-auto max-w-6xl px-4 pt-6 pb-10 sm:px-6 md:pt-10 md:pb-14 lg:px-8 lg:pt-14 lg:pb-16">
        <div className="flex flex-col gap-1.5 border-b border-stone-300/90 pb-3 text-xs font-medium text-stone-600 tabular-nums md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-4">
          <span className="font-mono font-semibold text-[#C81E1E]">
            Edisi 2026 · Arsip Profil &amp; Sastra
          </span>
          <span className="text-stone-600">{PROFILE_IDENTITY.kicker}</span>
        </div>

        <div className="mt-6 md:mt-8 lg:mt-10 grid grid-cols-1 gap-8 md:grid-cols-12 md:items-start md:gap-8 lg:items-stretch lg:gap-12">
          <div className="flex flex-col justify-between md:col-span-7">
            <div>
              <h1 className="font-serif text-[2rem] leading-[1.1] font-semibold tracking-tight text-stone-950 sm:text-4xl md:text-[2.65rem] md:leading-[1.06] lg:text-[4rem] lg:leading-[1.03] text-balance">
                {PROFILE_IDENTITY.fullName}
              </h1>

              <p className="mt-3 md:mt-4 text-sm font-medium text-stone-700 md:text-[15px] lg:text-base">
                {PROFILE_IDENTITY.subtitle}
              </p>

              <p className="mt-4 md:mt-5 lg:mt-6 max-w-2xl text-[15px] leading-relaxed text-stone-800 lg:text-[1.0625rem]">
                {PROFILE_IDENTITY.welcomeLead}
              </p>

              <p className="mt-3 md:mt-4 max-w-2xl text-sm leading-relaxed text-stone-600">
                {PROFILE_IDENTITY.editorialNote}
              </p>
            </div>

            <div className="mt-6 md:mt-7 lg:mt-8 grid grid-cols-2 gap-2.5 border-t border-stone-300/90 pt-5 md:flex md:flex-wrap md:items-center md:pt-6">
              {wattpadLink && (
                <a
                  href={wattpadLink.url}
                  target="_blank"
                  rel="me noopener noreferrer"
                  onClick={() => void playUiSound('open', soundEnabled)}
                  className="col-span-2 md:col-span-1 inline-flex min-h-11 items-center justify-center md:justify-start gap-1.5 rounded-md bg-[#C81E1E] px-4 py-2.5 text-xs lg:text-sm font-semibold text-white hover:bg-[#991B1B] transition-all duration-200 hover:-translate-y-0.5 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C81E1E]"
                >
                  <span>{wattpadLink.ctaLabel}</span>
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
              )}

              {instagramLink && (
                <a
                  href={instagramLink.url}
                  target="_blank"
                  rel="me noopener noreferrer"
                  onClick={() => void playUiSound('tap', soundEnabled)}
                  className="inline-flex min-h-11 items-center justify-center md:justify-start gap-1 rounded-md border border-stone-400 bg-white px-2.5 sm:px-4 py-2.5 text-[11px] sm:text-xs lg:text-sm font-semibold text-stone-900 hover:border-[#0C0D10] hover:bg-stone-100 transition-colors duration-200 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C81E1E]"
                >
                  <span>{instagramLink.ctaLabel}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 text-stone-500" aria-hidden="true" />
                </a>
              )}

              <button
                type="button"
                onClick={onToggleSound}
                aria-pressed={soundEnabled}
                className="inline-flex min-h-11 items-center justify-center md:justify-start gap-1.5 rounded-md border border-stone-300 bg-[#F3EEE4] px-2.5 sm:px-3.5 py-2.5 text-[11px] sm:text-xs font-semibold text-stone-800 hover:border-stone-500 hover:bg-stone-200/70 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C81E1E]"
              >
                {soundEnabled ? (
                  <Volume2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 text-[#C81E1E]" aria-hidden="true" />
                ) : (
                  <VolumeX className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 text-stone-500" aria-hidden="true" />
                )}
                <span>
                  {soundEnabled ? 'Efek Suara: Aktif' : 'Efek Suara: Senyap'}
                </span>
              </button>
            </div>
          </div>

          <div className="md:col-span-5 lg:h-full">
            <EditorialImage
              src={PROFILE_IDENTITY.heroImage}
              alt={PROFILE_IDENTITY.heroImageAlt}
              caption="Naufal Athallah Rosiyandi · Halaman Kota Surabaya"
              className="lg:h-full rounded-lg shadow-sm"
              imgClassName="aspect-[5/4] sm:aspect-[4/3] md:aspect-[4/5] object-[50%_46%] lg:aspect-auto lg:h-full"
            />
          </div>
        </div>

        <div className="mt-8 md:mt-10 lg:mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-stone-800 bg-stone-800 text-stone-100 md:grid-cols-2 lg:grid-cols-4">
          {PROFILE_HIGHLIGHTS.map((item) => (
            <div key={item.label} className="flex flex-col bg-[#0C0D10] p-5 md:p-6">
              <span className="text-xs font-semibold tracking-wide text-amber-400">
                {item.label}
              </span>
              <span className="mt-1.5 font-serif text-lg font-semibold text-white tracking-[0.01em]">
                {item.value}
              </span>
              <span className="mt-1 text-xs text-stone-300 tracking-[0.01em]">
                {item.detail}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div
        aria-hidden="true"
        className="editorial-marquee-wrap overflow-hidden border-t border-stone-800 bg-[#0C0D10] py-2.5 md:py-3 text-[11px] md:text-xs font-medium tracking-wide text-stone-300"
      >
        <div className="editorial-marquee-track">
          {[0, 1].map((dupIndex) => (
            <div key={dupIndex} className="flex items-center gap-6 pr-6 whitespace-nowrap">
              {MARQUEE_PHRASES.map((phrase) => (
                <span key={`${dupIndex}-${phrase}`} className="inline-flex items-center gap-6">
                  <span>{phrase}</span>
                  <span className="text-[#C81E1E]">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
