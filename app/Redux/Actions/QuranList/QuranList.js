import {
  REQ_QURAN_LIST,
  REQ_QURAN_LIST_SUCCESS,
  REQ_QURAN_LIST_FAILURE,
} from '../Types';
import {surahList} from '../../../Data'
import axios from 'axios';
import { quranList } from '../../../Utils/EndPoints';
import { Constants } from '../../../Utils/Constants';

const getQuranList = () => async dispatch => {
  // dispatch empty action to start the api call and make loading and refreshing true
  dispatch({ type: REQ_QURAN_LIST });
  
  try {
    //const response = await axios.get(quranList);
    const response = surahList
    // console.log('surah list : ', surahList);
/*     
    const response = require('./surah.json')
    //console.log('response in actions',response.data)
    dispatch({
      type: REQ_QURAN_LIST_SUCCESS,
      payload: response.data,
    });
 */
    if (response?.code === Constants.RESPONSE_CODE.SUCCESS) {
      dispatch({
        type: REQ_QURAN_LIST_SUCCESS,
        payload: response?.data,
      });
    } else {
      dispatch({
        type: REQ_QURAN_LIST_FAILURE,
        error:
          'error while fetching list',
      });
    }
  } catch (error) {
    dispatch({
      type: REQ_QURAN_LIST_FAILURE,
      error: 'error while fetching list',
    });
  }
};

export { getQuranList };
