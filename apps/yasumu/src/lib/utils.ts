import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const OTHER_AUDIO_MIMES = new Set(['application/ogg', 'application/x-ogg']);
const BINARY_DATA_MIMES = new Set([
  'application/octet-stream',
  'application/x-msdownload',
  'application/x-msdos-program',
  'application/x-msi',
  'application/x-unknown',
]);
const TEXT_MIMES = new Set([
  'application/json',
  'application/xml',
  'application/xhtml+xml',
  'application/rss+xml',
  'application/atom+xml',
  'application/soap+xml',
  'application/xop+xml',
  'application/javascript',
  'application/ecmascript',
  'application/x-javascript',
  'application/x-ecmascript',
  'application/typescript',
  'application/x-typescript',
]);

export const IS_AUDIO = (mime: string) => mime.startsWith('audio/') || OTHER_AUDIO_MIMES.has(mime);
export const IS_IMAGE = (mime: string) => mime.startsWith('image/');
export const IS_VIDEO = (mime: string) => mime.startsWith('video/');
export const IS_BINARY_DATA = (mime: string) => BINARY_DATA_MIMES.has(mime);
export const IS_TEXT_RESPONSE = (mime: string) => mime.startsWith('text/') || TEXT_MIMES.has(mime);
