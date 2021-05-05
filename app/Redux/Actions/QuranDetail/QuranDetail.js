import {
  REQ_QURAN_DETAIL,
  REQ_QURAN_DETAIL_SUCCESS,
  REQ_QURAN_DETAIL_FAILURE,
  REQ_QURAN_TRANSLATION,
  REQ_QURAN_TRANSLATION_SUCCESS,
  REQ_QURAN_TRANSLATION_FAILURE,
} from '../Types';
import axios from 'axios';
import { quranArabicEndpoint , quranArabicAudioTranslationEndpoint } from '../../../Utils/EndPoints';
import { Constants } from '../../../Utils/Constants';
import { surahs } from '../../../Assets/surah';
import { getSurah } from '../../../Data';

import Reactotron from 'reactotron-react-native';

const getDetailQuran = payload => async dispatch => {
  const { surahId, countAyat } = payload;
  // console.log('surahId : ', surahId);
  // console.log('endpoint : ', quranArabicEndpoint(surahId));
  // dispatch({ type: REQ_QURAN_DETAIL });
  // console.log('surahId',surahId,'type',typeof surahId,'countAyat',countAyat);
  // //const response = require('./quranDetails.json')
  // const response = getSurah(surahId)
  // //const response = surahs[surahId] ? surahs[surahId] : surahs[1]
  // //Reactotron.log(response)
  // Reactotron.log('response in actions',response)
  // //console.log('getSurah',getSurah(surahId));
  //   dispatch({
  //     type: REQ_QURAN_DETAIL_SUCCESS,
  //     //payload: response.data,
  //     payload: response,
  //   });
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
  const { surahId } = payload;
  try {
    const response = await axios.get(quranArabicAudioTranslationEndpoint(surahId));
    console.log('getQuranTextAudioTranslationDefault response : ', response);
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



export { getDetailQuran, getQuranTextAudioTranslationDefault };
