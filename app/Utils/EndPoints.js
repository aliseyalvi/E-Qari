import { BASE_URL } from 'react-native-dotenv';

const quranList = `${BASE_URL}v1/surat`;
const quranDetail = (surahId, jmlAyat) =>
  `${BASE_URL}v1/ayatweb/${surahId}/0/0/${jmlAyat}`;

const quranArabicEndpoint = surahId => `${BASE_URL}surah/${surahId}`;
const quranArabicAudioTranslationEndpoint = surahId =>
  `${BASE_URL}surah/${surahId}/editions/ar.alafasy,ur.maududi`;
const quranUrduTranslationEndpoint = (surahId, translationKey) =>
  `${BASE_URL}surah/${surahId}/${translationKey}`;

export {
  quranList,
  quranDetail,
  quranArabicEndpoint,
  quranArabicAudioTranslationEndpoint,
  quranUrduTranslationEndpoint
};
