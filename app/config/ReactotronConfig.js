/* import Reactotron from 'reactotron-react-native'

Reactotron
  //.setAsyncStorageHandler(AsyncStorage) // AsyncStorage would either come from `react-native` or `@react-native-community/async-storage` depending on where you get it from
  .configure() // controls connection & communication settings
  .useReactNative() // add all built-in react native plugins
  .connect() // let's connect! */

import { NativeModules } from 'react-native';
import Reactotron from 'reactotron-react-native';
import { reactotronRedux } from 'reactotron-redux';
import url from 'url';
let reactotron;
 // Check if it's development mode
  const { hostname } =
    url.parse(NativeModules.SourceCode.scriptURL);
    console.log(hostname);
  // Geting device hostname
  reactotron = Reactotron.configure({
    name: 'name',
    host: hostname,
    port: 9090,
  }) // Initial configuration 
    .useReactNative({}) // Appling React-Native plugin
    .use(reactotronRedux()) // Appling Redux plugin
    .connect(); // Connect to local client
  console.tron = Reactotron.log;
  // Extend console with tron for being able to debug to Reactotron

  


export { reactotron };
  // export reactotron for later usage