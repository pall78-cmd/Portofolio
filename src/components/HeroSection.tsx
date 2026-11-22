import { ArrowUpRight } from 'lucide-react';
import { OFFICIAL_LINKS, PROFILE_HIGHLIGHTS, PROFILE_IDENTITY } from '../data/profileData';
import { EditorialImage } from './EditorialImage';

export function HeroSection() {
  const wattpadLink = OFFICIAL_LINKS.find((item) => item.id === 'wattpad');
  const instagramLink = OFFICIAL_LINKS.find((item) => item.id === 'instagram');

  return (
    <section id="profil" className="scroll-mt-16 border-b border-slate-200 bg-[#F4F6FA]">
      <div className="mx-auto max-w-6xl px-6 py-10 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-stretch lg:gap-12">
          <div className="flex flex-col justify-between lg:col-span-7">
            <div>
              <p className="text-xs font-semibold tracking-wide text-blue-700">
                {PROFILE_IDENTITY.kicker}
              </p>

              <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-[3.5rem] lg:leading-[1.08] text-balance">
                {PROFILE_IDENTITY.fullName}
              </h1>

              <p className="mt-4 text-sm font-medium text-slate-700">
                {PROFILE_IDENTITY.subtitle}
              </p>

              <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-800 sm:text-[1.0625rem]">
                {PROFILE_IDENTITY.welcomeLead}
              </p>

              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600">
                {PROFILE_IDENTITY.editorialNote}
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4 pt-6 border-t border-slate-200/90">
              {wattpadLink && (
                <a
                  href={wattpadLink.url}
                  target="_blank"
                  rel="me noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
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
                  className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 hover:border-blue-700 hover:text-blue-700 transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                >
                  <span>{instagramLink.ctaLabel}</span>
                  <ArrowUpRight className="h-4 w-4 text-slate-500" aria-hidden="true" />
                </a>
              )}
            </div>
          </div>

          <div className="lg:col-span-5">
            <EditorialImage
              src={PROFILE_IDENTITY.heroImage}
              alt={PROFILE_IDENTITY.heroImageAlt}
              className="h-full rounded-lg border-slate-300/80 shadow-sm"
              imgClassName="aspect-[4/5] object-[50%_48%] lg:aspect-auto lg:h-full"
            />
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 rounded-lg bg-[#0B1120] p-6 sm:p-8 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-slate-100">
          {PROFILE_HIGHLIGHTS.map((item) => (
            <div key={item.label} className="flex flex-col">
              <span className="text-xs font-semibold tracking-wide text-amber-400">{item.label}</span>
              <span className="mt-1.5 font-serif text-lg font-semibold text-white tracking-[0.01em]">
                {item.value}
              </span>
              <span className="mt-1 text-xs text-slate-300 tracking-[0.01em]">{item.detail}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
