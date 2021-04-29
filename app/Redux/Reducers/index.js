import { combineReducers } from 'redux';

import { QuranList } from '../Reducers/QuranList/QuranListReducer';
import { QuranDetail } from '../Reducers/QuranDetail/QuranDetailReducer';
import { QuranTranslation } from '../Reducers/QuranTranslation/QuranTranslationReducer';
import { language } from '../Reducers/Language/LanguageReducer';

const appReducer = combineReducers({
  quranList: QuranList,
  qurandetail: QuranDetail,
  quranTranslation: QuranTranslation,
  language: language,
});

export { appReducer };
