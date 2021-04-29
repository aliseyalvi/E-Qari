import { connect } from 'react-redux';

import QuranDetail from './QuranDetail.component';
import { getDetailQuran } from '../../Redux/Actions/QuranDetail/QuranDetail';
import { getQuranTranslation } from '../../Redux/Actions/QuranTranslation/QuranTranslation';

const mapStateToProps = state => ({
  arabicAyatData: state.qurandetail.data,
  translationData: state.quranTranslation.data,
  isLoading: state.qurandetail.loading,
  refreshing: state.qurandetail.refreshing,
});

const mapDispatchToProps = dispatch => ({
  getDetailQuran: payload => dispatch(getDetailQuran(payload)),
  getQuranTranslation: payload => dispatch(getQuranTranslation(payload)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(QuranDetail);
