import React from 'react';
import { Text, View } from 'react-native';
import { Styles } from './HeaderSurahDetail.style';


const HeaderSurahDetail = props => {
  const {
    suratName,
    suratArabic,
    suratTranslate,
    countAyat,
    rightIcon1,
  } = props

  console.log(rightIcon1);
  return (
    <View style={Styles.headerContainer}>
      <View>
        <Text style={Styles.headerTitle}>
          {suratName} ({suratArabic})
        </Text>
        <Text style={Styles.headerSubtitle}>
          {suratTranslate} - {countAyat} Ayat
        </Text>
      </View>
      <View>
        {rightIcon1}
      </View>
    </View>
  );
};

export { HeaderSurahDetail };
