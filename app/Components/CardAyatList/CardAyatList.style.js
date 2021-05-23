import { StyleSheet } from 'react-native';

import { Colors } from '../../Themes/Colors';
import { FontType } from '../../Themes/Fonts';

const Styles = StyleSheet.create({
  touchableContainer: {
    borderColor:'rgba(0,0,0,0.1)',
    borderWidth:1,
    marginVertical:8,
    // elevation:1,
    borderRadius:8,
    backgroundColor:'#fff'
  },

  CardStyle: {
    height: 'auto',
    padding: 10,
  },
  cardContainer: {
    flex: 1,
    flexDirection: 'row',
    
  },
  numberCircleContainer: {
    justifyContent:'center',
    alignItems:'center',
    paddingHorizontal:8,
  },
  descContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  NumberCircle: {
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize:20
  },
  ayahNumber:{
    position:'absolute',
    fontFamily: FontType.jameelNoriReg,
    fontSize:16
  },
  textNumber: {
    color: Colors.grey,
    fontSize: 22,
    fontFamily: FontType.semiBold,
  },
  descTextRight: {
    textAlign: 'right',
    paddingTop: 10,
    paddingRight: 10,
    fontSize: 32,
    fontFamily: FontType.pdms,
    lineHeight: 36,
    letterSpacing: 5,
  },
  translationText: {
    textAlign: 'right',
    paddingTop: 10,
    paddingRight: 10,
    fontSize: 20,
    fontFamily: FontType.jameelNoriReg,
    lineHeight: 32,
    letterSpacing: 5,
  },
  descTextLeftContainer: {
    paddingVertical: 10,
    paddingRight: 10,
  },
  descTextLeft: {
    color: Colors.grey,
    fontSize: 14,
    lineHeight: 30,
    fontFamily: FontType.regular,
  },
});

export { Styles };
