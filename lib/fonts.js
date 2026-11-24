import {IBM_Plex_Sans_Arabic} from 'next/font/google';

/** Corporate Arabic stack (DIN Next Arabic substitute until licensed files exist). */
export const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-ibm-plex-arabic',
});
