import React, { useEffect, useState, useContext, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Platform,
  PermissionsAndroid,
  ActivityIndicator,
  Button,
  Switch,
  Image,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { Modalize } from 'react-native-modalize';
import { Colors } from '../../Themes/Colors';
import { FontType } from '../../Themes/Fonts';
import Icon from 'react-native-vector-icons/Ionicons';
//import SurahDataContext from QuranDetail.component
import SurahDataContext from './SurahDataContext';
// import Sound Component
import Sound from 'react-native-sound';
//import sound recorder component
import SoundRecorder from 'react-native-sound-recorder';

import { StringUtils } from 'turbocommons-ts';
const Diff = require('diff');

// import w3cwebsocket
import { w3cwebsocket as W3CWebSocket } from 'websocket';

// import file system for react native
var RNFS = require('react-native-fs');
// import atob for conversion of base64 data
var atob = require('atob');
var Buffer = require('buffer/').Buffer; //
var base64js = require('base64-js');

const HEIGHT = Dimensions.get('window').height;
//sound instant variable
var sound1;

const WEB_SERVER_ADDRESS = 'ws://104.248.153.153:8080/client/ws/speech';

const AyahPlayer = props => {
  const { forwardRef, ayahData } = props;
  // const client = useRef(new W3CWebSocket('ws://efd958205c5f.ngrok.io/client/ws/speech'))
  const client = useRef(null);
  const { ayahs, selectedAyahData } = useContext(SurahDataContext);
  //destructure surahdata context
  //const surahData =  useContext(SurahDataContext)
  //Reactotron.log('surah data in player modal',surahData )
  const [selectedAyah, setSelectedAyah] = useState(null);
  const [recordedFilePath, setRecordedFile] = useState('');
  const [isPlayClicked, setIsPlayClicked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const [permissionStatus, setPermissionStatus] = useState(false);
  const [socketOPened, setSocketOPened] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);

  const [socketResponse, setSocketResponse] = useState([]);
  const [responseRecieved, setResponseRecieved] = useState(false);
  const [fetchingResponse, setFetchingResponse] = useState(false);
  // const [percentAccuracy, setPercentAccuracy] = useState('')
  const percentAccuracy = useRef(0);
  //set selected ayah stat based on context
  useEffect(() => {
    // set selected ayah when selectedAyah is changed by forward or next or mounting time
    setSelectedAyah(selectedAyahData);
    percentAccuracy.current = 0;
    _requestRecordAudioPermission();
  }, [selectedAyahData]);

  const getDifference = fetchedText => {
    const originalText = selectedAyah ? selectedAyah.text : '';
    const diff = Diff.diffWords(originalText, fetchedText);
    console.log('diff: ', diff);
    const diffText = diff.filter(
      obj => obj.removed || !obj.added || (!obj.added && !obj.removed),
    );
    console.log('diffText : ', diffText);
    return diffText;
  };

  const _renderDiffText = fetchedText => {
    const diffText = getDifference(fetchedText);
    console.log('_renderDiffText :', diffText);
    // calculate percentage accuracy and set in state
    percentAccuracy.current = getPercentAccuracy(fetchedText);
    console.log('percentAccuracy.current : ', percentAccuracy.current);
    // setPercentAccuracy(getPercentAccuracy(fetchedText))
    if (diffText && diffText.length != 0) {
      return diffText.map((item, index) => (
        <Text key={index} style={{ color: item.removed ? 'red' : 'green' }}>
          {item.value}
        </Text>
      ));
    } else {
      return null;
    }
  };

  // get accuracy of fetchedResponse in percentage
  const getPercentAccuracy = fetchedText => {
    // console.log('original Text : ', selectedAyah.text);
    const originalText = selectedAyah ? selectedAyah.text : '';

    let percentAccuracy = StringUtils.compareSimilarityPercent(
      fetchedText,
      originalText,
    );
    return Math.round(percentAccuracy);
  };
  // convert base64 data to raw binary
  const convertBase64ToBinary = base64 => {
    var raw = atob(base64);
    var rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));

    for (let i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    return array;
  };

  // send EOF character to terminate websocket connection
  const sendEOF = () => {
    let eos = 'EOS';
    let eosLength = eos.length;
    let eosArray = new Uint8Array(new ArrayBuffer(3));
    for (let i = 0; i < eosLength; i++) {
      // console.log(eos.charCodeAt(i));
      eosArray[i] = eos.charCodeAt(i);
      // console.log(array[rawLength + i]);
    }
    console.log('eosArray : ', eosArray);
    console.log('sending EOS');
    client.current.send(eosArray);
  };

  // generate delay for required time
  const delay = ms => new Promise(res => setTimeout(res, ms));

  // connect client with webserver
  const connectServer = () => {
    client.current = new W3CWebSocket(WEB_SERVER_ADDRESS);
  };

  // send data to webserver by reading recorded file
  const sendDataToServer = async path => {
    // get details of recorded file using file system
    await RNFS.stat(path).then(data => {
      console.log('data : ', data);
    });

    // read recorded file using file system
    await RNFS.readFile(path, 'base64').then(async data => {
      //   if connection is opened send data to server
      if (client.current.readyState === client.current.OPEN) {
        console.log(
          'client is connected, sending data to server',
          client.current.readyState,
        );

        // convert base64 data to raw binary
        console.log('converted data : ', base64js.toByteArray(data));
        await client.current.send(base64js.toByteArray(data));

        setSocketConnected(true);
        setFetchingResponse(true);
        setSocketResponse([]);
      } else {
        console.log('client is not connected, try again!');
        setFetchingResponse(false);
      }
    });
  };

  useEffect(() => {
    // console.log('client : ', client);
    // if connection object exists
    if (client.current) {
      // listen for incoming messages from websocket server
      client.current.onmessage = ({ data }) => {
        let parsedData = JSON.parse(data);
        console.log('parsedData:', parsedData);

        // if data recieved is valid and has result parameter, load it into state else set response state to empty
        if (parsedData && parsedData.hasOwnProperty('result')) {
          setResponseRecieved(true);
          setSocketResponse(prevState => [...prevState, parsedData]);
          setFetchingResponse(false);
        } else {
          setResponseRecieved(false);
          setSocketResponse([]);
          setFetchingResponse(false);
        }
      };
      //   listen for error event from websocket
      client.current.onerror = () => {
        console.log('WebSocket Client Error');
        setSocketConnected(false);
        setFetchingResponse(false);
      };

      //   listen for close event from websocket
      client.current.onclose = () => {
        console.log('WebSocket Client Closed');
        setSocketConnected(false);
        setFetchingResponse(false);
      };

      //   listen for open event from websocket
      client.current.onopen = () => {
        console.log('WebSocket Client Connected');
        setSocketConnected(true);
        setFetchingResponse(false);
      };
    }
    /* 
        const intervalId = setInterval(() => {
            console.log('inside interval status : ', client.current ? client.current.readyState: 'no-state' );
            // if(client.current?.readyState === client.current?.OPEN){
            //     setSocketConnected(true)
            // }
            // if(client.current?.readyState === client.current?.CLOSING){
            //     setSocketConnected(false)
            // }
            // if(client.current?.readyState === client.current?.CLOSED){
            //     setSocketConnected(false)
            // }
            
            if(client.current){

                client.current.onmessage = ({data}) => {
                    // const dataFromServer = JSON.parse(data)
                    // console.log( 'data recieved : ', dataFromServer)
                    console.log('parsedData recieved : ',JSON.parse(data));
                    let parsedData = JSON.parse(data)
                    // console.log('parsedData:',parsedData);
                    console.log( " parsedData.hasOwnProperty('result') :", parsedData.hasOwnProperty('result'));
                    console.log(" parsedData.result.hypotheses :", parsedData.hasOwnProperty('result') ? parsedData.result.hypotheses : 'no-hypotheses');
                    if(parsedData && parsedData.hasOwnProperty('result')  ){
                        setSocketResponse((prevState) => [...prevState, parsedData])
                    }else{
                        setSocketResponse([])
                    }
                    
                }
                client.current.onerror = () => {
                    console.log('WebSocket Client Error');
                    setSocketConnected(false)
                };
            
                client.current.onclose = () => {
                    console.log('WebSocket Client Closed');
                    setSocketConnected(false)
                };
            
                client.current.onopen = () => {
                    console.log('WebSocket Client Connected');
                    setSocketConnected(true)
                };
            }
          }, 1000 * 5) // in milliseconds
          return () => clearInterval(intervalId)
         */
  });

  //handle play next button
  const handleNext = () => {
    const currAyah = selectedAyah ? selectedAyah.number : 1;
    const nextAyah = ayahs.find(o => o.number == currAyah + 1);
    if (nextAyah) {
      setSelectedAyah(nextAyah);
      // set socketResponse to empty when ayah is changed,
      setSocketResponse([]);
      percentAccuracy.current = 0;
    }
  };
  //handle play prev button
  const handlePrev = () => {
    const currAyah = selectedAyah ? selectedAyah.number : 1;
    const prevAyah = ayahs.find(o => o.number == currAyah - 1);
    if (prevAyah) {
      setSelectedAyah(prevAyah);
      // set socketResponse to empty when ayah is changed,
      setSocketResponse([]);
      percentAccuracy.current = 0;
    }
  };

  //load the player and play ayah
  const playAyah = () => {
    setIsPlayClicked(true);
    sound1 = new Sound(
      selectedAyah ? selectedAyah.audio : '',
      Sound.MAIN_BUNDLE,
      (error, sound) => {
        setIsPlayClicked(false);
        console.log('started playing');
        if (error) {
          alert('error' + error.message);
          return;
        }

        setIsPlaying(true);
        console.log(
          'duration in seconds: ' +
            sound1.getDuration() +
            'number of channels: ' +
            sound1.getNumberOfChannels(),
        );
        sound1.play(success => {
          if (success) {
            console.log('successfully finished playing');
          } else {
            console.log('playback failed due to audio decoding errors');
          }
          setIsPlaying(false);
          sound1.release();
        });
      },
    );
  };

  // stop the player
  const stopAyah = () => {
    //console.log(sound1);
    if (sound1) {
      sound1.stop(() => {
        setIsPlaying(false);
        console.log('Stop');
      });
    } else {
      console.log('no player running');
    }
  };

  //load sound recorder and record sound
  const recordAyah = () => {
    // create websocket with server
    console.log('recording started');

    connectServer();
    // start recording
    SoundRecorder.start(SoundRecorder.PATH_CACHE + '/test.wav').then(
      function() {
        setIsRecording(true);
        console.log('started recording');
      },
    );
  };

  //stop sound recorder
  const stopRecordAyah = async () => {
    SoundRecorder.stop().then(async result => {
      setIsRecording(false);
      setRecordedFile(result.path);
      console.log('stopped recording, audio file saved at: ' + result.path);
      // send data to server through websocket
      await sendDataToServer(result.path);
      // send EOF to terminate websocket
      sendEOF();
    });
  };

  //cancel record
  const cancelRecord = () => {
    SoundRecorder.stop().then(function(result) {
      setIsRecording(false);
      //   if recording cancelled, send eof to server to terminate connection
      sendEOF();
      console.log('Recording is cancelled');
    });
  };

  //get audio record permission
  const _requestRecordAudioPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Microphone Permission',
          message: 'EQari needs access to your microphone to record your voice',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setPermissionStatus(true);
      } else {
        setPermissionStatus(false);
      }
    } catch (err) {
      console.error(err);
      setPermissionStatus(false);
    }
  };

  //modal header component
  const arabicAyahSymbol = '\u06DD';
  const _renderModalHeader = () => {
    return (
      <View style={styles.forwardBackContainer}>
        <TouchableOpacity onPress={handlePrev}>
          <Icon name={'chevron-back'} size={26} color="#93A8B3" />
        </TouchableOpacity>

        <View style={styles.NumberCircle}>
          <Text style={styles.textNumber}>{arabicAyahSymbol}</Text>
          <Text style={styles.ayahNumber}>
            {selectedAyah ? selectedAyah.numberInSurah : ''}
          </Text>
        </View>

        <TouchableOpacity onPress={handleNext}>
          <Icon name="chevron-forward" size={26} color="#93A8B3" />
        </TouchableOpacity>
      </View>
    );
  };

  //modal footer component
  const _renderModalFooter = () => {
    return (
      <View style={styles.modalFooterContainer}>
        <View style={styles.resultContainer}>
          {/* {
            percentAccuracy.current ? 
            <View style={styles.accuracyContainer}>
            <Text style={percentAccuracy.current > 90 ? styles.accuracyTextGreen : styles.accuracyTextRed}>
              Accuracy : {percentAccuracy.current} %
            </Text>
            {
               percentAccuracy.current > 90 ? 
               <Icon style={{marginLeft:8}} name={ "checkmark-circle-outline" } size={20} color="green" />
               :
               <Icon style={{marginLeft:8}} name={"close-circle-outline"} size={20} color="red" />
            }
            
            
            </View>
            :
            <Text>
              {socketConnected
                ? fetchingResponse
                  ? 'Listening...'
                  : 'Listening...'
                : 'Tap on Mic to Recite'}
            </Text>
            
          } */}
          {socketConnected ? (
            <Text>Listening...</Text>
          ) : percentAccuracy.current ? (
            <View style={styles.accuracyContainer}>
              <Text
                style={
                  percentAccuracy.current > 90
                    ? styles.accuracyTextGreen
                    : styles.accuracyTextRed
                }>
                Accuracy : {percentAccuracy.current} %
              </Text>
              {percentAccuracy.current > 90 ? (
                <Icon
                  style={{ marginLeft: 8 }}
                  name={'checkmark-circle-outline'}
                  size={20}
                  color="green"
                />
              ) : (
                <Icon
                  style={{ marginLeft: 8 }}
                  name={'close-circle-outline'}
                  size={20}
                  color="red"
                />
              )}
            </View>
          ) : (
            <Text>Tap on Mic to Recite</Text>
          )}
        </View>

        <View style={styles.playRecordContainer}>
          {isRecording ? (
            <View style={styles.stopCancelContainer}>
              <TouchableOpacity
                style={styles.cancelIcon}
                onPress={() => cancelRecord()}>
                <Icon
                  name={'close'}
                  size={20}
                  color="#FFF"
                  //style={styles.cancelIcon}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  ...styles.micButtonContainer,
                  backgroundColor: 'rgba(219 ,68 ,55,1)',
                }}
                onPress={() => stopRecordAyah()}
                disabled={isPlaying}>
                <Icon
                  name={'stop'}
                  size={26}
                  color="#FFF"
                  style={styles.micIcon}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.micButtonContainer}
              onPress={() => recordAyah()}
              disabled={isPlaying}>
              <Icon
                name={'mic'}
                size={30}
                color="#FFF"
                style={styles.micIcon}
              />
            </TouchableOpacity>
          )}
          {isPlaying ? (
            <TouchableOpacity
              style={styles.playButtonContainer}
              onPress={() => stopAyah()}
              disabled={isRecording}>
              <Icon
                name={'pause'}
                size={26}
                color="#3D425C"
                //style={styles.playIcon}
              />
            </TouchableOpacity>
          ) : isPlayClicked ? (
            <View style={styles.playButtonContainer}>
              <ActivityIndicator />
            </View>
          ) : (
            <TouchableOpacity
              style={styles.playButtonContainer}
              onPress={() => playAyah()}
              disabled={isRecording}>
              <Icon
                name={'play'}
                size={26}
                color="#3D425C"
                style={styles.playIcon}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  console.log('socketConnected : ', socketConnected);
  console.log('fetchingResponse :', fetchingResponse);
  console.log(
    'socketResponse',
    socketResponse.length != 0
      ? socketResponse[0].result
        ? socketResponse[0].result.hypotheses[0].transcript
        : 'no response!'
      : 'response empty!',
  );
  //return modalize component
  return (
    <Modalize
      ref={forwardRef}
      modalHeight={HEIGHT / 1.2}
      modalStyle={{ padding: 12 }}
      HeaderComponent={_renderModalHeader}
      FooterComponent={_renderModalFooter}
      onClose={() => {
        stopAyah();
        setSocketResponse([]);
      }}
      childrenStyle={styles.mainContainer}>
      <View style={styles.coverContainer}>
        {/* <Text style={styles.descTextRight}>
          {selectedAyah ? selectedAyah.text : ''}
        </Text> */}
        {socketResponse.length !== 0 && responseRecieved ? (
          <View style={styles.responseContainer}>
            {socketResponse[socketResponse.length - 1].result ? (
              <>
                <Text style={styles.descTextRight}>
                  {/* {
                      // print the last fetched response from response array
                      socketResponse[socketResponse.length - 1].result
                        .hypotheses[0].transcript
                    } */}
                  {_renderDiffText(
                    socketResponse[socketResponse.length - 1].result
                      .hypotheses[0].transcript,
                  )}
                </Text>
                <Text>
                  {/* pass the last fetched response from response array into getPercentAccuracy() function */}
                </Text>
              </>
            ) : null}
          </View>
        ) : (
          <Text style={styles.descTextRight}>
            {selectedAyah ? selectedAyah.text : ''}
          </Text>
        )}
      </View>
    </Modalize>
  );
};

export { AyahPlayer };

const styles = StyleSheet.create({
  borderRed: {
    borderWidth: 1,
    borderColor: 'red',
  },
  mainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,

    backgroundColor: '#EAEAEC',
    borderWidth: 1,
    borderColor: 'red',
  },
  textLight: {
    color: '#B6B7BF',
  },
  text: {
    color: '#8E97A6',
  },
  textDark: {
    color: '#3D425C',
  },
  forwardBackContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: 8,
  },
  coverContainer: {
    flex: 1,
    marginTop: 32,
    shadowColor: '#5D3F6A',
    shadowOffset: { height: 15 },
    shadowRadius: 8,
    shadowOpacity: 0.3,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  cover: {
    width: 250,
    height: 250,
    borderRadius: 125,
  },
  track: {
    height: 2,
    borderRadius: 1,
    backgroundColor: '#FFF',
  },
  thumb: {
    width: 8,
    height: 8,
    backgroundColor: '#3D425C',
  },
  timeStamp: {
    fontSize: 11,
    fontWeight: '500',
  },
  modalFooterContainer: {
    height: 170,
  },
  resultContainer: {
    height: 70,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  responseContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  responseText: {
    // fontFamily: FontType.aaQamri,
    fontFamily: FontType.pdms,
    color: 'rgba(18, 140, 126,1)',
    fontSize: 22,
    letterSpacing: 10,
  },
  playRecordContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
  },
  micButtonContainer: {
    //backgroundColor: "#FFF",
    //borderColor: "rgba(93, 63, 106, 0.2)",
    backgroundColor: 'rgba(18, 140, 126,1)',
    //borderWidth: 16,
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 4,
  },
  playButtonContainer: {
    backgroundColor: '#FFF',
    //borderColor: "rgba(93, 63, 106, 0.2)",
    //borderWidth: 12,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 4,
  },
  playIcon: {
    // marginLeft: 8,
  },
  cancelIcon: {
    position: 'absolute',
    top: -50,
    backgroundColor: 'rgba(219 ,68 ,55,1)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stopCancelContainer: {
    position: 'relative',
    alignItems: 'center',
  },

  descTextRight: {
    textAlign: 'right',
    paddingTop: 10,
    paddingRight: 10,
    fontSize: 36,
    // fontFamily: FontType.aaQamri,
    fontFamily: FontType.pdms,
    lineHeight: 70,
    letterSpacing: 15,
    color: 'rgba(18, 140, 126,1)',
  },

  NumberCircle: {
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 20,
  },
  ayahNumber: {
    position: 'absolute',
    fontFamily: FontType.jameelNoriReg,
    fontSize: 16,
  },
  textNumber: {
    color: Colors.grey,
    fontSize: 22,
    fontFamily: FontType.semiBold,
  },
  accuracyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accuracyTextGreen: {
    color: 'green',
    fontSize: 16,
  },
  accuracyTextRed: {
    color: 'red',
    fontSize: 16,
  },
});
