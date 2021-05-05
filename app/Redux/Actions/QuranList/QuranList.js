import {
  REQ_QURAN_LIST,
  REQ_QURAN_LIST_SUCCESS,
  REQ_QURAN_LIST_FAILURE,
} from '../Types';
import axios from 'axios';
import { quranList } from '../../../Utils/EndPoints';
import { Constants } from '../../../Utils/Constants';

const getQuranList = () => async dispatch => {
  dispatch({ type: REQ_QURAN_LIST });
  //try {
    //const response = await axios.get(quranList);
    //const response = require('./quranList.json')
    const response = require('./surah.json')
    //console.log('response in actions',response.data)
    dispatch({
      type: REQ_QURAN_LIST_SUCCESS,
      payload: response.data,
    });
    /* if (response?.status === Constants.RESPONSE_CODE.SUCCESS) {
      dispatch({
        type: REQ_QURAN_LIST_SUCCESS,
        payload: response?.data?.data,
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
  } */
};

export { getQuranList };
