import { useMemo, useState } from 'react';
import { ArrowRight, ArrowUpRight, Search, X } from 'lucide-react';
import { WRITING_WORKS, type WritingWork } from '../data/profileData';
import {
  WORK_CATEGORIES,
  type CategoryFilter,
  filterWorks,
} from '../utils/portfolio';
import { playUiSound } from '../utils/soundFx';
import { EditorialImage } from './EditorialImage';

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

  return (
    <section
      id="karya"
      className="reveal-stage scroll-mt-16 border-b border-stone-300 bg-white"
    >
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16 lg:px-8 lg:py-20">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-6">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-wide text-[#C81E1E]">
              Publikasi &amp; Arsip Pena
            </p>
            <h2 className="mt-2 font-serif text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl lg:text-4xl text-balance">
              Karya Tulis &amp; Esai Pilihan
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-stone-600 sm:text-base">
              Karya tulis terpublikasi di Wattpad (@NaufalAthallah) serta saluran resmi{' '}
              <em>Puisi, Novel(e-book)</em> di WhatsApp.
            </p>
          </div>

          <div className="shrink-0 text-xs font-medium text-stone-500 tabular-nums">
            <span>
              Menampilkan {visibleWorks.length} dari {WRITING_WORKS.length} tulisan
            </span>
          </div>
        </div>

        <div className="mt-7 md:mt-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-4 border-y border-stone-200 py-4">
          <div
            role="tablist"
            aria-label="Filter kategori karya tulis"
            className="grid grid-cols-2 gap-1 rounded-md border border-stone-200 bg-[#FAF7F2] p-1 sm:inline-flex sm:flex-wrap sm:items-center"
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
                  className={`min-h-9 rounded px-2.5 sm:px-3 py-1.5 text-xs font-semibold transition-all duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C81E1E] ${
                    isActive
                      ? 'bg-[#0C0D10] text-white shadow-xs'
                      : 'text-stone-700 hover:bg-white hover:text-stone-950'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          <div className="relative w-full md:w-64 lg:w-72 shrink-0">
            <label htmlFor="works-search" className="sr-only">
              Cari judul atau topik karya tulis
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
              placeholder="Cari judul atau topik..."
              className="w-full rounded-md border border-stone-300 bg-[#FAF7F2] py-2 pl-9 pr-9 text-sm text-stone-900 placeholder:text-stone-400 focus:border-[#C81E1E] focus:bg-white focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  void playUiSound('tap', soundEnabled);
                  setSearchQuery('');
                }}
                aria-label="Hapus kata kunci pencarian"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        {visibleWorks.length === 0 ? (
          <div className="mt-10 rounded-lg border border-stone-200 bg-[#FAF7F2] px-6 py-12 text-center">
            <p className="font-serif text-xl font-medium text-stone-900">
              Tidak ada tulisan yang sesuai dengan pencarian Anda.
            </p>
            <p className="mt-2 text-sm text-stone-600">
              Coba kata kunci lain atau tampilkan kembali seluruh kategori karya tulis.
            </p>
            <button
              type="button"
              onMouseEnter={handleHoverSound}
              onClick={handleResetFilters}
              className="mt-5 inline-flex items-center justify-center rounded-md bg-[#0C0D10] px-4 py-2 text-xs font-semibold text-white hover:bg-[#C81E1E] transition-colors whitespace-nowrap shrink-0"
            >
              Tampilkan Semua Karya
            </button>
          </div>
        ) : (
          <div className="mt-8 md:mt-10 space-y-8 md:space-y-10">
            {featuredLead && (
              <article className="group relative overflow-hidden rounded-xl border border-stone-800 bg-[#0C0D10] text-stone-100">
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
                          {featuredLead.index} · Sorotan Utama
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{featuredLead.category}</span>
                        <span aria-hidden="true">·</span>
                        <span>{featuredLead.publishedDate}</span>
                        <span aria-hidden="true">·</span>
                        <span>{featuredLead.lengthLabel}</span>
                      </div>

                      <h3 className="mt-3 md:mt-4 font-serif text-2xl font-semibold leading-snug text-white lg:text-3xl text-balance tracking-[0.01em]">
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

                      <p className="mt-3 md:mt-4 text-sm leading-relaxed text-stone-300 lg:text-base tracking-[0.01em]">
                        {featuredLead.summary}
                      </p>

                      {featuredLead.excerpt[1] && (
                        <blockquote className="mt-4 md:mt-5 font-serif text-sm italic leading-relaxed text-amber-200/90">
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
                        className="inline-flex min-h-9 items-center gap-1.5 text-xs font-medium text-amber-300 hover:text-amber-200 hover:underline underline-offset-4 transition-colors"
                      >
                        <span>Buka di {featuredLead.platform}</span>
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </a>
                      <button
                        type="button"
                        onMouseEnter={handleHoverSound}
                        onFocus={handleHoverSound}
                        onClick={() => handleOpenWork(featuredLead)}
                        aria-label={`Baca ringkasan ${featuredLead.title}`}
                        className="inline-flex min-h-11 sm:min-h-10 w-full sm:w-auto items-center justify-center gap-2 rounded-md bg-[#C81E1E] px-4 py-2 text-xs font-semibold text-white hover:bg-[#991B1B] transition-all duration-200 hover:-translate-y-0.5 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
                      >
                        <span>Baca Ringkasan</span>
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            )}

            {folioRows.length > 0 && (
              <div className="divide-y divide-stone-200 border-y border-stone-200">
                {folioRows.map((work) => (
                  <article
                    key={work.id}
                    className="group flex flex-col gap-5 py-6 md:py-7 lg:-mx-4 lg:flex-row lg:items-center lg:justify-between lg:rounded-lg lg:px-4 transition-colors duration-200 hover:bg-[#FAF7F2]"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-5">
                      <div className="flex items-center justify-between md:block shrink-0">
                        <span className="font-mono text-xl md:text-2xl font-semibold text-stone-300 transition-colors group-hover:text-[#C81E1E] tabular-nums md:block md:w-10 lg:w-12">
                          {work.index}
                        </span>
                        <span className="text-xs font-semibold text-stone-700 md:hidden">
                          {work.category} · {work.publishedDate}
                        </span>
                      </div>

                      {work.imageUrl && (
                        <div className="w-full md:w-44 shrink-0">
                          <EditorialImage
                            src={work.imageUrl}
                            alt={work.imageAlt ?? work.title}
                            className="rounded-md"
                            imgClassName="aspect-[16/10]"
                          />
                        </div>
                      )}

                      <div className="max-w-2xl flex-1">
                        <div className="hidden md:flex flex-wrap items-center gap-2 text-xs text-stone-500 tabular-nums">
                          <span className="font-semibold text-stone-800">{work.category}</span>
                          <span aria-hidden="true">·</span>
                          <span>{work.publishedDate}</span>
                          <span aria-hidden="true">·</span>
                          <span>{work.lengthLabel}</span>
                          <span aria-hidden="true">·</span>
                          <span>{work.platform}</span>
                        </div>

                        <h3 className="md:mt-2 font-serif text-xl font-semibold leading-snug text-stone-950 lg:text-2xl text-balance">
                          <a
                            href={work.externalUrl}
                            target="_blank"
                            rel="me noopener noreferrer"
                            onMouseEnter={handleHoverSound}
                            onFocus={handleHoverSound}
                            onClick={() => void playUiSound('open', soundEnabled)}
                            className="ink-link inline transition-colors group-hover:text-[#C81E1E] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C81E1E]"
                          >
                            {work.title}
                          </a>
                        </h3>

                        <p className="mt-2 text-sm leading-relaxed text-stone-600">
                          {work.summary}
                        </p>

                        <p className="mt-2 text-xs text-stone-500 md:hidden tabular-nums">
                          {work.lengthLabel} · {work.platform}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap sm:items-center md:justify-start md:pl-15 lg:justify-end lg:pl-6 shrink-0">
                      <a
                        href={work.externalUrl}
                        target="_blank"
                        rel="me noopener noreferrer"
                        onMouseEnter={handleHoverSound}
                        onFocus={handleHoverSound}
                        onClick={() => void playUiSound('open', soundEnabled)}
                        aria-label={`Buka ${work.title} di ${work.platform}`}
                        className="inline-flex min-h-11 sm:min-h-10 items-center justify-center gap-1.5 rounded-md border border-stone-300 bg-white px-3 sm:px-3.5 py-2 text-xs font-semibold text-stone-700 hover:border-[#C81E1E] hover:text-[#C81E1E] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C81E1E]"
                      >
                        <span className="truncate">{work.platform}</span>
                        <ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      </a>
                      <button
                        type="button"
                        onMouseEnter={handleHoverSound}
                        onFocus={handleHoverSound}
                        onClick={() => handleOpenWork(work)}
                        aria-label={`Baca ringkasan ${work.title}`}
                        className="inline-flex min-h-11 sm:min-h-10 items-center justify-center gap-2 rounded-md border border-stone-300 bg-white px-3 sm:px-4 py-2 text-xs font-semibold text-stone-900 group-hover:border-[#0C0D10] group-hover:bg-[#0C0D10] group-hover:text-white transition-all duration-200 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C81E1E]"
                      >
                        <span>Baca Ringkasan</span>
                        <ArrowRight
                          className="h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

