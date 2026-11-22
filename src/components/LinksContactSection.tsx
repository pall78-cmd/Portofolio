import { useCallback, useEffect, useState, type FormEvent } from 'react';
import {
  AlertTriangle,
  ArrowUpRight,
  Check,
  Copy,
  Loader2,
  RefreshCw,
  Send,
  ShieldCheck,
} from 'lucide-react';
import { OFFICIAL_LINKS } from '../data/profileData';
import { type ContactFormErrors, validateContactForm } from '../utils/portfolio';
import { playUiSound } from '../utils/soundFx';

const TOPIC_OPTIONS = [
  'Diskusi Sastra & Penulisan',
  'Kolaborasi Karya (@ashborne)',
  'Agenda EDSA Executive 2026',
  'Undangan & Acara Kampus',
];

interface ApiSpamVerdict {
  isSpam: boolean;
  category: string;
  confidence: string;
  reason: string;
}

interface ContactChallenge {
  token: string;
  question: string;
}

type ExtendedFormErrors = ContactFormErrors & {
  challengeAnswer?: string;
};

interface ContactApiResponse {
  ok: boolean;
  status: 'delivered' | 'screened_pending_smtp' | 'blocked_spam' | 'challenge_failed' | 'error';
  emailDelivered: boolean;
  spamCheck?: ApiSpamVerdict;
  message: string;
  fieldErrors?: ExtendedFormErrors;
}

interface LinksContactSectionProps {
  soundEnabled?: boolean;
}

