import {
  REQ_QURAN_DETAIL,
  REQ_QURAN_DETAIL_SUCCESS,
  REQ_QURAN_DETAIL_FAILURE,
  REQ_QURAN_TRANSLATION,
  REQ_QURAN_TRANSLATION_SUCCESS,
  REQ_QURAN_TRANSLATION_FAILURE,
} from '../../Actions/Types';

const initialState = {
  actionStatus: '',
  data: {},
  translationData: {},
  error: false,
  errorMessage: '',
  loading: false,
  refreshing: false,
};

const QuranDetail = (state = initialState, action) => {
  switch (action.type) {
    case REQ_QURAN_DETAIL:
      return {
        ...state,
        actionStatus: REQ_QURAN_DETAIL,
        error: false,
        errorMessage: '',
        loading: true,
        refreshing: true,
        // data: initialState.data,
        // translationData: initialState.translationData
      };
    case REQ_QURAN_DETAIL_SUCCESS:
      return {
        ...state,
        actionStatus: REQ_QURAN_DETAIL_SUCCESS,
        data: action.payload[0], //this is data of arabic and audio coming from api
        translationData: action.payload[1], //this is data of translation coming from api in same request
        error: false,
        loading: false,
        refreshing: false,
      };
    case REQ_QURAN_DETAIL_FAILURE:
      return {
        ...state,
        actionStatus: REQ_QURAN_DETAIL_FAILURE,
        error: true,
        errorMessage: action.error,
        loading: false,
        refreshing: false,
        data: initialState.data,
        translationData: initialState.translationData
      };

    case REQ_QURAN_TRANSLATION:
      return {
        ...state,
        actionStatus: REQ_QURAN_TRANSLATION,
        error: false,
        errorMessage: '',
        loading: true,
        refreshing: true,
        // translationData: initialState.translationData,
      };
    case REQ_QURAN_TRANSLATION_SUCCESS:
      return {
        ...state,
        actionStatus: REQ_QURAN_TRANSLATION_SUCCESS,
        translationData: action.payload,
        error: false,
        loading: false,
        refreshing: false,
      };
    case REQ_QURAN_TRANSLATION_FAILURE:
      return {
        ...state,
        actionStatus: REQ_QURAN_TRANSLATION_FAILURE,
        error: true,
        errorMessage: action.error,
        loading: false,
        refreshing: false,
        // translationData: initialState.translationData,
      };

    default:
      return state;
  }
};

export { QuranDetail };
