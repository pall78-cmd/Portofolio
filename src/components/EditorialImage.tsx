import { useState } from 'react';
import { BookOpen } from 'lucide-react';

interface EditorialImageProps {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  imgClassName?: string;
  dark?: boolean;
  zoomOnHover?: boolean;
}

export function EditorialImage({
  src,
  alt,
  caption,
  className = '',
  imgClassName = '',
  dark = false,
  zoomOnHover = true,
}: EditorialImageProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <figure
      className={`group relative flex flex-col overflow-hidden border ${
        dark ? 'border-stone-800/90 bg-[#0B0C10]' : 'border-stone-300/90 bg-stone-100'
      } ${className}`}
    >
      {hasError ? (
        <div
          className={`flex flex-1 min-h-[240px] w-full flex-col items-center justify-center p-8 text-center ${
            dark
              ? 'bg-gradient-to-br from-[#0B0C10] to-stone-900'
              : 'bg-gradient-to-br from-[#FAF7F2] to-stone-200'
          }`}
        >
          <BookOpen
            className={`mb-3 h-7 w-7 ${dark ? 'text-amber-400' : 'text-stone-500'}`}
            aria-hidden="true"
          />
          <p className={`max-w-xs font-serif text-base ${dark ? 'text-stone-200' : 'text-stone-700'}`}>
            {alt}
          </p>
        </div>
      ) : (
        <div className="flex-1 min-h-0 w-full overflow-hidden">
          <img
            src={src}
            alt={alt}
            decoding="async"
            referrerPolicy="no-referrer"
            onError={() => setHasError(true)}
            className={`block h-full w-full object-cover ${
              zoomOnHover
                ? 'transform-gpu will-change-transform transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.025]'
                : ''
            } ${imgClassName}`}
          />
        </div>
      )}
      {caption && (
        <figcaption
          className={`border-t px-4 py-2.5 font-serif text-xs italic tracking-[0.01em] ${
            dark
              ? 'border-stone-800/90 bg-[#12141B] text-stone-300'
              : 'border-stone-300/80 bg-[#0B0C10] text-stone-200'
          }`}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
