import { useEffect, useState } from 'react';
import { ArrowUpRight, Check, Copy, X } from 'lucide-react';
import type { WritingWork } from '../data/profileData';
import { PROFILE_IDENTITY } from '../data/profileData';
import { buildShareCitation } from '../utils/portfolio';

interface ReaderModalProps {
  work: WritingWork | null;
  onClose: () => void;
}

export function ReaderModal({ work, onClose }: ReaderModalProps) {
  const [copiedCitation, setCopiedCitation] = useState(false);

  useEffect(() => {
    setCopiedCitation(false);
  }, [work]);

  useEffect(() => {
    if (!work) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [work, onClose]);

  if (!work) {
    return null;
  }

  const handleCopyCitation = async () => {
    const citation = buildShareCitation(work, PROFILE_IDENTITY.fullName);
    try {
      await navigator.clipboard.writeText(citation);
      setCopiedCitation(true);
      window.setTimeout(() => setCopiedCitation(false), 2500);
    } catch {
      setCopiedCitation(true);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reader-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-xl">
        <div className="flex items-start justify-between gap-4 bg-[#0B1120] px-6 py-6 sm:px-10 sm:py-7 text-slate-100">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300 tabular-nums">
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
              className="mt-2 font-serif text-2xl font-semibold text-white sm:text-3xl text-balance tracking-[0.01em]"
            >
              {work.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup pratinjau karya"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="p-6 sm:p-10">
          <div className="space-y-4">
            <p className="text-sm font-medium text-slate-600">
              Ditulis oleh {PROFILE_IDENTITY.fullName} — {work.platform}
            </p>
            {work.excerpt.map((paragraph, index) => (
              <p
                key={index}
                className="font-serif text-base leading-relaxed text-slate-800 sm:text-[1.0625rem]"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-6">
            <button
              type="button"
              onClick={handleCopyCitation}
              className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            >
              {copiedCitation ? (
                <>
                  <Check className="h-4 w-4 text-blue-700" aria-hidden="true" />
                  <span>Kutipan Disalin</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 text-slate-500" aria-hidden="true" />
                  <span>Salin Kutipan</span>
                </>
              )}
            </button>

            <a
              href={work.externalUrl}
              target="_blank"
              rel="me noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-blue-700 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-800 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
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
