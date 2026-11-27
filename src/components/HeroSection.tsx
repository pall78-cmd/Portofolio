import { ArrowUpRight } from 'lucide-react';
import { OFFICIAL_LINKS, PROFILE_HIGHLIGHTS, PROFILE_IDENTITY } from '../data/profileData';
import { playUiSound } from '../utils/soundFx';
import { EditorialImage } from './EditorialImage';

interface HeroSectionProps {
  soundEnabled: boolean;
}

const MARQUEE_PHRASES = [
  'THRONE OF ASHES (Tahkta Abu)',
  'Kabinet Atarascent · EDSA Executive 2026',
  'Sastra Inggris FAHUM UINSA',
  'Keindahan yang tak utuh',
  'Program Kerja ELITION HRD',
  'Saluran Puisi, Novel(e-book)',
];

export function HeroSection({ soundEnabled }: HeroSectionProps) {
  const wattpadLink = OFFICIAL_LINKS.find((item) => item.id === 'wattpad');
  const instagramLink = OFFICIAL_LINKS.find((item) => item.id === 'instagram');

  return (
    <section
      id="profil"
      className="editorial-grand-stage relative overflow-hidden scroll-mt-16 border-b border-stone-800 text-stone-100"
    >
      <div
        aria-hidden="true"
        className="editorial-ambient-glow-crimson absolute -top-28 -right-24 h-[420px] w-[420px] rounded-full"
      />
      <div
        aria-hidden="true"
        className="editorial-ambient-glow-amber absolute top-12 -left-24 h-[380px] w-[380px] rounded-full"
      />

      <div className="relative mx-auto max-w-7xl px-4 pt-6 pb-10 sm:px-6 md:pt-10 md:pb-14 lg:px-10 lg:pt-12 lg:pb-16">
        {/* Editorial Masthead Rule */}
        <div className="editorial-crest-rule editorial-crest-rule-animated flex flex-col gap-1 pb-4 text-xs font-medium text-stone-400 tabular-nums md:flex-row md:items-center md:justify-between md:gap-6">
          <span className="inline-flex items-center gap-2 font-mono font-semibold tracking-wider text-amber-400">
            <span aria-hidden="true" className="editorial-crest-dot editorial-pulse-dot" />
            <span>Profil &amp; Karya · 2026</span>
          </span>
          <span className="text-stone-300 md:text-right">{PROFILE_IDENTITY.kicker}</span>
        </div>

        {/* Smartphone (<768px): Cover Plate First / Stacked Book-Cover Composition; Tablet (md): 7/5 Spread; Desktop (lg): 12-Col Asymmetric Monograph */}
        <div className="mt-6 md:mt-9 lg:mt-11 grid grid-cols-1 gap-7 md:grid-cols-12 md:items-start md:gap-8 lg:items-stretch lg:gap-12">
          {/* Portrait Frame — renders first on Smartphone (order-1) for poster-cover impact, right column on Tablet/Desktop (md:order-2) */}
          <div className="animate-hero-enter stagger-1 order-1 md:order-2 md:col-span-5 lg:h-full">
            <EditorialImage
              src={PROFILE_IDENTITY.heroImage}
              alt={PROFILE_IDENTITY.heroImageAlt}
              caption="Naufal Athallah Rosiyandi · Halaman Kota Surabaya"
              dark
              className="monument-frame animate-portrait-unveil lg:h-full rounded-xl"
              imgClassName="aspect-[4/3] sm:aspect-[16/10] md:aspect-[4/5] object-[50%_42%] lg:aspect-auto lg:h-full"
            />
          </div>

          {/* Typographic Monograph Column */}
          <div className="animate-hero-enter order-2 md:order-1 flex flex-col justify-between md:col-span-7">
            <div>
              <h1 className="monograph-headline hero-title-glitch font-serif text-[2.15rem] leading-[1.18] font-semibold text-white sm:text-[2.75rem] sm:leading-[1.15] md:text-[3.05rem] md:leading-[1.13] lg:text-[4rem] lg:leading-[1.1] text-balance">
                {PROFILE_IDENTITY.fullName}
              </h1>

              <p className="mt-3.5 md:mt-4 text-sm font-medium text-amber-300/95 md:text-[15px] lg:text-base leading-relaxed tracking-[0.01em]">
                {PROFILE_IDENTITY.subtitle}
              </p>

              <div className="mt-5 md:mt-6 border-t border-stone-800 pt-5 md:pt-6">
                <p className="max-w-2xl text-[15px] font-[450] leading-[1.7] text-stone-200 lg:text-[1.0625rem] tracking-[0.01em]">
                  {PROFILE_IDENTITY.welcomeLead}
                </p>

                <p className="mt-4 max-w-2xl text-sm font-[450] leading-[1.7] text-stone-400 lg:text-[15px] tracking-[0.01em]">
                  {PROFILE_IDENTITY.editorialNote}
                </p>
              </div>

              {/* Desktop Literary Epigraph Pull-Quote (hidden on compact mobile & tablet to keep spread distinct) */}
              <blockquote className="editorial-epigraph hidden lg:block mt-7 px-4 py-4 font-serif text-base italic leading-[1.65] text-stone-200">
                &ldquo;Di dunia di mana pengetahuan merupakan toksin, ketidaktahuan merupakan
                satu-satunya pelindung, serta kegilaan merupakan satu-satunya tangga mengarah
                takhta.&rdquo;
                <footer className="mt-2 font-sans text-xs font-[450] not-italic text-stone-400">
                  Dari serial <span className="font-medium text-amber-300">THRONE OF ASHES (Tahkta Abu)</span>
                </footer>
              </blockquote>
            </div>

            {/* Distinct CTA Alignment: Full-width stack on Mobile, Horizontal row on Tablet & Desktop */}
            <div className="mt-6 md:mt-7 lg:mt-8 grid grid-cols-1 gap-3 border-t border-stone-800 pt-5 sm:grid-cols-2 md:flex md:flex-wrap md:items-center md:gap-4 md:pt-6">
              {wattpadLink && (
                <a
                  href={wattpadLink.url}
                  target="_blank"
                  rel="me noopener noreferrer"
                  onMouseEnter={() => void playUiSound('hover', soundEnabled)}
                  onClick={() => void playUiSound('open', soundEnabled)}
                  className="group btn-press btn-monumental inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[#C81E1E] px-5 py-2.5 text-xs lg:text-sm font-semibold text-white hover:bg-[#9E1414] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
                >
                  <span>{wattpadLink.ctaLabel}</span>
                  <ArrowUpRight className="arrow-glide-ne h-4 w-4 shrink-0" aria-hidden="true" />
                </a>
              )}

              {instagramLink && (
                <a
                  href={instagramLink.url}
                  target="_blank"
                  rel="me noopener noreferrer"
                  onMouseEnter={() => void playUiSound('hover', soundEnabled)}
                  onClick={() => void playUiSound('tap', soundEnabled)}
                  className="group btn-press inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-stone-700 bg-[#14161D] px-5 py-2.5 text-xs lg:text-sm font-semibold text-stone-100 hover:border-amber-400 hover:text-white whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
                >
                  <span>{instagramLink.ctaLabel}</span>
                  <ArrowUpRight className="arrow-glide-ne h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Distinct Highlight Strip per device:
            - Smartphone (<768px): 2x2 compact non-stacking bento tiles (grid-cols-2 gap-2.5)
            - Tablet (768px–1023px): 2x2 wide architectural plaques (md:grid-cols-2 md:gap-4)
            - Desktop (>=1024px): 4-column unified folio bar with vertical hairline rules */}
        <div className="mt-8 md:mt-11 lg:mt-14 grid grid-cols-2 gap-2.5 md:grid-cols-2 md:gap-4 lg:grid-cols-4 lg:gap-0 lg:overflow-hidden lg:rounded-xl lg:border lg:border-stone-800 lg:divide-x lg:divide-stone-800">
          {PROFILE_HIGHLIGHTS.map((item, idx) => (
            <div
              key={item.label}
              className={`panel-card folio-plaque-dark editorial-plaque-glow stagger-card stagger-${idx + 1} group relative flex flex-col justify-between overflow-hidden rounded-xl border border-stone-800/90 bg-gradient-to-b from-[#151823] to-[#0E1016] p-3.5 sm:p-4 md:p-5 lg:rounded-none lg:border-0 lg:bg-none lg:bg-[#111319] lg:p-6 hover:border-amber-400/45 lg:hover:bg-[#161922]`}
            >
              <span
                aria-hidden="true"
                className="panel-accent-sweep pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#C81E1E]/85 via-amber-400/70 to-transparent opacity-75 group-hover:opacity-100"
              />
              <div>
                <div className="flex items-center justify-between gap-2 text-[11px] sm:text-xs tabular-nums">
                  <span className="font-semibold text-amber-400 truncate">{item.label}</span>
                  <span className="font-mono text-stone-500 shrink-0">0{idx + 1}</span>
                </div>
                <p className="mt-2 font-serif text-[15px] leading-[1.32] sm:text-lg sm:leading-[1.28] lg:text-xl lg:leading-[1.26] font-semibold text-white tracking-[0.01em]">
                  {item.value}
                </p>
              </div>
              <p className="mt-1.5 md:mt-2.5 text-[11px] sm:text-xs font-[450] leading-[1.55] text-stone-400 tracking-[0.01em]">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Literary Broadsheet Marquee Divider */}
      <div
        aria-hidden="true"
        className="editorial-marquee-wrap overflow-hidden border-t border-stone-800 bg-[#07080B] py-2.5 md:py-3 text-[11px] md:text-xs font-medium tracking-wider text-stone-300"
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