export function LinksContactSection({ soundEnabled = true }: LinksContactSectionProps) {
  const [copiedProfileUrl, setCopiedProfileUrl] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState(TOPIC_OPTIONS[0]);
  const [message, setMessage] = useState('');
  const [websiteHoneypot, setWebsiteHoneypot] = useState('');
  const [challenge, setChallenge] = useState<ContactChallenge | null>(null);
  const [challengeAnswer, setChallengeAnswer] = useState('');
  const [isLoadingChallenge, setIsLoadingChallenge] = useState(false);
  const [errors, setErrors] = useState<ExtendedFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitAlert, setSubmitAlert] = useState<{
    type: 'blocked_spam' | 'error';
    message: string;
    spamCheck?: ApiSpamVerdict;
  } | null>(null);
  const [submittedRecord, setSubmittedRecord] = useState<{
    name: string;
    email: string;
    topic: string;
    message: string;
    status: 'delivered' | 'screened_pending_smtp';
    emailDelivered: boolean;
    statusMessage: string;
    spamCheck?: ApiSpamVerdict;
  } | null>(null);

  const loadChallenge = useCallback(async () => {
    setIsLoadingChallenge(true);
    try {
      const response = await fetch('/api/contact/challenge', { cache: 'no-store' });
      if (response.ok) {
        const data = (await response.json()) as ContactChallenge;
        setChallenge(data);
        setChallengeAnswer('');
      }
    } catch {
      // Handled gracefully when submitting
    } finally {
      setIsLoadingChallenge(false);
    }
  }, []);

  useEffect(() => {
    void loadChallenge();
  }, [loadChallenge]);

  const handleCopyProfileLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedProfileUrl(true);
      void playUiSound('copy', soundEnabled);
      window.setTimeout(() => setCopiedProfileUrl(false), 2500);
    } catch {
      setCopiedProfileUrl(true);
      void playUiSound('copy', soundEnabled);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitAlert(null);

    const result = validateContactForm({ name, email, topic, message });
    const nextErrors: ExtendedFormErrors = { ...result.errors };
    const challengeToken = challenge?.token ?? '';

    if (!challengeToken) {
      nextErrors.challengeAnswer = 'Soal verifikasi belum siap. Klik Ganti soal terlebih dahulu.';
    } else if (!/^\s*\d{1,3}\s*$/.test(challengeAnswer)) {
      nextErrors.challengeAnswer = 'Masukkan angka jawaban verifikasi terlebih dahulu.';
    }

    if (!result.valid || nextErrors.challengeAnswer) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(15_000),
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          topic: topic.trim(),
          message: message.trim(),
          website: websiteHoneypot,
          challengeToken,
          challengeAnswer: challengeAnswer.trim(),
        }),
      });

      const data = (await response.json()) as ContactApiResponse;

      if (!response.ok || !data.ok) {
        if (data.fieldErrors && Object.keys(data.fieldErrors).length > 0) {
          setErrors(data.fieldErrors);
        }
        setSubmitAlert({
          type: data.status === 'blocked_spam' ? 'blocked_spam' : 'error',
          message: data.message || 'Gagal memproses pesan saat ini.',
          spamCheck: data.spamCheck,
        });
        if (data.status === 'challenge_failed' || data.status === 'blocked_spam') {
          void loadChallenge();
        }
        return;
      }

      void playUiSound('success', soundEnabled);
      setSubmittedRecord({
        name: name.trim(),
        email: email.trim(),
        topic: topic.trim(),
        message: message.trim(),
        status: data.status === 'delivered' ? 'delivered' : 'screened_pending_smtp',
        emailDelivered: data.emailDelivered,
        statusMessage: data.message,
        spamCheck: data.spamCheck,
      });
    } catch {
      setSubmitAlert({
        type: 'error',
        message:
          'Tidak dapat terhubung ke server penyaring pesan. Periksa koneksi Anda lalu coba lagi.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    void playUiSound('tap', soundEnabled);
    setName('');
    setEmail('');
    setTopic(TOPIC_OPTIONS[0]);
    setMessage('');
    setWebsiteHoneypot('');
    setChallengeAnswer('');
    setErrors({});
    setSubmitAlert(null);
    setSubmittedRecord(null);
    void loadChallenge();
  };

  return (
    <section id="tautan" className="reveal-stage scroll-mt-16 bg-[#FAF7F2]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 gap-10 md:gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="text-xs font-semibold tracking-wide text-[#C81E1E]">
              Verifikasi Identitas
            </p>
            <h2 className="mt-2 font-serif text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl lg:text-4xl text-balance">
              Tautan Resmi
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-stone-600 sm:text-base">
              Seluruh serial fiksi, esai sastra, pembaruan pembaca, dan aktivitas kemahasiswaan
              terhubung melalui empat kanal resmi berikut.
            </p>

            <div className="mt-7 md:mt-8 grid grid-cols-1 divide-y divide-stone-300 border-y border-stone-300 md:grid-cols-2 md:gap-4 md:divide-y-0 md:border-y-0 lg:grid-cols-1 lg:gap-0 lg:divide-y lg:border-y">
              {OFFICIAL_LINKS.map((link, idx) => {
                const hoverTint =
                  link.id === 'wattpad'
                    ? 'hover:bg-orange-50/70'
                    : link.id === 'whatsapp'
                      ? 'hover:bg-emerald-50/70'
                      : link.id === 'instagram'
                        ? 'hover:bg-rose-50/70'
                        : 'hover:bg-amber-50/70';

                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="me noopener noreferrer"
                    onClick={() => void playUiSound('open', soundEnabled)}
                    className={`group flex items-start justify-between gap-3.5 px-2 py-4 sm:px-3 md:rounded-lg md:border md:border-stone-300 md:bg-white/75 md:p-5 lg:rounded-md lg:border-0 lg:bg-transparent lg:px-2 lg:py-5 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C81E1E] ${hoverTint}`}
                  >
                    <div className="flex items-start gap-3 sm:gap-3.5">
                      <span className="font-mono text-xs font-semibold text-stone-400 group-hover:text-[#C81E1E] pt-1 tabular-nums">
                        0{idx + 1}
                      </span>
                      <div>
                        <p className="text-xs font-semibold text-[#C81E1E]">{link.platform}</p>
                        <p className="mt-0.5 font-serif text-base sm:text-lg font-semibold leading-snug text-stone-950 group-hover:underline underline-offset-4">
                          {link.ctaLabel}
                        </p>
                        <p className="mt-1.5 text-xs leading-relaxed text-stone-600">
                          {link.description}
                        </p>
                      </div>
                    </div>
                    <ArrowUpRight
                      className="mt-1 h-4 w-4 shrink-0 text-stone-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#C81E1E]"
                      aria-hidden="true"
                    />
                  </a>
                );
              })}
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={handleCopyProfileLink}
                className="inline-flex min-h-11 sm:min-h-10 w-full sm:w-auto items-center justify-center gap-2 rounded-md border border-stone-300 bg-white px-4 py-2 text-xs font-semibold text-stone-800 hover:border-[#0C0D10] hover:bg-stone-100 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C81E1E]"
              >
                {copiedProfileUrl ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-700" aria-hidden="true" />
                    <span>Tautan Profil Disalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 text-stone-500" aria-hidden="true" />
                    <span>Salin Tautan Profil</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div id="kontak" className="scroll-mt-20 lg:col-span-7">
            <div className="overflow-hidden rounded-xl border border-stone-300 bg-white shadow-sm">
              <div className="bg-[#0C0D10] px-5 py-5 sm:px-8 sm:py-7 text-stone-100">
                <p className="text-xs font-semibold tracking-wide text-amber-400">Korespondensi</p>
                <h2 className="mt-2 font-serif text-xl sm:text-2xl lg:text-3xl font-semibold text-white tracking-[0.01em]">
                  Kirim Pesan atau Ajakan Kolaborasi
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-stone-300 tracking-[0.01em]">
                  Terbuka untuk diskusi karya sastra, proyek penulisan bersama, maupun koordinasi
                  kegiatan EDSA Executive 2026 Kabinet Atarascent. Setiap pesan disaring otomatis
                  terhadap spam, bot, dan tautan mencurigakan sebelum diteruskan ke email pemilik.
                </p>
              </div>

              <div className="p-5 sm:p-7 md:p-8">
                {submittedRecord ? (
                  <div role="status" className="pt-1">
                    <div className="flex items-center gap-2 text-sm font-semibold text-stone-950">
                      {submittedRecord.emailDelivered ? (
                        <Check className="h-4 w-4 text-emerald-700 shrink-0" aria-hidden="true" />
                      ) : (
                        <ShieldCheck
                          className="h-4 w-4 text-emerald-700 shrink-0"
                          aria-hidden="true"
                        />
                      )}
                      <span>
                        {submittedRecord.emailDelivered
                          ? 'Pesan lolos penyaring spam & terkirim ke email'
                          : 'Pesan lolos penyaring spam (pengiriman email belum aktif)'}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-stone-600">
                      Terima kasih, <strong className="text-stone-900">{submittedRecord.name}</strong>.{' '}
                      {submittedRecord.statusMessage} Anda juga dapat menyapa langsung melalui
                      Instagram{' '}
                      <a
                        href="https://www.instagram.com/iniipalll_?evlk=NHRpcmp5MzBjcTZt"
                        target="_blank"
                        rel="me noopener noreferrer"
                        className="font-semibold text-[#C81E1E] underline underline-offset-2"
                      >
                        @iniipalll_
                      </a>
                      .
                    </p>
                    <div className="mt-4 space-y-1.5 border-t border-stone-200 pt-4 text-xs text-stone-600">
                      {submittedRecord.spamCheck && (
                        <p>
                          Hasil Penyaringan:{' '}
                          <strong className="text-stone-800">
                            {submittedRecord.spamCheck.category}
                          </strong>{' '}
                          ({submittedRecord.spamCheck.reason})
                        </p>
                      )}
                      <p>Topik: {submittedRecord.topic}</p>
                      <p>Email Pengirim: {submittedRecord.email}</p>
                      <p>Pesan: &ldquo;{submittedRecord.message}&rdquo;</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="mt-5 inline-flex items-center justify-center rounded-md border border-stone-300 bg-white px-4 py-2 text-xs font-semibold text-stone-800 hover:bg-stone-100 transition-colors whitespace-nowrap shrink-0"
                    >
                      Kirim Pesan Lain
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="space-y-4">
                    {submitAlert && (
                      <div
                        role="alert"
                        className={`rounded-md border p-3.5 text-xs leading-relaxed ${
                          submitAlert.type === 'blocked_spam'
                            ? 'border-amber-300 bg-amber-50 text-amber-950'
                            : 'border-red-200 bg-red-50 text-red-900'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                          <div className="space-y-1">
                            <p className="font-semibold">{submitAlert.message}</p>
                            {submitAlert.spamCheck && (
                              <p>
                                Kategori: {submitAlert.spamCheck.category} —{' '}
                                {submitAlert.spamCheck.reason}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="hidden" aria-hidden="true">
                      <label htmlFor="contact-website">Situs Web</label>
                      <input
                        id="contact-website"
                        name="website"
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        value={websiteHoneypot}
                        onChange={(e) => setWebsiteHoneypot(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="contact-name"
                          className="block text-xs font-semibold text-stone-800"
                        >
                          Nama Lengkap
                        </label>
                        <input
                          id="contact-name"
                          name="name"
                          type="text"
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value);
                            if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                          }}
                          aria-invalid={Boolean(errors.name)}
                          placeholder="Nama Anda"
                          className="mt-1.5 w-full rounded-md border border-stone-300 bg-[#FAF7F2] px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-[#C81E1E] focus:bg-white focus:outline-none"
                        />
                        {errors.name && (
                          <p className="mt-1.5 text-xs font-medium text-red-700" role="alert">
                            {errors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="contact-email"
                          className="block text-xs font-semibold text-stone-800"
                        >
                          Alamat Email
                        </label>
                        <input
                          id="contact-email"
                          name="email"
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                          }}
                          aria-invalid={Boolean(errors.email)}
                          placeholder="nama@contoh.ac.id"
                          className="mt-1.5 w-full rounded-md border border-stone-300 bg-[#FAF7F2] px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-[#C81E1E] focus:bg-white focus:outline-none"
                        />
                        {errors.email && (
                          <p className="mt-1.5 text-xs font-medium text-red-700" role="alert">
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="contact-topic"
                        className="block text-xs font-semibold text-stone-800"
                      >
                        Topik Pesan
                      </label>
                      <select
                        id="contact-topic"
                        name="topic"
                        value={topic}
                        onChange={(e) => {
                          setTopic(e.target.value);
                          if (errors.topic) setErrors((prev) => ({ ...prev, topic: undefined }));
                        }}
                        className="mt-1.5 w-full rounded-md border border-stone-300 bg-[#FAF7F2] px-3.5 py-2.5 text-sm text-stone-900 focus:border-[#C81E1E] focus:bg-white focus:outline-none"
                      >
                        {TOPIC_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      {errors.topic && (
                        <p className="mt-1.5 text-xs font-medium text-red-700" role="alert">
                          {errors.topic}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="contact-message"
                        className="block text-xs font-semibold text-stone-800"
                      >
                        Pesan
                      </label>
                      <textarea
                        id="contact-message"
                        name="message"
                        rows={4}
                        value={message}
                        onChange={(e) => {
                          setMessage(e.target.value);
                          if (errors.message) {
                            setErrors((prev) => ({ ...prev, message: undefined }));
                          }
                        }}
                        aria-invalid={Boolean(errors.message)}
                        placeholder="Tuliskan pesan atau rencana kolaborasi Anda..."
                        className="mt-1.5 w-full rounded-md border border-stone-300 bg-[#FAF7F2] px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-[#C81E1E] focus:bg-white focus:outline-none"
                      />
                      {errors.message && (
                        <p className="mt-1.5 text-xs font-medium text-red-700" role="alert">
                          {errors.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="contact-challenge"
                        className="block text-xs font-semibold text-stone-800"
                      >
                        Verifikasi Anti-Bot:{' '}
                        <span className="font-mono text-[#C81E1E]">
                          {challenge ? challenge.question : 'Memuat soal...'}
                        </span>
                      </label>
                      <div className="mt-1.5 flex flex-wrap items-center gap-3">
                        <input
                          id="contact-challenge"
                          name="challengeAnswer"
                          type="text"
                          inputMode="numeric"
                          value={challengeAnswer}
                          onChange={(e) => {
                            setChallengeAnswer(e.target.value);
                            if (errors.challengeAnswer) {
                              setErrors((prev) => ({ ...prev, challengeAnswer: undefined }));
                            }
                          }}
                          aria-invalid={Boolean(errors.challengeAnswer)}
                          placeholder="Angka"
                          className="w-28 rounded-md border border-stone-300 bg-[#FAF7F2] px-3.5 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:border-[#C81E1E] focus:bg-white focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            void playUiSound('tap', soundEnabled);
                            void loadChallenge();
                          }}
                          disabled={isLoadingChallenge}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 hover:text-[#C81E1E] disabled:opacity-50 transition-colors"
                        >
                          <RefreshCw
                            className={`h-3.5 w-3.5 ${isLoadingChallenge ? 'animate-spin' : ''}`}
                            aria-hidden="true"
                          />
                          <span>Ganti soal</span>
                        </button>
                      </div>
                      {errors.challengeAnswer && (
                        <p className="mt-1.5 text-xs font-medium text-red-700" role="alert">
                          {errors.challengeAnswer}
                        </p>
                      )}
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex min-h-11 items-center gap-2 rounded-md bg-[#C81E1E] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#991B1B] disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C81E1E]"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                            <span>Memeriksa &amp; Mengirim...</span>
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4" aria-hidden="true" />
                            <span>Kirim Pesan</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
