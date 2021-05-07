import { StyleSheet } from 'react-native';

import { Colors } from '../../Themes/Colors';
import { FontType } from '../../Themes/Fonts';

const Styles = StyleSheet.create({
  headerTitle: {
    color: Colors.black,
    fontSize: 16,
    fontFamily: FontType.semiBold,
  },
  headerSubtitle: {
    color: Colors.black,
    fontFamily: FontType.regular,
    fontSize: 14,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    paddingRight:8
  },
});

export { Styles };
