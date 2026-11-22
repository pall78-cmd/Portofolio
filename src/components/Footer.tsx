import { OFFICIAL_LINKS, PROFILE_IDENTITY } from '../data/profileData';
import { playUiSound } from '../utils/soundFx';

interface FooterProps {
  soundEnabled?: boolean;
}

export function Footer({ soundEnabled = true }: FooterProps) {
  return (
    <footer className="border-t border-stone-800 bg-[#0C0D10] text-stone-200">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-9 sm:px-6 md:flex-row md:items-center md:justify-between md:gap-8 lg:px-8 lg:py-10">
        <div>
          <p className="font-serif text-base font-semibold text-white tracking-[0.01em]">
            {PROFILE_IDENTITY.fullName}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-stone-400">
            Sastra Inggris UIN Sunan Ampel Surabaya · EDSA Executive 2026 (Kabinet Atarascent)
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2.5 sm:flex sm:flex-wrap sm:items-center sm:gap-x-5 sm:gap-y-2 md:justify-end lg:gap-6 text-xs font-medium text-stone-300">
          {OFFICIAL_LINKS.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="me noopener noreferrer"
              onClick={() => void playUiSound('tap', soundEnabled)}
              className="py-1 sm:py-0 hover:text-amber-400 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              {link.ctaLabel}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
