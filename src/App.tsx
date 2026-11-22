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
import {
  getSharedAudioContext,
  shouldBypassIntro,
  unlockSharedAudioContextSync,
} from './utils/introAudio';
import { findWorkByQueryId } from './utils/portfolio';
import {
  applyDocumentSeoMetadata,
  computeActiveSection,
  OBSERVED_SECTIONS,
  resolvePageMetadata,
  type SectionId,
} from './utils/seoMetadata';

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
    const rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.96) {
      section.classList.add('reveal-visible');
    } else {
      observer.observe(section);
    }
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

  const soundEnabled = true;

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

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const ensureUnlocked = () => {
      const ctx = getSharedAudioContext();
      if (!ctx || ctx.state !== 'running') {
        unlockSharedAudioContextSync();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        ensureUnlocked();
      }
    };

    window.addEventListener('pointerdown', ensureUnlocked, { capture: true, passive: true });
    window.addEventListener('pointerup', ensureUnlocked, { capture: true, passive: true });
    window.addEventListener('touchstart', ensureUnlocked, { capture: true, passive: true });
    window.addEventListener('touchend', ensureUnlocked, { capture: true, passive: true });
    window.addEventListener('click', ensureUnlocked, { capture: true, passive: true });
    window.addEventListener('keydown', ensureUnlocked, { capture: true, passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      window.removeEventListener('pointerdown', ensureUnlocked, { capture: true });
      window.removeEventListener('pointerup', ensureUnlocked, { capture: true });
      window.removeEventListener('touchstart', ensureUnlocked, { capture: true });
      window.removeEventListener('touchend', ensureUnlocked, { capture: true });
      window.removeEventListener('click', ensureUnlocked, { capture: true });
      window.removeEventListener('keydown', ensureUnlocked, { capture: true });
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

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
        <HeroSection soundEnabled={soundEnabled} />
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
