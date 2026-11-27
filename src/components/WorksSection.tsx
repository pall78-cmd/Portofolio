import { useMemo, useState } from 'react';
import { ArrowRight, ArrowUpRight, BookMarked, Feather, Search, X } from 'lucide-react';
import { WRITING_WORKS, type WritingWork } from '../data/profileData';
import {
  WORK_CATEGORIES,
  type CategoryFilter,
  filterWorks,
} from '../utils/portfolio';
import { playUiSound } from '../utils/soundFx';
import { EditorialImage } from './EditorialImage';

function WorkCoverPlate({ work }: { work: WritingWork }) {
  if (work.imageUrl) {
    return (
      <EditorialImage
        src={work.imageUrl}
        alt={work.imageAlt ?? work.title}
        className="rounded-lg"
        imgClassName="aspect-[16/10] sm:aspect-[4/3]"
      />
    );
  }

  if (work.category === 'Puisi') {
    return (
      <div className="editorial-ink-plate relative flex aspect-[16/10] sm:aspect-[4/3] w-full flex-col justify-between overflow-hidden rounded-lg border border-stone-800 p-3.5 sm:p-4 text-stone-100">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-2 rounded border border-amber-300/20"
        />
        <div className="relative flex items-center justify-between gap-2 text-[11px] font-mono text-amber-300/90 tabular-nums">
          <span className="whitespace-nowrap">Sajak · {work.index}</span>
          <Feather className="h-3.5 w-3.5 shrink-0 text-amber-300/80" aria-hidden="true" />
        </div>
        <div className="relative my-auto py-1 text-center">
          <p className="font-serif text-[15px] sm:text-base italic leading-[1.35] text-white/95">
            &ldquo;Sajak bernuansa sendu&rdquo;
          </p>
          <p className="mt-1 text-[11px] font-[450] tracking-wide text-stone-300">
            #melankolis · {work.publishedDate}
          </p>
        </div>
        <div className="relative flex items-center justify-between gap-2 border-t border-stone-700/70 pt-1.5 text-[11px] text-stone-300">
          <span className="truncate">@NaufalAthallah</span>
          <span className="font-mono text-amber-300/85 whitespace-nowrap shrink-0">1 Bagian</span>
        </div>
      </div>
    );
  }

  return (
    <div className="editorial-paper-grid relative flex aspect-[16/10] sm:aspect-[4/3] w-full flex-col justify-between overflow-hidden rounded-lg border border-stone-300 p-3.5 sm:p-4 text-stone-900">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-[#C81E1E]"
      />
      <div className="relative flex items-center justify-between gap-2 pt-0.5 text-[11px] font-mono text-[#B91C1C] tabular-nums">
        <span className="whitespace-nowrap">Saluran · {work.index}</span>
        <BookMarked className="h-3.5 w-3.5 shrink-0 text-[#B91C1C]" aria-hidden="true" />
      </div>
      <div className="relative my-auto rounded-md border border-stone-300/90 bg-white/88 px-3 py-2.5 shadow-xs backdrop-blur-[1px]">
        <p className="font-serif text-sm italic leading-[1.38] text-stone-900">
          &ldquo;Sudut kecil tempat ide-ide bermuara.&rdquo;
        </p>
        <p className="mt-1 text-[11px] font-[450] text-stone-600 line-clamp-1">
          E-book orisinal &amp; puisi Naufal
        </p>
      </div>
      <div className="relative flex items-center justify-between gap-2 border-t border-stone-300/80 pt-1.5 text-[11px] font-medium text-stone-700 tabular-nums">
        <span className="truncate">WhatsApp Channel</span>
        <span className="font-mono text-[#B91C1C] whitespace-nowrap shrink-0">43 Pengikut</span>
      </div>
    </div>
  );
}

interface WorksSectionProps {
  onSelectWork: (work: WritingWork) => void;
  soundEnabled?: boolean;
}

export function WorksSection({ onSelectWork, soundEnabled = true }: WorksSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  const visibleWorks = useMemo(
    () => filterWorks(WRITING_WORKS, selectedCategory, searchQuery),
    [selectedCategory, searchQuery]
  );

  const featuredLead = visibleWorks.find((work) => work.id === 'throne-of-ashes-tahkta-abu') ?? null;
  const folioRows = featuredLead
    ? visibleWorks.filter((work) => work.id !== featuredLead.id)
    : visibleWorks;

  const handleHoverSound = () => {
    void playUiSound('hover', soundEnabled);
  };

  const handleResetFilters = () => {
    void playUiSound('tap', soundEnabled);
    setSelectedCategory('Semua');
    setSearchQuery('');
  };

  const handleOpenWork = (work: WritingWork) => {
    void playUiSound('open', soundEnabled);
    onSelectWork(work);
  };

  const gridColsClass =
    folioRows.length === 1
      ? 'grid-cols-1'
      : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-12';

  return (
    <section
      id="karya"
      className="editorial-archival-surface scroll-mt-16 border-b border-stone-300 text-stone-950"
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-10 lg:py-22">
        <div
          data-reveal
          className="editorial-crest-rule-light editorial-crest-rule-animated flex flex-col gap-4 pb-6 md:flex-row md:items-end md:justify-between md:gap-8"
        >
          <div className="max-w-2xl">
            <p className="font-mono text-xs font-semibold tracking-wider text-[#B91C1C]">
              Tulisan &amp; Buku
            </p>
            <h2 className="mt-2 font-serif text-3xl leading-[1.2] font-semibold tracking-tight text-stone-950 sm:text-4xl sm:leading-[1.18] lg:text-[2.75rem] lg:leading-[1.15] text-balance">
              Karya Pilihan
            </h2>
            <p className="mt-3 text-sm font-[450] leading-[1.7] text-stone-700 sm:text-base">
              Cerita bersambung, puisi, dan e-book yang ditulis serta dibagikan lewat Wattpad
              (@NaufalAthallah) dan saluran WhatsApp <em>Puisi, Novel(e-book)</em>.
            </p>
          </div>

          <div className="shrink-0 font-mono text-xs font-medium text-stone-600 tabular-nums">
            <span>
              Menampilkan {visibleWorks.length} dari {WRITING_WORKS.length} karya
            </span>
          </div>
        </div>

        {/* Interactive Filter Bar — Mobile 2x2 tabs + stacked search; Tablet/Desktop inline toolbar */}
        <div className="mt-6 md:mt-7 flex flex-col gap-3.5 md:flex-row md:items-center md:justify-between md:gap-4 border-b border-stone-300/80 pb-5">
          <div
            role="tablist"
            aria-label="Filter kategori karya tulis"
            className="grid grid-cols-2 gap-1 rounded-lg border border-stone-300/80 bg-white p-1 md:inline-flex md:flex-wrap md:items-center"
          >
            {WORK_CATEGORIES.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onMouseEnter={handleHoverSound}
                  onClick={() => {
                    void playUiSound('tap', soundEnabled);
                    setSelectedCategory(category);
                  }}
                  className={`btn-press min-h-10 md:min-h-9 rounded-md px-2.5 sm:px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C81E1E] ${
                    isActive
                      ? 'bg-[#0B0C10] text-white shadow-xs'
                      : 'text-stone-700 hover:bg-[#FAF7F2] hover:text-stone-950'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          <div className="relative w-full md:w-64 lg:w-80 shrink-0">
            <label htmlFor="works-search" className="sr-only">
              Cari judul atau tema cerita
            </label>
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400"
              aria-hidden="true"
            />
            <input
              id="works-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul atau tema cerita..."
              className="w-full rounded-lg border border-stone-300 bg-white py-2.5 md:py-2 pl-9 pr-9 text-sm text-stone-900 placeholder:text-stone-400 focus:border-[#C81E1E] focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  void playUiSound('tap', soundEnabled);
                  setSearchQuery('');
                }}
                aria-label="Hapus kata kunci pencarian"
                className="btn-press absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        <div data-reveal>
          {visibleWorks.length === 0 ? (
            <div key={`empty-${selectedCategory}`} className="animate-panel-enter mt-10 rounded-xl border border-stone-300 bg-white px-6 py-14 text-center">
              <p className="font-serif text-xl font-medium text-stone-900">
                Belum ada tulisan yang cocok dengan pencarianmu.
              </p>
              <p className="mt-2 text-sm text-stone-600">
                Coba kata kunci lain atau buka lagi semua kategori.
              </p>
              <button
                type="button"
                onMouseEnter={handleHoverSound}
                onClick={handleResetFilters}
                className="btn-press mt-5 inline-flex min-h-11 items-center justify-center rounded-md bg-[#0B0C10] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#C81E1E] whitespace-nowrap shrink-0"
              >
                Tampilkan Semua
              </button>
            </div>
          ) : (
            <div
              key={selectedCategory}
              className="animate-panel-enter mt-8 md:mt-10 space-y-8 lg:space-y-10"
            >
            {/* Tier 1: Flagship Literary Lead Spread */}
            {featuredLead && (
              <article className="panel-card stagger-card stagger-1 monument-frame folio-plaque-dark group relative overflow-hidden rounded-xl border border-stone-800 bg-[#0B0C10] text-stone-100">
                <div
                  aria-hidden="true"
                  className="editorial-sheen-layer absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white to-transparent"
                />

                <div className="grid grid-cols-1 md:grid-cols-12 md:items-stretch">
                  <div className="md:col-span-5 lg:col-span-6">
                    {featuredLead.imageUrl && (
                      <EditorialImage
                        src={featuredLead.imageUrl}
                        alt={featuredLead.imageAlt ?? featuredLead.title}
                        dark
                        className="h-full border-0 border-b md:border-b-0 md:border-r border-stone-800"
                        imgClassName="aspect-[16/10] md:h-full"
                      />
                    )}
                  </div>

                  <div className="flex flex-col justify-between p-5 sm:p-7 lg:p-10 md:col-span-7 lg:col-span-6">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-stone-300 tabular-nums">
                        <span className="font-mono font-semibold text-amber-400">
                          {featuredLead.index} · Cerita Utama
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{featuredLead.category}</span>
                        <span aria-hidden="true">·</span>
                        <span>{featuredLead.publishedDate}</span>
                        <span aria-hidden="true">·</span>
                        <span>{featuredLead.lengthLabel}</span>
                      </div>

                      <h3 className="mt-3 md:mt-4 font-serif text-2xl font-semibold leading-[1.28] text-white lg:text-[2rem] lg:leading-[1.22] text-balance tracking-[0.01em]">
                        <a
                          href={featuredLead.externalUrl}
                          target="_blank"
                          rel="me noopener noreferrer"
                          onMouseEnter={handleHoverSound}
                          onFocus={handleHoverSound}
                          onClick={() => void playUiSound('open', soundEnabled)}
                          className="transition-colors hover:text-amber-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400"
                        >
                          {featuredLead.title}
                        </a>
                      </h3>

                      <p className="mt-4 text-sm font-[450] leading-[1.7] text-stone-300 lg:text-[15px] tracking-[0.01em]">
                        {featuredLead.summary}
                      </p>

                      {featuredLead.excerpt[1] && (
                        <blockquote className="mt-5 border-y border-stone-800 py-3.5 font-serif text-sm italic leading-[1.65] text-amber-200/90">
                          &ldquo;{featuredLead.excerpt[1]}&rdquo;
                        </blockquote>
                      )}
                    </div>

                    <div className="mt-6 md:mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between border-t border-stone-800 pt-4 md:pt-5">
                      <a
                        href={featuredLead.externalUrl}
                        target="_blank"
                        rel="me noopener noreferrer"
                        onMouseEnter={handleHoverSound}
                        onFocus={handleHoverSound}
                        onClick={() => void playUiSound('open', soundEnabled)}
                        className="inline-flex min-h-10 items-center gap-1.5 text-xs font-medium text-amber-300 hover:text-amber-200 hover:underline underline-offset-4 transition-colors"
                      >
                        <span>Baca di {featuredLead.platform}</span>
                        <ArrowUpRight className="arrow-glide-ne h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      </a>
                      <button
                        type="button"
                        onMouseEnter={handleHoverSound}
                        onFocus={handleHoverSound}
                        onClick={() => handleOpenWork(featuredLead)}
                        aria-label={`Baca singkat ${featuredLead.title}`}
                        className="btn-press btn-monumental inline-flex min-h-11 sm:min-h-10 w-full sm:w-auto items-center justify-center gap-2 rounded-md bg-[#C81E1E] px-4 py-2 text-xs font-semibold text-white hover:bg-[#991B1B] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
                      >
                        <span>Baca Singkat</span>
                        <ArrowRight className="arrow-glide-e h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            )}

            {/* Tier 2 & 3 — Curated Anthology Grid:
                - Mobile: Clean stacked folio cards
                - Tablet (md): 2-column magazine spread (odd leading card spans 2 cols cleanly)
                - Desktop (lg): 12-col Asymmetric Triptych (6-col illustrated feature + 3-col + 3-col literary plates) */}
            {folioRows.length > 0 && (
              <div className={`grid gap-6 lg:gap-7 ${gridColsClass}`}>
                {folioRows.map((work, idx) => {
                  const isThreeItemLayout = folioRows.length === 3;
                  const isTwoItemLayout = folioRows.length === 2;
                  const isLeadIllustrated = isThreeItemLayout && idx === 0;

                  let spanClasses = '';
                  if (folioRows.length === 1) {
                    spanClasses = 'md:col-span-2 lg:col-span-12';
                  } else if (isTwoItemLayout) {
                    spanClasses = 'md:col-span-1 lg:col-span-6';
                  } else if (isLeadIllustrated) {
                    spanClasses = 'md:col-span-2 lg:col-span-6';
                  } else {
                    spanClasses = 'md:col-span-1 lg:col-span-3';
                  }

                  const splitInterior = isLeadIllustrated || (folioRows.length === 1 && Boolean(work.imageUrl));
                  const isWideFolioCard = isLeadIllustrated || isTwoItemLayout || folioRows.length === 1;
                  const staggerClass = `stagger-${Math.min(idx + 2, 6)}`;

                  return (
                    <article
                      key={work.id}
                      className={`panel-card stagger-card ${staggerClass} group relative flex h-full flex-col justify-between overflow-hidden rounded-xl border border-stone-300/90 bg-gradient-to-b from-white to-[#FCF9F4] p-5 sm:p-6 lg:p-7 shadow-xs shadow-stone-900/[0.04] hover:border-stone-500 hover:shadow-md ${spanClasses}`}
                    >
                      <div
                        aria-hidden="true"
                        className="editorial-sheen-layer absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-amber-200/45 to-transparent"
                      />
                      <span
                        aria-hidden="true"
                        className="panel-accent-sweep pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#C81E1E] via-stone-400/60 to-transparent opacity-65 group-hover:opacity-100"
                      />

                      <div
                        className={
                          splitInterior && work.imageUrl
                            ? 'grid grid-cols-1 gap-5 sm:grid-cols-12 sm:items-start'
                            : 'space-y-4'
                        }
                      >
                        <div className={splitInterior && work.imageUrl ? 'sm:col-span-5' : ''}>
                          <WorkCoverPlate work={work} />
                        </div>

                        <div className={splitInterior && work.imageUrl ? 'sm:col-span-7' : ''}>
                          <div className="flex items-center justify-between gap-3 text-xs tabular-nums">
                            <span className="font-mono text-sm font-semibold text-[#B91C1C]">
                              {work.index}
                            </span>
                            <span className="font-[450] text-stone-500">
                              {work.category} · {work.publishedDate}
                            </span>
                          </div>

                          <h3 className="mt-3 font-serif text-xl font-semibold leading-[1.32] text-stone-950 lg:text-[1.38rem] lg:leading-[1.28] text-balance">
                            <a
                              href={work.externalUrl}
                              target="_blank"
                              rel="me noopener noreferrer"
                              onMouseEnter={handleHoverSound}
                              onFocus={handleHoverSound}
                              onClick={() => void playUiSound('open', soundEnabled)}
                              className="ink-link inline transition-colors group-hover:text-[#B91C1C] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C81E1E]"
                            >
                              {work.title}
                            </a>
                          </h3>

                          <p className="mt-2.5 text-sm font-[450] leading-[1.68] text-stone-700">
                            {work.summary}
                          </p>

                          <p className="mt-3 text-xs font-medium text-stone-500 tabular-nums">
                            {work.lengthLabel} · {work.platform}
                          </p>
                        </div>
                      </div>

                      <div
                        className={`mt-6 flex flex-col gap-2.5 border-t border-stone-200/90 pt-4 ${
                          isWideFolioCard
                            ? 'sm:flex-row sm:items-center sm:justify-between'
                            : 'sm:flex-row sm:items-center sm:justify-between md:flex-col md:items-stretch'
                        }`}
                      >
                        <a
                          href={work.externalUrl}
                          target="_blank"
                          rel="me noopener noreferrer"
                          onMouseEnter={handleHoverSound}
                          onFocus={handleHoverSound}
                          onClick={() => void playUiSound('open', soundEnabled)}
                          aria-label={`Buka ${work.title} di ${work.platform}`}
                          className="btn-press inline-flex min-h-11 sm:min-h-10 items-center justify-center gap-1.5 rounded-md border border-stone-300 bg-[#FAF7F2] px-3.5 py-2 text-xs font-semibold text-stone-800 hover:border-[#C81E1E] hover:text-[#C81E1E] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C81E1E]"
                        >
                          <span className="truncate max-w-[190px]">{work.platform}</span>
                          <ArrowUpRight className="arrow-glide-ne h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        </a>
                        <button
                          type="button"
                          onMouseEnter={handleHoverSound}
                          onFocus={handleHoverSound}
                          onClick={() => handleOpenWork(work)}
                          aria-label={`Baca singkat ${work.title}`}
                          className="btn-press inline-flex min-h-11 sm:min-h-10 items-center justify-center gap-2 rounded-md bg-[#0B0C10] px-4 py-2 text-xs font-semibold text-white hover:bg-[#C81E1E] group-hover:bg-[#C81E1E] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C81E1E]"
                        >
                          <span>Baca Singkat</span>
                          <ArrowRight
                            className="arrow-glide-e h-3.5 w-3.5 shrink-0"
                            aria-hidden="true"
                          />
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

