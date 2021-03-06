import { connect } from 'react-redux';

import QuranDetail from './QuranDetail.component';
import {
  getDetailQuran,
  getQuranTextAudioTranslationDefault,
  getQuranTranslationSelected
} from '../../Redux/Actions/QuranDetail/QuranDetail';

const mapStateToProps = state => ({
  arabicData: state.qurandetail.data,
  translationData: state.qurandetail.translationData,
  isLoading: state.qurandetail.loading,
  refreshing: state.qurandetail.refreshing,
});

const mapDispatchToProps = dispatch => ({
  getDetailQuran: payload => dispatch(getDetailQuran(payload)),

  getQuranTextAudioTranslationDefault: payload =>
    dispatch(getQuranTextAudioTranslationDefault(payload)),

    getQuranTranslationSelected: payload => dispatch(getQuranTranslationSelected(payload)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(QuranDetail);
