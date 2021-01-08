import {
  REQ_QURAN_DETAIL,
  REQ_QURAN_DETAIL_SUCCESS,
  REQ_QURAN_DETAIL_FAILURE,
} from '../Types';
import axios from 'axios';
import { quranDetail } from '../../../Utils/EndPoints';
import { Constants } from '../../../Utils/Constants';
import {surahs} from '../../../Assets/surah'
import {getSurah} from '../../../Data'

import Reactotron from 'reactotron-react-native'

const getDetailQuran = payload => async dispatch => {
  const { surahId, countAyat } = payload;
  dispatch({ type: REQ_QURAN_DETAIL });
  console.log('surahId',surahId,'type',typeof surahId,'countAyat',countAyat);
  //const response = require('./quranDetails.json')
  const response = getSurah(surahId)
  //const response = surahs[surahId] ? surahs[surahId] : surahs[1]
  //Reactotron.log(response)
  Reactotron.log('response in actions',response)
  //console.log('getSurah',getSurah(surahId));
    dispatch({
      type: REQ_QURAN_DETAIL_SUCCESS,
      //payload: response.data,
      payload: response,
    });
 /*  try {
    const response = await axios.get(quranDetail(surahId, countAyat));
    
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
  } */
};

export { getDetailQuran };