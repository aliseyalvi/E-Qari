import { StyleSheet } from 'react-native';

import { Colors } from '../../Themes/Colors';
import { FontType } from '../../Themes/Fonts';

const Styles = StyleSheet.create({
  rippleContainer:{
    borderRadius:8,
    marginVertical:8,
    // shadowColor: "#000",
    // shadowOffset:{
    // width: 0,
    // height: 1,
    // },
    // shadowOpacity: 0.20,
    // shadowRadius: 1.41,
    // elevation: 3,
    borderWidth:1,
    borderColor:'rgba(0,0,0,0.1)'
  },
  CardStyle: {
    height: 'auto',
    width:'100%',
    padding: 8,
    
    
  },
  cardContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  numberCircleContainer: {
    // flex: 0.75,
  },
  ayahContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems:'flex-end',
  },
  NumberCircle: {
    height: 45,
    width: 45,
    borderRadius: 100,
    borderColor: Colors.separator,
    borderWidth: 2,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
    marginLeft: 5,
    marginBottom: 10,
  },
  textNumber: {
    color: Colors.grey,
    fontSize: 18,
    fontFamily: FontType.alQalamQuran,
  },
  descTextRight: {
    textAlign: 'right',
    paddingTop: 10,
    paddingRight: 10,
    fontSize: 32,
    fontFamily: FontType.alQalamQuran,
    lineHeight: 50,
    letterSpacing:5,
  },
  translationtext:{
    textAlign: 'right',
    paddingTop: 10,
    paddingRight: 10,
    fontSize: 20,
    fontFamily: FontType.jameelNoriNastaleeq,
    lineHeight: 20,
    letterSpacing:5,
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
