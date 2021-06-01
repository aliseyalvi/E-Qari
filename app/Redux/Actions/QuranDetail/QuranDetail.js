import {
  REQ_QURAN_DETAIL,
  REQ_QURAN_DETAIL_SUCCESS,
  REQ_QURAN_DETAIL_FAILURE,
  REQ_QURAN_TRANSLATION,
  REQ_QURAN_TRANSLATION_SUCCESS,
  REQ_QURAN_TRANSLATION_FAILURE,
} from '../Types';
import axios from 'axios';
import {
  quranArabicEndpoint,
  quranArabicAudioTranslationEndpoint,
  quranUrduTranslationEndpoint,
} from '../../../Utils/EndPoints';
import { Constants } from '../../../Utils/Constants';


const getDetailQuran = payload => async dispatch => {
  // dispatch empty action to start the api call and make loading and refreshing true
  dispatch({ type: REQ_QURAN_DETAIL });

  // destructure payload parameters
  const { surahId, countAyat } = payload;

 
  try {
    const response = await axios.get(quranArabicEndpoint(surahId));
    console.log('surah data response : ', response);
    if (response?.status === Constants.RESPONSE_CODE.SUCCESS) {
      dispatch({
        type: REQ_QURAN_DETAIL_SUCCESS,
        payload: response?.data?.data,
      });
    } else {
      dispatch({
        type: REQ_QURAN_DETAIL_FAILURE,
        error: 'Error while fetching data',
      });
    }
  } catch (error) {
    dispatch({
      type: REQ_QURAN_DETAIL_FAILURE,
      error: 'Error while fetching data',
    });
  }
};

const getQuranTextAudioTranslationDefault = payload => async dispatch => {
  // dispatch empty action to start the api call and make loading and refreshing true
  dispatch({ type: REQ_QURAN_DETAIL });

  // destructure payload parameters
  const { surahId, countAyat } = payload;
  console.log('Inside action surahId :', surahId , 'countAyat : ', countAyat);
  console.log('getQuranTextAudioTranslationDefault endpoint: ', quranArabicAudioTranslationEndpoint(surahId) );
  try {
    console.log('api call started!')
    const response = await axios.get(quranArabicAudioTranslationEndpoint(surahId))
    console.log('api call end!');
    console.log('getQuranTextAudioTranslationDefault response : ', response.data);
    if (response?.status === Constants.RESPONSE_CODE.SUCCESS) {
      dispatch({
        type: REQ_QURAN_DETAIL_SUCCESS,
        payload: response?.data?.data,
      });
    } else {
      dispatch({
        type: REQ_QURAN_DETAIL_FAILURE,
        error: 'Error while fetching data',
      });
    }
  } catch (error) {
    console.log('api call error!');
    dispatch({
      type: REQ_QURAN_DETAIL_FAILURE,
      error: 'Error while fetching data',
    });
  }


};

// request quran translations based on selection
const getQuranTranslationSelected = payload => async dispatch => {
  // dispatch empty action to start the api call and make loading and refreshing true
  dispatch({ type: REQ_QURAN_TRANSLATION });

  // destructure payload parameters
  const { surahId, translationKey } = payload;
  console.log('surahId, translationKey : ', surahId, translationKey)
  console.log('quranUrduTranslationEndpoint endpoint: ', quranUrduTranslationEndpoint(surahId, translationKey) );
  try {
    const response = await axios.get(quranUrduTranslationEndpoint(surahId, translationKey))
    console.log('quranUrduTranslationEndpoint response : ', response);
    if (response.status === Constants.RESPONSE_CODE.SUCCESS) {
      dispatch({
        type: REQ_QURAN_TRANSLATION_SUCCESS,
        payload: response?.data?.data,
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

export {
  getDetailQuran,
  getQuranTextAudioTranslationDefault,
  getQuranTranslationSelected,
};
