import { useMemo, useState } from 'react';
import { ArrowRight, Search, X } from 'lucide-react';
import { WRITING_WORKS, type WritingWork } from '../data/profileData';
import {
  WORK_CATEGORIES,
  type CategoryFilter,
  filterWorks,
} from '../utils/portfolio';
import { EditorialImage } from './EditorialImage';

interface WorksSectionProps {
  onSelectWork: (work: WritingWork) => void;
}

export function WorksSection({ onSelectWork }: WorksSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  const visibleWorks = useMemo(
    () => filterWorks(WRITING_WORKS, selectedCategory, searchQuery),
    [selectedCategory, searchQuery]
  );

  const handleResetFilters = () => {
    setSelectedCategory('Semua');
    setSearchQuery('');
  };

  return (
    <section id="karya" className="scroll-mt-16 border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-wide text-amber-700">
              Publikasi &amp; Arsip Pena
            </p>
            <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl text-balance">
              Karya Tulis &amp; Esai Pilihan
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
              Karya tulis terpublikasi di Wattpad (@NaufalAthallah) serta saluran resmi{' '}
              <em>Puisi, Novel(e-book)</em> di WhatsApp.
            </p>
          </div>

          <div className="text-xs font-medium text-slate-500 tabular-nums shrink-0">
            Menampilkan {visibleWorks.length} dari {WRITING_WORKS.length} tulisan
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-y border-slate-200 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div
            role="tablist"
            aria-label="Filter kategori karya tulis"
            className="flex flex-wrap items-center gap-1 rounded-md bg-slate-100 p-1"
          >
            {WORK_CATEGORIES.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded px-3 py-1.5 text-xs font-semibold transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 ${
                    isActive
                      ? 'bg-blue-700 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-white/70 hover:text-slate-950'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          <div className="relative w-full sm:w-72">
            <label htmlFor="works-search" className="sr-only">
              Cari judul atau topik karya tulis
            </label>
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              id="works-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul atau topik..."
              className="w-full rounded-md border border-slate-300 bg-slate-50 py-2 pl-9 pr-9 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-700 focus:bg-white focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Hapus kata kunci pencarian"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        {visibleWorks.length === 0 ? (
          <div className="mt-10 rounded-lg border border-slate-200 bg-slate-50 px-6 py-12 text-center">
            <p className="font-serif text-xl font-medium text-slate-900">
              Tidak ada tulisan yang sesuai dengan pencarian Anda.
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Coba kata kunci lain atau tampilkan kembali seluruh kategori karya tulis.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-5 inline-flex items-center justify-center rounded-md bg-blue-700 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-800 transition-colors whitespace-nowrap shrink-0"
            >
              Tampilkan Semua Karya
            </button>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            {visibleWorks.map((work) => {
              const isDarkFeatured = work.id === 'throne-of-ashes-tahkta-abu';
              const isEmeraldChannel = work.id === 'saluran-puisi-novel-ebook';
              const isRoseProse = work.id === 'keindahan-yang-tak-utuh';

              const cardSurfaceClass = isDarkFeatured
                ? 'border-slate-800 bg-[#0B1120] text-slate-100 hover:border-amber-500/60'
                : isEmeraldChannel
                  ? 'border-emerald-200/80 bg-[#F3FAF7] text-slate-950 hover:border-emerald-400'
                  : isRoseProse
                    ? 'border-rose-200/80 bg-[#FDF6F7] text-slate-950 hover:border-rose-400'
                    : 'border-slate-200 bg-[#F5F7FB] text-slate-950 hover:border-blue-400';

              const indexColorClass = isDarkFeatured
                ? 'text-amber-400'
                : isEmeraldChannel
                  ? 'text-emerald-700'
                  : isRoseProse
                    ? 'text-rose-700'
                    : 'text-blue-700';

              return (
                <article
                  key={work.id}
                  className={`flex flex-col justify-between rounded-lg border p-6 transition-colors duration-150 ${cardSurfaceClass}`}
                >
                  <div>
                    {work.imageUrl && (
                      <EditorialImage
                        src={work.imageUrl}
                        alt={work.imageAlt ?? work.title}
                        className={`mb-5 rounded-md ${isDarkFeatured ? 'border-slate-700' : ''}`}
                        imgClassName="aspect-[16/9]"
                      />
                    )}

                    <div
                      className={`flex flex-wrap items-center gap-2 text-xs tabular-nums ${
                        isDarkFeatured ? 'text-slate-300' : 'text-slate-600'
                      }`}
                    >
                      <span className={`font-mono font-semibold ${indexColorClass}`}>
                        {work.index}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{work.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{work.publishedDate}</span>
                      <span aria-hidden="true">·</span>
                      <span>{work.lengthLabel}</span>
                    </div>

                    <h3
                      className={`mt-3 font-serif text-xl font-semibold leading-snug text-balance ${
                        isDarkFeatured ? 'text-white tracking-[0.01em]' : 'text-slate-950'
                      }`}
                    >
                      {work.title}
                    </h3>

                    <p
                      className={`mt-3 text-sm leading-relaxed ${
                        isDarkFeatured ? 'text-slate-300 tracking-[0.01em]' : 'text-slate-700'
                      }`}
                    >
                      {work.summary}
                    </p>
                  </div>

                  <div
                    className={`mt-6 flex items-center justify-between border-t pt-4 ${
                      isDarkFeatured ? 'border-slate-800' : 'border-slate-200/80'
                    }`}
                  >
                    <span
                      className={`text-xs font-medium ${
                        isDarkFeatured ? 'text-slate-400' : 'text-slate-600'
                      }`}
                    >
                      {work.platform}
                    </span>
                    <button
                      type="button"
                      onClick={() => onSelectWork(work)}
                      aria-label={`Baca ringkasan ${work.title}`}
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700 ${
                        isDarkFeatured
                          ? 'text-amber-400 hover:text-amber-300'
                          : isEmeraldChannel
                            ? 'text-emerald-800 hover:text-emerald-950'
                            : isRoseProse
                              ? 'text-rose-800 hover:text-rose-950'
                              : 'text-blue-700 hover:text-blue-900'
                      }`}
                    >
                      <span>Baca Ringkasan</span>
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
