import React from 'react';
import { View, Text } from 'react-native';
import HTML from 'react-native-render-html';
import { TouchableRipple } from 'react-native-paper';

import { Styles } from './CardAyatList.style';
import { Colors } from '../../Themes/Colors';
import Reactotron from 'reactotron-react-native'
const CardAyatList = props => {
  const { ayatNumber, ayatText, translationText, onPress,ayahData } = props;
  Reactotron.log('ayahData',ayahData)
  return (
    <TouchableRipple
      rippleColor={Colors.rippleColor}
      centered
      onPress={()=>onPress(ayahData)}>
      <View style={Styles.CardStyle}>
        <View style={Styles.cardContainer}>
          <View style={Styles.numberCircleContainer}>
            <View style={Styles.NumberCircle}>
              <Text style={Styles.textNumber}>{ayatNumber}</Text>
            </View>
          </View>
          <View style={Styles.descContainer}>
            <Text style={Styles.descTextRight}>{ayatText}</Text>
            <Text style={Styles.translationText}>{translationText}</Text>
          </View>
        </View>
      </View>
    </TouchableRipple>
  );
};

export { CardAyatList };
