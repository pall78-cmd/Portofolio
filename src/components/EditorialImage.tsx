import { useState } from 'react';
import { BookOpen } from 'lucide-react';

interface EditorialImageProps {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  imgClassName?: string;
  dark?: boolean;
}

export function EditorialImage({
  src,
  alt,
  caption,
  className = '',
  imgClassName = '',
  dark = false,
}: EditorialImageProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <figure
      className={`relative overflow-hidden border ${
        dark ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-slate-100'
      } ${className}`}
    >
      {hasError ? (
        <div
          className={`flex h-full min-h-[260px] w-full flex-col items-center justify-center p-8 text-center ${
            dark
              ? 'bg-gradient-to-br from-slate-900 to-slate-800'
              : 'bg-gradient-to-br from-slate-100 to-slate-200'
          }`}
        >
          <BookOpen
            className={`h-7 w-7 mb-3 ${dark ? 'text-amber-400' : 'text-slate-500'}`}
            aria-hidden="true"
          />
          <p className={`font-serif text-base max-w-xs ${dark ? 'text-slate-200' : 'text-slate-700'}`}>
            {alt}
          </p>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
          onError={() => setHasError(true)}
          className={`block w-full h-full object-cover ${imgClassName}`}
        />
      )}
      {caption && (
        <figcaption
          className={`border-t px-4 py-2.5 text-xs ${
            dark
              ? 'border-slate-800 bg-[#111B33] text-slate-300'
              : 'border-slate-200 bg-white text-slate-600'
          }`}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
