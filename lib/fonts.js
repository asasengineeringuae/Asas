import {Almarai} from 'next/font/google';

/** Arabic UI — Almarai (weights from the official Google Fonts family). */
export const almarai = Almarai({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '700', '800'],
  display: 'swap',
  variable: '--font-almarai',
});
