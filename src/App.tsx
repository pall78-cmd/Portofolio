import { useState } from 'react';
import { AcademicEdsaSection } from './components/AcademicEdsaSection';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { LinksContactSection } from './components/LinksContactSection';
import { ReaderModal } from './components/ReaderModal';
import { TopBar } from './components/TopBar';
import { WorksSection } from './components/WorksSection';
import type { WritingWork } from './data/profileData';

export default function App() {
  const [activeWork, setActiveWork] = useState<WritingWork | null>(null);

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
      <ReaderModal work={activeWork} onClose={() => setActiveWork(null)} />
    </div>
  );
}
