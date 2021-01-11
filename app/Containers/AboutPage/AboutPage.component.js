import React from 'react';
import { View, Text, Image } from 'react-native';
import I18n from 'i18next';

import { Styles } from './AboutPage.style';

const AboutPage = () => {
  return (
    <View style={Styles.container}>
      <Image
        source={require('../../Assets/Images/eqari-image.png')}
        style={Styles.appImage}
        resizeMode="stretch"
      />
      <Text style={Styles.appName}>E-Qari</Text>
      <Text style={Styles.appVersion}>Version 1.0</Text>
      <Text style={Styles.appAuthor}>Sadaqat Ali</Text>
    </View>
  );
};

export default AboutPage;

AboutPage.navigationOptions = () => ({
  title: I18n.t('AboutTitle'),
});
