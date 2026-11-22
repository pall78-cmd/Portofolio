import { useMemo, useState } from 'react';
import { ArrowUpRight, FileSpreadsheet, FolderOpen } from 'lucide-react';
import {
  HRD_ELITION_PROGRESS,
  JOURNEY_MILESTONES,
  ORGANIZATION_REFERENCE,
  PROFILE_IDENTITY,
} from '../data/profileData';
import { playUiSound } from '../utils/soundFx';
import { EditorialImage } from './EditorialImage';

type ElitionTab = 'semua' | 'aspirasi' | 'publikasi';

interface AcademicEdsaSectionProps {
  soundEnabled?: boolean;
}

export function AcademicEdsaSection({ soundEnabled = true }: AcademicEdsaSectionProps) {
  const [elitionTab, setElitionTab] = useState<ElitionTab>('semua');

  const filteredDeliverables = useMemo(() => {
    if (elitionTab === 'semua') {
      return HRD_ELITION_PROGRESS.items;
    }
    return HRD_ELITION_PROGRESS.items.filter((item) => item.group === elitionTab);
  }, [elitionTab]);

  return (
    <section
      id="perjalanan"
      className="reveal-stage scroll-mt-16 border-b border-stone-800 bg-[#0B0C10] text-stone-100"
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-10 lg:py-22">
        {/* Framed Official EDSA Exhibition Header */}
        <div className="overflow-hidden rounded-xl border border-stone-700/80 bg-white shadow-xl shadow-black/40">
          <div className="px-4 py-4 sm:px-8 sm:py-5 lg:px-12 lg:py-6">
            <img
              src={ORGANIZATION_REFERENCE.edsaBannerImage}
              alt={ORGANIZATION_REFERENCE.edsaBannerAlt}
              referrerPolicy="no-referrer"
              className="mx-auto aspect-[4/1] w-full max-w-4xl object-contain"
            />
          </div>
          <div className="flex flex-col gap-1 border-t border-stone-200 bg-[#FAF7F2] px-4 py-3 text-xs font-medium text-stone-700 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4 sm:px-8">
            <span className="font-mono font-semibold text-[#B91C1C]">
              EDSA Executive 2026 · Kabinet Atarascent
            </span>
            <span>English Department Student Association · FAHUM UIN Sunan Ampel Surabaya</span>
          </div>
        </div>

        {/* Section Upper Half:
            - Mobile: 1-col stack
            - Tablet (md): 2-col balanced header+photo row -> 3-col horizontal milestone grid -> 2-col HIMAPRO-SI card
            - Desktop (lg): 12-col Sticky Exhibition Left Rail + Vertical Milestone Ledger & HIMAPRO-SI Right */}
        <div className="mt-10 md:mt-14 lg:mt-16 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12 lg:items-start">
          <div className="lg:sticky lg:top-24 lg:col-span-5">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:items-center md:gap-8 lg:block">
              <div className="md:col-span-6 lg:col-span-12">
                <p className="font-mono text-xs font-semibold tracking-wider text-amber-400">
                  Kampus &amp; Himpunan
                </p>
                <h2 className="mt-2 font-serif text-3xl leading-[1.2] font-semibold tracking-tight text-white sm:text-4xl sm:leading-[1.18] lg:text-[2.6rem] lg:leading-[1.15] text-balance">
                  Sastra Inggris UINSA &amp; <span className="whitespace-nowrap">EDSA 2026</span>
                </h2>
                <p className="mt-3.5 md:mt-4 text-sm font-[450] leading-[1.7] text-stone-300 sm:text-base tracking-[0.01em]">
                  Di FAHUM UIN Sunan Ampel Surabaya, keseharian kuliah sastra berjalan bareng
                  kegiatan organisasi bersama Kabinet Atarascent di himpunan mahasiswa.
                </p>
              </div>

              <div className="md:col-span-6 lg:col-span-12 lg:mt-8">
                <EditorialImage
                  src={ORGANIZATION_REFERENCE.hrdDivisionImage}
                  alt={ORGANIZATION_REFERENCE.hrdDivisionImageAlt}
                  caption={ORGANIZATION_REFERENCE.hrdDivisionCaption}
                  className="rounded-xl shadow-lg shadow-black/40"
                  imgClassName="aspect-[16/10] sm:aspect-[4/3] object-[50%_75%]"
                  dark
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            {/* Milestones: 1-col divide on Mobile, 2-col featured Tablet Matrix (lead spans 2 cols), 1-col Ledger on Desktop */}
            <div className="grid grid-cols-1 divide-y divide-stone-800 border-y border-stone-800 md:grid-cols-2 md:gap-5 md:divide-y-0 md:border-y-0 lg:grid-cols-1 lg:gap-0 lg:divide-y lg:border-y">
              {JOURNEY_MILESTONES.map((item, idx) => (
                <div
                  key={item.index}
                  className={`group py-6 first:pt-5 last:pb-5 md:rounded-xl md:border md:border-stone-800 md:bg-[#111319] md:p-5 lg:rounded-none lg:border-0 lg:bg-transparent lg:py-7 lg:px-0 lg:first:pt-6 lg:last:pb-6 transition-colors ${
                    idx === 0 ? 'md:col-span-2 lg:col-span-1' : ''
                  }`}
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <div className="flex items-baseline gap-2.5 min-w-0">
                      <span className="font-mono text-xs font-semibold text-amber-400 tabular-nums shrink-0">
                        {item.index}.
                      </span>
                      <h3 className="font-serif text-lg leading-[1.32] md:text-lg lg:text-xl lg:leading-[1.28] font-semibold text-white tracking-[0.01em] transition-colors group-hover:text-amber-300">
                        {item.role}
                      </h3>
                    </div>
                    <span className="font-mono text-xs font-medium text-stone-400 tabular-nums whitespace-nowrap shrink-0">
                      {item.period}
                    </span>
                  </div>

                  <p className="mt-2 lg:pl-7 text-xs sm:text-sm font-medium text-stone-200 tracking-[0.01em]">
                    {item.institution}
                  </p>
                  <p className="mt-2.5 lg:pl-7 text-xs sm:text-sm font-[450] leading-[1.7] text-stone-300 tracking-[0.01em]">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Institutional Organization Reference Plate */}
            <div className="mt-8 rounded-xl border border-stone-800 bg-[#12141C] p-5 sm:p-7">
              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-baseline sm:justify-between sm:gap-4">
                <div>
                  <p className="font-mono text-xs font-semibold tracking-wider text-amber-400">
                    Tentang Himpunan
                  </p>
                  <h3 className="mt-1 font-serif text-xl leading-[1.28] sm:text-2xl sm:leading-[1.24] font-semibold text-white">
                    {ORGANIZATION_REFERENCE.name}
                  </h3>
                </div>
                <a
                  href={ORGANIZATION_REFERENCE.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => void playUiSound('hover', soundEnabled)}
                  onClick={() => void playUiSound('tap', soundEnabled)}
                  className="inline-flex min-h-10 items-center gap-1.5 text-xs font-semibold text-amber-300 hover:text-amber-200 hover:underline underline-offset-4 whitespace-nowrap shrink-0"
                >
                  <span>Instagram {ORGANIZATION_REFERENCE.instagramHandle}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                </a>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-12 md:items-center md:gap-6">
                <div className="md:col-span-7">
                  <p className="text-sm font-[450] leading-[1.7] text-stone-300 tracking-[0.01em]">
                    {ORGANIZATION_REFERENCE.summary}
                  </p>
                </div>
                <div className="md:col-span-5">
                  <EditorialImage
                    src={PROFILE_IDENTITY.proseImage}
                    alt={PROFILE_IDENTITY.proseImageAlt}
                    className="rounded-lg"
                    imgClassName="aspect-[16/10] md:aspect-[4/3]"
                    dark
                  />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-5 border-t border-stone-800 pt-5 md:grid-cols-2 md:gap-6">
                {ORGANIZATION_REFERENCE.ecosystems.map((eco) => (
                  <div key={eco.name}>
                    <p className="font-serif text-base leading-[1.32] font-semibold text-white">{eco.name}</p>
                    <p className="mt-1.5 text-xs font-[450] leading-[1.65] text-stone-300 tracking-[0.01em]">
                      {eco.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ELITION Work Program Catalog */}
        <div className="mt-14 md:mt-16 lg:mt-20 border-t border-stone-800 pt-10 md:pt-14">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="font-mono text-xs font-semibold tracking-wider text-amber-400">
                {HRD_ELITION_PROGRESS.eyebrow}
              </p>
              <h3 className="mt-2 font-serif text-2xl leading-[1.24] font-semibold tracking-tight text-white sm:text-3xl sm:leading-[1.2] lg:text-[2.25rem] lg:leading-[1.18] text-balance">
                {HRD_ELITION_PROGRESS.title}
              </h3>
              <p className="mt-3 text-sm font-[450] leading-[1.7] text-stone-300 sm:text-base tracking-[0.01em]">
                {HRD_ELITION_PROGRESS.summary}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2.5 sm:flex sm:flex-wrap sm:items-center sm:gap-3 shrink-0">
              <a
                href={HRD_ELITION_PROGRESS.spreadsheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => void playUiSound('hover', soundEnabled)}
                onClick={() => void playUiSound('open', soundEnabled)}
                className="inline-flex min-h-11 sm:min-h-10 items-center justify-center gap-1.5 rounded-md border border-stone-700 bg-[#14161D] px-4 py-2 text-xs font-semibold text-stone-200 hover:border-amber-400 hover:text-white transition-colors whitespace-nowrap shrink-0"
              >
                <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-400 shrink-0" aria-hidden="true" />
                <span>Rekap Kuesioner (.xlsx)</span>
              </a>
              <a
                href={HRD_ELITION_PROGRESS.driveFolderUrl}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => void playUiSound('hover', soundEnabled)}
                onClick={() => void playUiSound('open', soundEnabled)}
                className="inline-flex min-h-11 sm:min-h-10 items-center justify-center gap-1.5 rounded-md bg-[#C81E1E] px-4 py-2 text-xs font-semibold text-white hover:bg-[#991B1B] transition-colors whitespace-nowrap shrink-0"
              >
                <FolderOpen className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>Buka Drive ELITION</span>
                <ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div
            role="tablist"
            aria-label="Filter kegiatan ELITION"
            className="mt-6 md:mt-7 grid grid-cols-1 gap-1 sm:inline-flex sm:w-auto items-center rounded-lg border border-stone-800 bg-[#12141C] p-1"
          >
            {[
              { id: 'semua' as const, label: 'Semua (5)' },
              { id: 'aspirasi' as const, label: 'Aspirasi & Voting (2)' },
              { id: 'publikasi' as const, label: 'Info & Poster (3)' },
            ].map((tab) => {
              const active = elitionTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onMouseEnter={() => void playUiSound('hover', soundEnabled)}
                  onClick={() => {
                    void playUiSound('tap', soundEnabled);
                    setElitionTab(tab.id);
                  }}
                  className={`min-h-10 sm:min-h-9 rounded-md px-3 sm:px-4 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 ${
                    active
                      ? 'bg-[#C81E1E] text-white'
                      : 'text-stone-300 hover:bg-stone-800 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Responsive Bento Grid:
              - Mobile: 1-col stack
              - Tablet (md): 2-col bento (first odd item spans 2 cols cleanly)
              - Desktop (lg): 6-col Asymmetric Catalog (2 'aspirasi' cards col-span-3 top + 3 'publikasi' cards col-span-2 bottom) */}
          <div className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-6">
            {filteredDeliverables.map((item, idx) => {
              const tabletOddSpan =
                filteredDeliverables.length % 2 === 1 && idx === 0 ? 'md:col-span-2' : 'md:col-span-1';
              const desktopSpan = item.group === 'aspirasi' ? 'lg:col-span-3' : 'lg:col-span-2';

              return (
                <article
                  key={item.id}
                  className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-xl border border-stone-800 bg-gradient-to-b from-[#141722] to-[#101219] p-5 sm:p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-400/50 hover:bg-[#161923] ${tabletOddSpan} ${desktopSpan}`}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute inset-x-0 top-0 h-[2px] ${
                      item.group === 'aspirasi'
                        ? 'bg-gradient-to-r from-emerald-400/75 via-emerald-300/30 to-transparent'
                        : 'bg-gradient-to-r from-amber-400/75 via-[#C81E1E]/60 to-transparent'
                    }`}
                  />
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs tabular-nums">
                      <span
                        className={
                          item.group === 'aspirasi'
                            ? 'font-semibold text-emerald-300'
                            : 'font-semibold text-amber-300'
                        }
                      >
                        {item.category}
                      </span>
                      <span className="font-mono text-sm font-semibold text-amber-400">
                        {item.index}
                      </span>
                    </div>

                    <h4 className="mt-3 font-serif text-lg leading-[1.32] sm:text-xl sm:leading-[1.28] font-semibold text-white transition-colors group-hover:text-amber-300">
                      {item.title}
                    </h4>

                    <p className="mt-1.5 text-xs font-[450] text-stone-400 tabular-nums">
                      {item.scheduleOrSource}
                    </p>

                    <p className="mt-3 text-sm font-[450] leading-[1.68] text-stone-300 tracking-[0.01em]">
                      {item.summary}
                    </p>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-2.5 border-t border-stone-800/90 pt-4">
                    <a
                      href={item.primaryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onMouseEnter={() => void playUiSound('hover', soundEnabled)}
                      onClick={() => void playUiSound('open', soundEnabled)}
                      className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-md border border-stone-700 bg-[#0B0C10] px-3.5 py-2 text-xs font-semibold text-amber-300 hover:border-amber-400 hover:text-white transition-colors whitespace-nowrap shrink-0"
                    >
                      <span>{item.primaryLabel}</span>
                      <ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    </a>
                    {item.secondaryUrl && item.secondaryLabel && (
                      <a
                        href={item.secondaryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onMouseEnter={() => void playUiSound('hover', soundEnabled)}
                        onClick={() => void playUiSound('open', soundEnabled)}
                        className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-md border border-stone-700 px-3.5 py-2 text-xs font-semibold text-stone-200 hover:border-stone-500 hover:text-white transition-colors whitespace-nowrap shrink-0"
                      >
                        <span>{item.secondaryLabel}</span>
                        <ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
