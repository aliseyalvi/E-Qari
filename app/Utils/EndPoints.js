import { BASE_URL } from 'react-native-dotenv';

const quranList = `${BASE_URL}v1/surat`;
const quranDetail = (surahId, jmlAyat) =>
  `${BASE_URL}v1/ayatweb/${surahId}/0/0/${jmlAyat}`;

const quranArabicUthmani = chapterNo =>
  `${BASE_URL}/quran/verses/uthmani?chapter_number=${chapterNo}`;

const quranArabicIndopak = chapterNo =>
  `${BASE_URL}/quran/verses/indopak?chapter_number=${chapterNo}`;

  const quranTranslation = (translationId, chapterNo) =>
  `${BASE_URL}/quran/translations/${translationId}?chapter_number=${chapterNo}`;



export { quranList, quranDetail, quranArabicUthmani, quranArabicIndopak, quranTranslation };
