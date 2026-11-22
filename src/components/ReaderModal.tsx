import { useEffect, useState } from 'react';
import { ArrowUpRight, Check, Copy, X } from 'lucide-react';
import type { WritingWork } from '../data/profileData';
import { PROFILE_IDENTITY } from '../data/profileData';
import { buildShareCitation } from '../utils/portfolio';
import { playUiSound } from '../utils/soundFx';

interface ReaderModalProps {
  work: WritingWork | null;
  onClose: () => void;
  soundEnabled?: boolean;
}

export function ReaderModal({ work, onClose, soundEnabled = true }: ReaderModalProps) {
  const [copiedCitation, setCopiedCitation] = useState(false);

  useEffect(() => {
    setCopiedCitation(false);
  }, [work]);

  useEffect(() => {
    if (!work) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        void playUiSound('close', soundEnabled);
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [work, onClose, soundEnabled]);

  if (!work) {
    return null;
  }

  const handleCloseClick = () => {
    void playUiSound('close', soundEnabled);
    onClose();
  };

  const handleCopyCitation = async () => {
    const citation = buildShareCitation(work, PROFILE_IDENTITY.fullName);
    try {
      await navigator.clipboard.writeText(citation);
      setCopiedCitation(true);
      void playUiSound('copy', soundEnabled);
      window.setTimeout(() => setCopiedCitation(false), 2500);
    } catch {
      setCopiedCitation(true);
      void playUiSound('copy', soundEnabled);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#0C0D10]/75 backdrop-blur-xs p-2 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reader-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleCloseClick();
        }
      }}
    >
      <div className="relative max-h-[90vh] w-full max-w-xl lg:max-w-2xl overflow-y-auto rounded-xl border border-stone-300 bg-[#FAF7F2] shadow-2xl">
        <div className="flex items-start justify-between gap-4 bg-[#0C0D10] px-5 py-5 sm:px-8 sm:py-7 lg:px-10 text-stone-100">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-stone-300 tabular-nums">
              <span className="font-mono font-semibold text-amber-400">{work.index}</span>
              <span aria-hidden="true">·</span>
              <span>{work.category}</span>
              <span aria-hidden="true">·</span>
              <span>{work.publishedDate}</span>
              <span aria-hidden="true">·</span>
              <span>{work.lengthLabel}</span>
            </div>
            <h2
              id="reader-modal-title"
              className="mt-2 font-serif text-xl sm:text-2xl lg:text-3xl font-semibold text-white text-balance tracking-[0.01em]"
            >
              {work.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={handleCloseClick}
            aria-label="Tutup pratinjau karya"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-stone-700 text-stone-300 hover:bg-stone-800 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="p-5 sm:p-8 lg:p-10">
          <div className="space-y-4">
            <p className="text-sm font-medium text-stone-600">
              Ditulis oleh {PROFILE_IDENTITY.fullName} — {work.platform}
            </p>
            {work.excerpt.map((paragraph, index) => (
              <p
                key={index}
                className="font-serif text-[15px] leading-relaxed text-stone-900 sm:text-base lg:text-[1.0625rem]"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-stone-300 pt-5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:pt-6">
            <button
              type="button"
              onClick={handleCopyCitation}
              className="inline-flex min-h-11 sm:min-h-10 w-full sm:w-auto items-center justify-center gap-2 rounded-md border border-stone-300 bg-white px-4 py-2 text-xs font-semibold text-stone-800 hover:bg-stone-100 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C81E1E]"
            >
              {copiedCitation ? (
                <>
                  <Check className="h-4 w-4 text-emerald-700" aria-hidden="true" />
                  <span>Kutipan Disalin</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 text-stone-500" aria-hidden="true" />
                  <span>Salin Kutipan</span>
                </>
              )}
            </button>

            <a
              href={work.externalUrl}
              target="_blank"
              rel="me noopener noreferrer"
              onClick={() => void playUiSound('open', soundEnabled)}
              className="inline-flex min-h-11 sm:min-h-10 w-full sm:w-auto items-center justify-center gap-2 rounded-md bg-[#C81E1E] px-4 py-2 text-xs font-semibold text-white hover:bg-[#991B1B] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C81E1E]"
            >
              <span>Buka di {work.platform}</span>
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
