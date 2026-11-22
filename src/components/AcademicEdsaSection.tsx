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
      className="reveal-stage scroll-mt-16 border-b border-stone-800 bg-[#0C0D10] text-stone-100"
    >
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16 lg:px-8 lg:py-20">
        <div className="overflow-hidden rounded-xl border border-stone-700/80 bg-white shadow-sm">
          <div className="px-3 py-3 sm:px-8 sm:py-4 lg:px-10 lg:py-5">
            <img
              src={ORGANIZATION_REFERENCE.edsaBannerImage}
              alt={ORGANIZATION_REFERENCE.edsaBannerAlt}
              referrerPolicy="no-referrer"
              className="mx-auto aspect-[4/1] w-full max-w-3xl object-contain"
            />
          </div>
          <div className="flex flex-col gap-1 border-t border-stone-200 bg-[#FAF7F2] px-4 py-2.5 text-xs font-medium text-stone-700 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-3 sm:px-6">
            <span className="font-mono font-semibold text-[#C81E1E]">
              EDSA Executive 2026 · Kabinet Atarascent
            </span>
            <span>English Department Student Association · FAHUM UIN Sunan Ampel Surabaya</span>
          </div>
        </div>

        <div className="mt-10 md:mt-12 lg:mt-14 grid grid-cols-1 gap-10 md:grid-cols-12 lg:gap-12 lg:items-start">
          <div className="md:col-span-12 lg:sticky lg:top-24 lg:col-span-5">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:items-center md:gap-8 lg:block">
              <div className="md:col-span-6">
                <p className="text-xs font-semibold tracking-wide text-amber-400">
                  Akademik &amp; Organisasi
                </p>
                <h2 className="mt-2 font-serif text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl text-balance">
                  Sastra Inggris FAHUM UINSA &amp;{' '}
                  <span className="whitespace-nowrap">EDSA 2026</span> · Kabinet Atarascent
                </h2>
                <p className="mt-3 md:mt-4 text-sm leading-relaxed text-stone-300 sm:text-base tracking-[0.01em]">
                  Keterlibatan di lingkungan Fakultas Adab dan Humaniora (FAHUM) Universitas Islam
                  Negeri Sunan Ampel Surabaya mempertemukan ketekunan membaca teks sastra dengan
                  kerja kolektif himpunan mahasiswa.
                </p>
              </div>

              <div className="md:col-span-6 lg:mt-8">
                <EditorialImage
                  src={ORGANIZATION_REFERENCE.hrdDivisionImage}
                  alt={ORGANIZATION_REFERENCE.hrdDivisionImageAlt}
                  caption={ORGANIZATION_REFERENCE.hrdDivisionCaption}
                  className="rounded-lg"
                  imgClassName="aspect-[16/10] sm:aspect-[4/3] object-[50%_80%]"
                  dark
                />
              </div>
            </div>
          </div>

          <div className="md:col-span-12 lg:col-span-7">
            <div className="divide-y divide-stone-800 border-y border-stone-800">
              {JOURNEY_MILESTONES.map((item) => (
                <div
                  key={item.index}
                  className="group py-6 md:py-7 first:pt-5 md:first:pt-6 last:pb-5 md:last:pb-6 transition-colors"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <div className="flex items-baseline gap-2.5 sm:gap-3 min-w-0">
                      <span className="font-mono text-xs font-semibold text-[#F59E0B] tabular-nums shrink-0">
                        {item.index}.
                      </span>
                      <h3 className="font-serif text-lg sm:text-xl font-semibold text-white tracking-[0.01em] transition-colors group-hover:text-amber-300">
                        {item.role}
                      </h3>
                    </div>
                    <span className="text-xs font-medium text-stone-400 tabular-nums whitespace-nowrap shrink-0">
                      {item.period}
                    </span>
                  </div>

                  <p className="mt-1.5 pl-6 sm:pl-7 text-sm font-medium text-stone-200 tracking-[0.01em]">
                    {item.institution}
                  </p>
                  <p className="mt-2.5 pl-6 sm:pl-7 text-sm leading-relaxed text-stone-300 tracking-[0.01em]">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-xl border border-stone-800 bg-[#14161D] p-5 sm:p-6 md:p-7">
              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-baseline sm:justify-between sm:gap-4">
                <div>
                  <p className="text-xs font-semibold tracking-wide text-[#F87171]">
                    Rujukan Organisasi Resmi
                  </p>
                  <h3 className="mt-1 font-serif text-xl font-semibold text-white">
                    {ORGANIZATION_REFERENCE.name}
                  </h3>
                </div>
                <a
                  href={ORGANIZATION_REFERENCE.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => void playUiSound('tap', soundEnabled)}
                  className="inline-flex min-h-9 items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 hover:underline underline-offset-4 whitespace-nowrap shrink-0"
                >
                  <span>Instagram {ORGANIZATION_REFERENCE.instagramHandle}</span>
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-12 md:items-center md:gap-6">
                <div className="md:col-span-7">
                  <p className="text-sm leading-relaxed text-stone-300 tracking-[0.01em]">
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
                    <p className="text-sm font-semibold text-white">{eco.name}</p>
                    <p className="mt-1 text-xs leading-relaxed text-stone-300 tracking-[0.01em]">
                      {eco.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 md:mt-14 lg:mt-16 border-t border-stone-800 pt-10 md:pt-12">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold tracking-wide text-[#F87171]">
                {HRD_ELITION_PROGRESS.eyebrow}
              </p>
              <h3 className="mt-2 font-serif text-2xl font-semibold tracking-tight text-white sm:text-3xl text-balance">
                {HRD_ELITION_PROGRESS.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-stone-300 tracking-[0.01em]">
                {HRD_ELITION_PROGRESS.summary}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2.5 sm:flex sm:flex-wrap sm:items-center sm:gap-3 shrink-0">
              <a
                href={HRD_ELITION_PROGRESS.spreadsheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => void playUiSound('open', soundEnabled)}
                className="inline-flex min-h-11 sm:min-h-10 items-center justify-center gap-1.5 rounded-md border border-stone-700 bg-[#14161D] px-4 py-2 text-xs font-semibold text-stone-200 hover:border-amber-400 hover:text-white transition-colors whitespace-nowrap shrink-0"
              >
                <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
                <span>Rekap Kuesioner (.xlsx)</span>
              </a>
              <a
                href={HRD_ELITION_PROGRESS.driveFolderUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => void playUiSound('open', soundEnabled)}
                className="inline-flex min-h-11 sm:min-h-10 items-center justify-center gap-1.5 rounded-md bg-[#C81E1E] px-4 py-2 text-xs font-semibold text-white hover:bg-[#991B1B] transition-colors whitespace-nowrap shrink-0"
              >
                <FolderOpen className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Folder Drive ELITION</span>
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div
            role="tablist"
            aria-label="Filter progres ELITION"
            className="mt-6 md:mt-7 flex flex-wrap w-full sm:inline-flex sm:w-auto items-center gap-1 rounded-md border border-stone-800 bg-[#14161D] p-1"
          >
            {[
              { id: 'semua' as const, label: 'Semua Progres (5)' },
              { id: 'aspirasi' as const, label: 'Aspirasi & Voting (2)' },
              { id: 'publikasi' as const, label: 'Kurasi & Poster (3)' },
            ].map((tab) => {
              const active = elitionTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    void playUiSound('tap', soundEnabled);
                    setElitionTab(tab.id);
                  }}
                  className={`flex-1 sm:flex-none min-h-9 rounded px-2.5 sm:px-3.5 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 ${
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

          <div className="mt-6 divide-y divide-stone-800 border-y border-stone-800">
            {filteredDeliverables.map((item) => (
              <article
                key={item.id}
                className="group flex flex-col gap-4 py-6 transition-colors hover:bg-[#14161D]/70 md:px-4 lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="flex items-start gap-3.5 sm:gap-4 max-w-2xl">
                  <span className="font-mono text-lg font-semibold text-amber-400 tabular-nums shrink-0 pt-0.5">
                    {item.index}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-stone-400 tabular-nums">
                      <span
                        className={
                          item.group === 'aspirasi'
                            ? 'font-medium text-emerald-300'
                            : 'font-medium text-amber-300'
                        }
                      >
                        {item.category}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{item.scheduleOrSource}</span>
                    </div>
                    <h4 className="mt-1.5 font-serif text-lg font-semibold text-white leading-snug transition-colors group-hover:text-amber-300">
                      {item.title}
                    </h4>
                    <p className="mt-1.5 text-sm leading-relaxed text-stone-300 tracking-[0.01em]">
                      {item.summary}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pl-7 sm:pl-9 lg:pl-0 shrink-0">
                  <a
                    href={item.primaryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => void playUiSound('open', soundEnabled)}
                    className="inline-flex min-h-10 sm:min-h-9 items-center gap-1.5 rounded-md border border-stone-700 bg-[#14161D] px-3.5 py-1.5 text-xs font-semibold text-amber-300 hover:border-amber-400 hover:text-white transition-colors whitespace-nowrap shrink-0"
                  >
                    <span>{item.primaryLabel}</span>
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                  {item.secondaryUrl && item.secondaryLabel && (
                    <a
                      href={item.secondaryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => void playUiSound('open', soundEnabled)}
                      className="inline-flex min-h-10 sm:min-h-9 items-center gap-1.5 rounded-md border border-stone-700 px-3.5 py-1.5 text-xs font-semibold text-stone-200 hover:border-stone-500 hover:text-white transition-colors whitespace-nowrap shrink-0"
                    >
                      <span>{item.secondaryLabel}</span>
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
