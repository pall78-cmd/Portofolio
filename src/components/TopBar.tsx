import { type MouseEvent, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { PROFILE_IDENTITY } from '../data/profileData';
import type { SectionId } from '../utils/seoMetadata';
import { playUiSound } from '../utils/soundFx';

const NAV_ITEMS: Array<{ id: SectionId; href: `#${SectionId}`; label: string }> = [
  { id: 'profil', href: '#profil', label: 'Profil' },
  { id: 'karya', href: '#karya', label: 'Karya Tulis' },
  { id: 'perjalanan', href: '#perjalanan', label: 'EDSA 2026' },
  { id: 'tautan', href: '#tautan', label: 'Tautan' },
];

interface TopBarProps {
  activeSection?: SectionId;
  onNavigateSection?: (sectionId: SectionId) => void;
  soundEnabled?: boolean;
}

export function TopBar({
  activeSection = 'profil',
  onNavigateSection,
  soundEnabled = true,
}: TopBarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleAnchorClick = (event: MouseEvent<HTMLAnchorElement>, sectionId: SectionId) => {
    setMobileMenuOpen(false);
    void playUiSound('tap', soundEnabled);

    const target = document.getElementById(sectionId);
    if (!target) {
      return;
    }
    event.preventDefault();

    const prefersReducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const headerOffset = 64;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - headerOffset;

    window.scrollTo({
      top: Math.max(0, targetTop),
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });

    if (window.location.hash !== `#${sectionId}`) {
      window.history.replaceState(null, '', `#${sectionId}`);
    }

    onNavigateSection?.(sectionId);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-stone-300/80 bg-[#FAF7F2]/92 backdrop-blur-md">
      <div className="mx-auto flex h-14 md:h-16 max-w-6xl items-center justify-between gap-4 md:gap-6 lg:gap-8 px-4 sm:px-6 lg:px-8">
        <a
          href="#profil"
          onClick={(e) => handleAnchorClick(e, 'profil')}
          className="font-serif text-lg sm:text-xl font-semibold tracking-tight text-stone-950 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C81E1E]"
        >
          {PROFILE_IDENTITY.shortName}
        </a>

        <nav
          aria-label="Navigasi utama"
          className="hidden md:flex items-center gap-5 lg:gap-7 text-[13px] lg:text-sm font-medium text-stone-700"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'location' : undefined}
                onClick={(e) => handleAnchorClick(e, item.id)}
                className={`ink-link whitespace-nowrap shrink-0 py-1 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C81E1E] ${
                  isActive
                    ? 'font-semibold text-[#C81E1E]'
                    : 'text-stone-700 hover:text-stone-950'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#kontak"
            onClick={(e) => handleAnchorClick(e, 'kontak')}
            aria-current={activeSection === 'kontak' ? 'location' : undefined}
            className="hidden md:inline-flex items-center justify-center rounded-md bg-[#0C0D10] px-3.5 lg:px-4 py-2 text-xs font-semibold text-white hover:bg-[#C81E1E] transition-colors duration-200 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C81E1E]"
          >
            Hubungi
          </a>

          <button
            type="button"
            onClick={() => {
              void playUiSound('tap', soundEnabled);
              setMobileMenuOpen((prev) => !prev);
            }}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-stone-300 bg-white text-stone-800 hover:bg-stone-100 md:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C81E1E]"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Navigasi seluler"
          className="border-t border-stone-300 bg-[#FAF7F2] px-4 py-4 sm:px-6 md:hidden"
        >
          <div className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? 'location' : undefined}
                  onClick={(e) => handleAnchorClick(e, item.id)}
                  className={`min-h-11 flex items-center rounded-md px-2 text-sm transition-colors ${
                    isActive
                      ? 'bg-stone-200/60 font-semibold text-[#C81E1E]'
                      : 'font-medium text-stone-800 hover:bg-stone-100 hover:text-stone-950'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
            <a
              href="#kontak"
              onClick={(e) => handleAnchorClick(e, 'kontak')}
              className="mt-2 inline-flex min-h-11 items-center justify-center rounded-md bg-[#0C0D10] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#C81E1E]"
            >
              Hubungi
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
