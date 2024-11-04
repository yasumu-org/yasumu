import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isNative() {
  return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
}
