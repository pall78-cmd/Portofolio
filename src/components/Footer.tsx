import { OFFICIAL_LINKS, PROFILE_IDENTITY } from '../data/profileData';
import { playUiSound } from '../utils/soundFx';

interface FooterProps {
  soundEnabled?: boolean;
}

export function Footer({ soundEnabled = true }: FooterProps) {
  return (
    <footer className="border-t border-stone-800 bg-[#0B0C10] text-stone-200">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-10 sm:px-6 md:grid-cols-12 md:items-center md:gap-8 lg:px-10 lg:py-12">
        <div className="md:col-span-6">
          <p className="font-serif text-lg leading-[1.3] font-semibold text-white tracking-[0.01em]">
            {PROFILE_IDENTITY.fullName}
          </p>
          <p className="mt-1.5 text-xs font-[450] leading-[1.6] text-stone-400">
            Sastra Inggris UIN Sunan Ampel Surabaya · EDSA Executive 2026 (Kabinet Atarascent)
          </p>
        </div>

        <div className="md:col-span-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-center lg:justify-end lg:gap-x-7 lg:gap-y-2 text-xs font-medium text-stone-300">
          {OFFICIAL_LINKS.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="me noopener noreferrer"
              onMouseEnter={() => void playUiSound('hover', soundEnabled)}
              onClick={() => void playUiSound('tap', soundEnabled)}
              className="inline-flex min-h-10 lg:min-h-0 items-center py-1 lg:py-0 hover:text-amber-400 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              {link.ctaLabel}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
