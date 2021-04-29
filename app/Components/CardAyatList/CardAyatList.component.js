import React from 'react';
import { View, Text } from 'react-native';
import HTML from 'react-native-render-html';
import { TouchableRipple } from 'react-native-paper';

import { Styles } from './CardAyatList.style';
import { Colors } from '../../Themes/Colors';
import Reactotron from 'reactotron-react-native';
const CardAyatList = props => {
  const { ayatNumber, ayatText, ayahTranslation, onPress, ayahData } = props;
  Reactotron.log('ayahData', ayahData);
  return (
    <TouchableRipple
      rippleColor={Colors.rippleColor}
      centered
      onPress={() => onPress(ayahData)}
      style={Styles.rippleContainer}
      >
      <View style={Styles.CardStyle}>
        <View style={Styles.cardContainer}>

          <View style={Styles.ayahContainer}>
            <View style={Styles.numberCircleContainer}>
              <Text style={Styles.textNumber}>﴾ {ayatNumber} ﴿</Text>
            </View>

            <Text style={Styles.descTextRight}>{ayatText}</Text>
            <Text style={Styles.translationtext}>{ayahTranslation}</Text>
            {/** 
            <HTML
              html={ayatTranslate}
              containerStyle={Styles.descTextLeftContainer}
              baseFontStyle={Styles.descTextLeft}
            />
            */}
          </View>
        </View>
      </View>
    </TouchableRipple>
  );
};

export { CardAyatList };
