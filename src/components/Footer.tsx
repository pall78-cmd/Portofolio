import { OFFICIAL_LINKS, PROFILE_IDENTITY } from '../data/profileData';

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-[#070B14] text-slate-200">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <div>
          <p className="font-serif text-base font-semibold text-white tracking-[0.01em]">
            {PROFILE_IDENTITY.fullName}
          </p>
          <p className="mt-0.5 text-xs text-slate-400">
            Sastra Inggris UIN Sunan Ampel Surabaya · EDSA Executive 2026
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-xs font-medium text-slate-300">
          {OFFICIAL_LINKS.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="me noopener noreferrer"
              className="hover:text-amber-400 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              {link.ctaLabel}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
