import { useState } from 'react';
import { AcademicEdsaSection } from './components/AcademicEdsaSection';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { LinksContactSection } from './components/LinksContactSection';
import { ReaderModal } from './components/ReaderModal';
import { TopBar } from './components/TopBar';
import { WorksSection } from './components/WorksSection';
import { WRITING_WORKS, type WritingWork } from './data/profileData';
import { findWorkByQueryId } from './utils/portfolio';

export default function App() {
  const [activeWork, setActiveWork] = useState<WritingWork | null>(() => {
    if (typeof window === 'undefined') {
      return null;
    }
    return findWorkByQueryId(WRITING_WORKS, window.location.search);
  });

  const handleCloseWork = () => {
    setActiveWork(null);
    if (typeof window !== 'undefined' && window.location.search.includes('karya=')) {
      const nextUrl = new URL(window.location.href);
      nextUrl.searchParams.delete('karya');
      window.history.replaceState(null, '', `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <TopBar />
      <main>
        <HeroSection />
        <WorksSection onSelectWork={(work) => setActiveWork(work)} />
        <AcademicEdsaSection />
        <LinksContactSection />
      </main>
      <Footer />
      <ReaderModal work={activeWork} onClose={handleCloseWork} />
    </div>
  );
}
