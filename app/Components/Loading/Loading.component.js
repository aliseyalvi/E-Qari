import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { ActivityIndicator, Colors } from 'react-native-paper';
import { Styles } from './Loading.styles';
import AnimatedLoader from 'react-native-animated-loader';
const loaderFile = require('../../Assets/271-loader.json');

const Loading = () => {
  return (
    <AnimatedLoader
      visible={true}
      overlayColor="rgba(255,255,255,0.75)"
      source={loaderFile}
      animationStyle={styles.lottie}
      speed={1}>
      {/* <Text>
        Fetching...
      </Text> */}
    </AnimatedLoader>
  );
};

const styles = StyleSheet.create({
  lottie: {
    width: 100,
    height: 100
  }
})

export { Loading };
