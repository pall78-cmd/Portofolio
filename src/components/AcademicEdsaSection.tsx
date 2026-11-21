import { ArrowUpRight } from 'lucide-react';
import {
  JOURNEY_MILESTONES,
  ORGANIZATION_REFERENCE,
  PROFILE_IDENTITY,
} from '../data/profileData';
import { EditorialImage } from './EditorialImage';

export function AcademicEdsaSection() {
  return (
    <section id="perjalanan" className="scroll-mt-16 border-b border-slate-800 bg-[#0B1120] text-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5">
            <p className="text-xs font-semibold tracking-wide text-amber-400">
              Akademik &amp; Organisasi
            </p>
            <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-white sm:text-4xl text-balance">
              Sastra Inggris FAHUM UINSA &amp;{' '}
              <span className="whitespace-nowrap">HIMAPRO-SI</span> / EDSA 2026
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base tracking-[0.01em]">
              Keterlibatan di lingkungan Fakultas Adab dan Humaniora (FAHUM) Universitas Islam
              Negeri Sunan Ampel Surabaya mempertemukan ketekunan membaca teks sastra dengan kerja
              kolektif himpunan mahasiswa.
            </p>

            <div className="mt-8">
              <EditorialImage
                src={PROFILE_IDENTITY.proseImage}
                alt={PROFILE_IDENTITY.proseImageAlt}
                caption="Ruang kerja penulisan naskah prosa dan kajian teks sastra."
                className="rounded-lg"
                imgClassName="aspect-[4/3]"
                dark
              />
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="divide-y divide-slate-800 border-t border-b border-slate-800">
              {JOURNEY_MILESTONES.map((item) => (
                <div key={item.index} className="py-7 first:pt-6 last:pb-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-4">
                    <div className="flex items-baseline gap-3">
                      <span className="font-mono text-xs font-semibold text-amber-400 tabular-nums">
                        {item.index}.
                      </span>
                      <h3 className="font-serif text-xl font-semibold text-white tracking-[0.01em]">
                        {item.role}
                      </h3>
                    </div>
                    <span className="text-xs font-medium text-blue-300 tabular-nums whitespace-nowrap shrink-0">
                      {item.period}
                    </span>
                  </div>

                  <p className="mt-1.5 pl-7 text-sm font-medium text-slate-200 tracking-[0.01em]">
                    {item.institution}
                  </p>
                  <p className="mt-2.5 pl-7 text-sm leading-relaxed text-slate-300 tracking-[0.01em]">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-lg border border-slate-800 bg-[#111B33] p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold tracking-wide text-blue-400">
                    Rujukan Organisasi Resmi
                  </p>
                  <h3 className="mt-1 font-serif text-xl font-semibold text-white">
                    {ORGANIZATION_REFERENCE.name}
                  </h3>
                </div>
                <a
                  href={ORGANIZATION_REFERENCE.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 hover:underline underline-offset-4 whitespace-nowrap shrink-0"
                >
                  <span>Instagram {ORGANIZATION_REFERENCE.instagramHandle}</span>
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>

              <p className="mt-2.5 text-sm leading-relaxed text-slate-300 tracking-[0.01em]">
                {ORGANIZATION_REFERENCE.summary}
              </p>

              <div className="mt-5 grid grid-cols-1 gap-6 border-t border-slate-800 pt-5 sm:grid-cols-2">
                {ORGANIZATION_REFERENCE.ecosystems.map((eco) => (
                  <div key={eco.name}>
                    <p className="text-sm font-semibold text-white">{eco.name}</p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-300 tracking-[0.01em]">
                      {eco.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
