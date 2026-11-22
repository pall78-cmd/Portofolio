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
    <header className="sticky top-0 z-40 border-b border-stone-800/85 bg-[#0B0C10]/94 text-stone-100 backdrop-blur-md">
      <div className="mx-auto flex h-14 md:h-16 lg:h-[72px] max-w-7xl items-center justify-between gap-4 md:gap-6 lg:gap-8 px-4 sm:px-6 lg:px-10">
        <a
          href="#profil"
          onMouseEnter={() => void playUiSound('hover', soundEnabled)}
          onClick={(e) => handleAnchorClick(e, 'profil')}
          className="font-serif text-lg sm:text-xl lg:text-[1.35rem] font-semibold tracking-tight text-white whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400"
        >
          {PROFILE_IDENTITY.shortName}
        </a>

        <nav
          aria-label="Navigasi utama"
          className="hidden md:flex items-center gap-5 lg:gap-9 text-[13px] lg:text-sm font-medium text-stone-300"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'location' : undefined}
                onMouseEnter={() => void playUiSound('hover', soundEnabled)}
                onClick={(e) => handleAnchorClick(e, item.id)}
                className={`ink-link whitespace-nowrap shrink-0 py-1.5 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400 ${
                  isActive
                    ? 'font-semibold text-amber-300'
                    : 'text-stone-300 hover:text-white'
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
            onMouseEnter={() => void playUiSound('hover', soundEnabled)}
            onClick={(e) => handleAnchorClick(e, 'kontak')}
            aria-current={activeSection === 'kontak' ? 'location' : undefined}
            className="hidden md:inline-flex items-center justify-center rounded-md border border-stone-700 bg-[#C81E1E] px-4 py-2 text-xs font-semibold text-white hover:bg-[#A61717] transition-colors duration-200 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
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
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-stone-700 bg-[#14161D] text-stone-100 hover:bg-stone-800 md:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
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
          className="border-t border-stone-800 bg-[#0B0C10] px-4 py-4 sm:px-6 md:hidden"
        >
          <div className="flex flex-col divide-y divide-stone-800/80">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? 'location' : undefined}
                  onClick={(e) => handleAnchorClick(e, item.id)}
                  className={`min-h-12 flex items-center justify-between px-2 text-sm transition-colors ${
                    isActive
                      ? 'font-semibold text-amber-300'
                      : 'font-medium text-stone-200 hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                </a>
              );
            })}
            <div className="pt-3">
              <a
                href="#kontak"
                onClick={(e) => handleAnchorClick(e, 'kontak')}
                className="inline-flex min-h-11 w-full items-center justify-center rounded-md bg-[#C81E1E] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#991B1B]"
              >
                Hubungi
              </a>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
