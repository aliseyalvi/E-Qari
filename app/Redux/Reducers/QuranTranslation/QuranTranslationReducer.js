import {
  REQ_QURAN_TRANSLATION,
  REQ_QURAN_TRANSLATION_SUCCESS,
  REQ_QURAN_TRANSLATION_FAILURE,

} from '../../Actions/Types';

const initialState = {
  actionStatus: '',
  data: {},
  error: false,
  errorMessage: '',
  loading: false,
  refreshing: false,
};

const QuranTranslation = (state = initialState, action) => {
  switch (action.type) {
    case REQ_QURAN_TRANSLATION:
      return {
        ...state,
        actionStatus: REQ_QURAN_TRANSLATION,
        error: false,
        errorMessage: '',
        loading: true,
        refreshing: true,
        data: initialState.data,
      };
    case REQ_QURAN_TRANSLATION_SUCCESS:
      return {
        ...state,
        actionStatus: REQ_QURAN_TRANSLATION_SUCCESS,
        data: action.payload,
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
        data: initialState.data,
      };
    default:
      return state;
  }
};


export {  QuranTranslation };
