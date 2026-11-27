import { useEffect, useRef, useState } from 'react';
import { AcademicEdsaSection } from './components/AcademicEdsaSection';
import {
  ExcerptMusicPlayer,
  type ExcerptMusicPlayerHandle,
} from './components/ExcerptMusicPlayer';
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
import {
  applyDocumentSeoMetadata,
  computeActiveSection,
  OBSERVED_SECTIONS,
  resolvePageMetadata,
  type SectionId,
} from './utils/seoMetadata';
import { findWorkByQueryId } from './utils/portfolio';

export function ScrollReveal(
  sectionSelector = '[data-reveal]',
  observerOptions: IntersectionObserverInit = {
    threshold: 0.01,
    rootMargin: '80px 0px -12px 0px',
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
  const mainVisible = !showIntro;
  const excerptPlayerRef = useRef<ExcerptMusicPlayerHandle | null>(null);

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

    let rafId = 0;

    const measureSection = () => {
      rafId = 0;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
      document.documentElement.style.setProperty('--page-scroll-progress', progress.toFixed(4));

      const tops = OBSERVED_SECTIONS.flatMap((id) => {
        const el = document.getElementById(id);
        return el ? [{ id, top: el.getBoundingClientRect().top }] : [];
      });
      if (tops.length > 0) {
        const nextSection = computeActiveSection(tops, 140);
        setActiveSection((prev) => (prev === nextSection ? prev : nextSection));
      }
    };

    const scheduleSectionSync = () => {
      if (rafId !== 0) {
        return;
      }
      rafId = window.requestAnimationFrame(measureSection);
    };

    scheduleSectionSync();
    window.addEventListener('scroll', scheduleSectionSync, { passive: true });
    window.addEventListener('resize', scheduleSectionSync, { passive: true });
    return () => {
      if (rafId !== 0) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener('scroll', scheduleSectionSync);
      window.removeEventListener('resize', scheduleSectionSync);
    };
  }, []);

  useEffect(() => {
    if (!mainVisible) {
      return;
    }
    return ScrollReveal();
  }, [mainVisible]);

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
    <div className="min-h-screen bg-[#0B0C10] text-stone-100">
      {showIntro && (
        <NetflixIntroOverlay
          onPlayClick={() => excerptPlayerRef.current?.primePlayback()}
          onComplete={() => setShowIntro(false)}
        />
      )}
      <ExcerptMusicPlayer ref={excerptPlayerRef} mainVisible={mainVisible} />
      <TopBar
        activeSection={activeSection}
        onNavigateSection={setActiveSection}
        soundEnabled={soundEnabled}
      />
      <main data-main-ready={mainVisible ? 'true' : 'false'}>
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
