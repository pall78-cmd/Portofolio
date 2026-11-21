import type { WorkCategory, WritingWork } from '../data/profileData';

export type CategoryFilter = 'Semua' | WorkCategory;

export const WORK_CATEGORIES: CategoryFilter[] = [
  'Semua',
  'Fiksi & Serial',
  'Puisi',
  'Saluran & E-book',
];

export interface ContactFormInput {
  name: string;
  email: string;
  topic: string;
  message: string;
}

export interface ContactFormErrors {
  name?: string;
  email?: string;
  topic?: string;
  message?: string;
}

export function filterWorks(
  works: WritingWork[],
  category: CategoryFilter,
  query: string
): WritingWork[] {
  const normalizedQuery = query.trim().toLowerCase();

  return works.filter((work) => {
    const matchesCategory = category === 'Semua' || work.category === category;
    if (!matchesCategory) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    return (
      work.title.toLowerCase().includes(normalizedQuery) ||
      work.summary.toLowerCase().includes(normalizedQuery) ||
      work.category.toLowerCase().includes(normalizedQuery) ||
      work.platform.toLowerCase().includes(normalizedQuery)
    );
  });
}

export function buildShareCitation(work: WritingWork, authorName: string): string {
  return `${authorName} — "${work.title}" (${work.category}, ${work.publishedDate}). ${work.platform}.`;
}

export function validateContactForm(input: ContactFormInput): {
  valid: boolean;
  errors: ContactFormErrors;
} {
  const errors: ContactFormErrors = {};
  const name = input.name.trim();
  const email = input.email.trim();
  const topic = input.topic.trim();
  const message = input.message.trim();

  if (name.length < 2) {
    errors.name = 'Nama lengkap minimal terdiri dari 2 karakter.';
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    errors.email = 'Alamat email wajib diisi.';
  } else if (!emailPattern.test(email)) {
    errors.email = 'Format alamat email tidak valid.';
  }

  if (!topic) {
    errors.topic = 'Pilih topik pesan terlebih dahulu.';
  }

  if (message.length < 10) {
    errors.message = 'Pesan minimal terdiri dari 10 karakter.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
