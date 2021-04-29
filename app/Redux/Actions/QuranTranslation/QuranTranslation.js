import {
  REQ_QURAN_TRANSLATION,
  REQ_QURAN_TRANSLATION_SUCCESS,
  REQ_QURAN_TRANSLATION_FAILURE,
} from '../Types';
import axios from 'axios';
import { quranDetail, quranArabicUthmani, quranArabicIndopak, quranTranslation } from '../../../Utils/EndPoints';
import { Constants } from '../../../Utils/Constants';
import { surahs } from '../../../Assets/surah';
import { getSurah } from '../../../Data';

import Reactotron from 'reactotron-react-native';


const getQuranTranslation = payload => async dispatch => {
  const { translationId, chapterNo } = payload;
  // console.log('translationId, chapterNo : ', translationId, chapterNo );
  try {
    const response = await axios.get(quranTranslation(translationId,chapterNo));
    // console.log('translation response : ', response );
    if (response?.status === Constants.RESPONSE_CODE.SUCCESS) {
      dispatch({
        type: REQ_QURAN_TRANSLATION_SUCCESS,
        payload: response?.data?.translations,
      });
    } else {
      dispatch({
        type: REQ_QURAN_TRANSLATION_FAILURE,
        error: 'Error while fetching data',
      });
    }
  } catch (error) {
    dispatch({
      type: REQ_QURAN_TRANSLATION_FAILURE,
      error: 'Error while fetching data',
    });
  }
};

export { getQuranTranslation };
