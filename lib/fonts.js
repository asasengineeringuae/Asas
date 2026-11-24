import {Alexandria} from 'next/font/google';

/** Arabic UI — Alexandria, the same family used on u.ae. */
export const alexandria = Alexandria({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-alexandria',
});
