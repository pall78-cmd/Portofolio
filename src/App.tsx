import { useEffect, useState } from 'react';
import { AcademicEdsaSection } from './components/AcademicEdsaSection';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { LinksContactSection } from './components/LinksContactSection';
import { NetflixIntroOverlay } from './components/NetflixIntroOverlay';
import { ReaderModal } from './components/ReaderModal';
import { TopBar } from './components/TopBar';
import { WorksSection } from './components/WorksSection';
import { WRITING_WORKS, type WritingWork } from './data/profileData';
import { shouldBypassIntro } from './utils/introAudio';
import { findWorkByQueryId } from './utils/portfolio';
import {
  applyDocumentSeoMetadata,
  computeActiveSection,
  OBSERVED_SECTIONS,
  resolvePageMetadata,
  type SectionId,
} from './utils/seoMetadata';
import { playUiSound } from './utils/soundFx';

export function ScrollReveal(
  sectionSelector = 'main section',
  observerOptions: IntersectionObserverInit = {
    threshold: 0.04,
    rootMargin: '0px 0px -32px 0px',
  }
): () => void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return () => {};
  }

  const sectionElements = Array.from(document.querySelectorAll<HTMLElement>(sectionSelector));
  if (sectionElements.length === 0) {
    return () => {};
  }

  const prefersReducedMotion =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
    for (const section of sectionElements) {
      section.classList.add('reveal-visible');
    }
    return () => {};
  }

  const observer = new IntersectionObserver((entries, activeObserver) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        activeObserver.unobserve(entry.target);
      }
    }
  }, observerOptions);

  for (const section of sectionElements) {
    section.classList.add('reveal-stage');
    observer.observe(section);
  }

  return () => observer.disconnect();
}

export default function App() {
  const [activeWork, setActiveWork] = useState<WritingWork | null>(() => {
    if (typeof window === 'undefined') {
      return null;
    }
    return findWorkByQueryId(WRITING_WORKS, window.location.search);
  });

  const [showIntro, setShowIntro] = useState<boolean>(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    return !shouldBypassIntro(window.location.search, reducedMotion);
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const [activeSection, setActiveSection] = useState<SectionId>(() => {
    if (typeof window === 'undefined') {
      return 'profil';
    }
    const hash = window.location.hash.replace('#', '') as SectionId;
    return OBSERVED_SECTIONS.includes(hash) ? hash : 'profil';
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const syncSectionFromScroll = () => {
      const tops = OBSERVED_SECTIONS.flatMap((id) => {
        const el = document.getElementById(id);
        return el ? [{ id, top: el.getBoundingClientRect().top }] : [];
      });
      if (tops.length > 0) {
        setActiveSection(computeActiveSection(tops, 140));
      }
    };

    window.addEventListener('scroll', syncSectionFromScroll, { passive: true });
    window.addEventListener('resize', syncSectionFromScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', syncSectionFromScroll);
      window.removeEventListener('resize', syncSectionFromScroll);
    };
  }, []);

  useEffect(() => ScrollReveal(), []);

  useEffect(() => {
    applyDocumentSeoMetadata(resolvePageMetadata({ activeWork, activeSection }));
  }, [activeWork, activeSection]);

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (next) {
      void playUiSound('copy', true);
    }
  };

  const handleCloseWork = () => {
    setActiveWork(null);
    if (typeof window !== 'undefined' && window.location.search.includes('karya=')) {
      const nextUrl = new URL(window.location.href);
      nextUrl.searchParams.delete('karya');
      window.history.replaceState(null, '', `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-stone-950">
      {showIntro && <NetflixIntroOverlay onComplete={() => setShowIntro(false)} />}
      <TopBar
        activeSection={activeSection}
        onNavigateSection={setActiveSection}
        soundEnabled={soundEnabled}
      />
      <main>
        <HeroSection soundEnabled={soundEnabled} onToggleSound={handleToggleSound} />
        <WorksSection
          onSelectWork={(work) => setActiveWork(work)}
          soundEnabled={soundEnabled}
        />
        <AcademicEdsaSection soundEnabled={soundEnabled} />
        <LinksContactSection soundEnabled={soundEnabled} />
      </main>
      <Footer soundEnabled={soundEnabled} />
      <ReaderModal
        work={activeWork}
        onClose={handleCloseWork}
        soundEnabled={soundEnabled}
      />
    </div>
  );
}
