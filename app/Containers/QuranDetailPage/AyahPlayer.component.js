import React, { useEffect, useState, useContext,useRef } from 'react';
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
    SafeAreaView
} from 'react-native';
import { Modalize } from 'react-native-modalize';
import { Colors } from '../../Themes/Colors';
import { FontType } from '../../Themes/Fonts';
import Icon from 'react-native-vector-icons/FontAwesome';
//import SurahDataContext from QuranDetail.component
import SurahDataContext from './SurahDataContext'
// import Sound Component
import Sound from 'react-native-sound';
//import sound recorder component
import SoundRecorder from 'react-native-sound-recorder';
//import reactotron
import Reactotron from 'reactotron-react-native'

import { w3cwebsocket as W3CWebSocket } from "websocket";
// var client = new W3CWebSocket('ws://efd958205c5f.ngrok.io/client/ws/speech');
// const client = new W3CWebSocket('wss://echo.websocket.org/');

import ReconnectingWebSocket from 'reconnecting-websocket';
const options = {
    connectionTimeout: 1000,
    maxRetries: 10,
};
const rws = new ReconnectingWebSocket('ws://efd958205c5f.ngrok.io/client/ws/speech', [], options);
var RNFS = require('react-native-fs');
var atob = require('atob')


const HEIGHT = Dimensions.get('window').height
//sound instant variable
var sound1



const AyahPlayer = (props) => {
    const {
        forwardRef,
        ayahData
    } = props
    // const client = useRef(new W3CWebSocket('ws://efd958205c5f.ngrok.io/client/ws/speech'))
    const client = useRef(null)
    const { ayahs, selectedAyahData } = useContext(SurahDataContext)
    //destructure surahdata context
    //const surahData =  useContext(SurahDataContext)
    //Reactotron.log('surah data in player modal',surahData )
    const [selectedAyah, setSelectedAyah] = useState(null)
    Reactotron.log('selected ayah in player modal', selectedAyahData)
    const [recordedFilePath, setRecordedFile] = useState('')
    const [isPlayClicked, setIsPlayClicked] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isRecording, setIsRecording] = useState(false)

    const [permissionStatus, setPermissionStatus] = useState(false)
    const [socketOPened, setSocketOPened] = useState(false)
    const [socketConnected, setSocketConnected] = useState(false)

    const [socketResponse, setSocketResponse] = useState([])
    const [responseRecieved, setResponseRecieved] = useState(false)
    const [fetchingResponse, setFetchingResponse] = useState(false)
    //set selected ayah stat based on context
    useEffect(() => {
        setSelectedAyah(selectedAyahData)
        _requestRecordAudioPermission()
    }, [selectedAyahData])

  
    const convertBase64ToBinary = (base64) => {

        var raw = atob(base64);
        var rawLength = raw.length;
        var array = new Uint8Array(new ArrayBuffer(rawLength));
      
        for(let i = 0; i < rawLength; i++) {
          array[i] = raw.charCodeAt(i);
        }
        return array;
    }
    
    const sendEOF = () => {
        let eos = "EOS"
        let eosLength = eos.length
        let eosArray = new Uint8Array(3);
        for(let i = 0  ; i < eosLength; i++) {
          // console.log(eos.charCodeAt(i));
          eosArray[i] = eos.charCodeAt(i);
          // console.log(array[rawLength + i]);
        }
        // console.log('eosArray : ', eosArray);
        console.log('sending EOS');
        client.current.send(eosArray);
    }

    const delay = ms => new Promise(res => setTimeout(res, ms));

    const connectServer = () => {
        client.current = new W3CWebSocket('ws://104.248.153.153:8080/client/ws/speech')
    }
    const sendDataToServer = async (path) => {
        // if(socketConnected){
        //     RNFS.stat("/storage/emulated/0/Download/2.wav")
        //     .then((data) => {

        //         // console.log('path : ', path);
        //         console.log('data : ', data);
        //         // socket.send(data);
        //         // setSocketOPened((prevState)=> !prevState)

        //     })
            
        // }
        // if(!socketConnected){
        //     console.log('client is not connected, connecting client');
        //     client.current = new W3CWebSocket('ws://104.248.153.153:8080/client/ws/speech')
        //     // client = new W3CWebSocket('ws://efd958205c5f.ngrok.io/client/ws/speech');
        //     // console.log('client connection status : ', client.current.readyState );
        //     await delay(5000);
        //     console.log("Waited 5s");
        //     // client.current.onerror = () => {
        //     //     console.log(' Error');
        //     //     setSocketConnected(false)
        //     // };
        
        //     // client.current.onclose = () => {
        //     //     console.log(' Closed');
        //     //     setSocketConnected(false)
        //     // };
        //     // client.current.onopen = async () => {
        //     //     console.log(' Connected');
            
                
                
        //     // };
            
        // }
        // RNFS.stat('/storage/emulated/0/Download/2.wav')
        await RNFS.stat(path)
        .then((data) => {

                // console.log('path : ', path);
                console.log('data : ', data);
                // socket.send(data);
                // setSocketOPened((prevState)=> !prevState)

        })

        await RNFS.readFile(path,'base64')
        .then(async (data) => {
            const convertedData = convertBase64ToBinary(data)
            console.log('converted data : ', convertedData);
            // console.log('client connection status : ', client.current.readyState );
            
                if(client.current.readyState === client.current.OPEN){
                    console.log('client is connected, sending data to server',client.current.readyState);
                    await client.current.send(convertedData)
                    // sendEOF()
                    setFetchingResponse(true)
                    setSocketResponse([])
                    setSocketConnected(true)
                }
                else{
                    console.log('client is not connected, try again!');
                    setFetchingResponse(false)
                }
                
                
                // client.current.onmessage = ({data}) => {
                //     // const dataFromServer = JSON.parse(data)
                //     // console.log( 'data recieved : ', dataFromServer)
                //     console.log('data recieved : ',JSON.parse(data));
                //     setSocketResponse((prevState) => [...prevState, JSON.parse(data)])
                // }
            
           
            
        })

        // RNFS.readFile('/storage/emulated/0/Download/2.wav','base64')
        // RNFS.readFile(path,'base64')
        // .then((data) => {
        //     const convertedData = convertBase64ToBinary(data)
        //     console.log('converted data : ', convertedData);
        //     // console.log('client connection status : ', client.current.readyState );
            
        //         if(client.current.readyState === client.current.OPEN){
        //             console.log('client is connected, sending data to server',client.current.readyState);
        //             client.current.send(convertedData)
        //             sendEOF()
        //             setSocketResponse([])
        //         }
        //         else{
        //             console.log('client is not connected, try again!');
        //         }
                
                
        //         // client.current.onmessage = ({data}) => {
        //         //     // const dataFromServer = JSON.parse(data)
        //         //     // console.log( 'data recieved : ', dataFromServer)
        //         //     console.log('data recieved : ',JSON.parse(data));
        //         //     setSocketResponse((prevState) => [...prevState, JSON.parse(data)])
        //         // }
            
           
            
        // })

      

        // client.send(JSON.stringify({
        //     type: 'message',
        //     msg: path
        // }))
    }

    /* client.current.onerror = () => {
        console.log('Connection Error');
        setSocketConnected(false)
    };

    client.current.onclose = () => {
        console.log('Client Connection Closed');
        setSocketConnected(false)
    };

    client.current.onopen = () => {
        console.log('WebSocket Client Connected');
        setSocketConnected(true)
    };
    client.current.onmessage = ({data}) => {
        // const dataFromServer = JSON.parse(data)
        // console.log( 'data recieved : ', dataFromServer)
        console.log('data recieved : ',JSON.parse(data));
        setSocketResponse((prevState) => [...prevState, JSON.parse(data)])
    } */
    useEffect(()=> {
        // console.log('client socket status: ', client.current.readyState);
        console.log('client : ', client);
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
                    setFetchingResponse(false)
                    setResponseRecieved(true)
                    setSocketResponse((prevState) => [...prevState, parsedData])
                    
                }else{
                    setFetchingResponse(false)
                    setResponseRecieved(false)
                    setSocketResponse([])
                }
                
            }
            client.current.onerror = () => {
                console.log('WebSocket Client Error');
                setFetchingResponse(false)
                setSocketConnected(false)
            };
        
            client.current.onclose = () => {
                console.log('WebSocket Client Closed');
                setFetchingResponse(false)
                setSocketConnected(false)
            };
        
            client.current.onopen = () => {
                console.log('WebSocket Client Connected');
                setFetchingResponse(false)
                setSocketConnected(true)
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
    })


/* 
    useEffect(()=>{
        
        socket.onopen = function() {
            console.log('WebSocket Client Connected');
            setSocketConnected(true)
            
              
        };

        if(socketConnected){
            RNFS.readFile("/storage/emulated/0/Download/2.wav", 'base64')
            .then((data) => {
                console.log('data : ', data);
                socket.send(data);
                // setSocketOPened((prevState)=> !prevState)
            })
            
        }

        
 
        
    },[])
*/
    
/* 
    useEffect(()=> {
        

        client.onerror = function() {
            console.log('Connection Error');
            RNFS.readFile('./2.wav', 'base64')
            .then((data) => {
                client.send(data);
            })


        };

        client.onopen = function() {
            console.log('WebSocket Client Connected');
            RNFS.readFile('./2.wav', 'base64')
            .then((data) => {
                client.send(data);
            })
            // let data = '1'
            // client.send(data);
            // if(recordedFilePath){
            //     RNFS.readFile(recordedFilePath, 'base64')
            //     .then((data) => {
            //         client.send(data);
            //     })
            // }
            
        };

        client.onmessage = function(e) {
            if (typeof e.data === 'string') {
                console.log("Received: '" + e.data + "'");
            }
        };
        

    })
 */

    const sendDataToWebsocket = () => {

        client.onerror = function() {
            console.log('Connection Error');
        };
        client.onopen = function() {
            console.log('WebSocket Client Connected');
        
            function sendNumber() {
                if (client.readyState === client.OPEN) {
                    var number = Math.round(Math.random() * 0xFFFFFF);
                    client.send(number.toString());
                    setTimeout(sendNumber, 1000);
                }
            }
            sendNumber();
        };

        client.onmessage = function(e) {
            if (typeof e.data === 'string') {
                console.log("Received: '" + e.data + "'");
            }
        };

    }

    //handle play next button
    const handleNext = () => {
        const currAyah = selectedAyah ? selectedAyah.number : 1
        const nextAyah = ayahs.find(o => o.number == currAyah + 1)
        Reactotron.log('next ayah is :', nextAyah)
        if (nextAyah) {
            setSelectedAyah(nextAyah)
        }
    }
    //handle play prev button
    const handlePrev = () => {
        const currAyah = selectedAyah ? selectedAyah.number : 1
        const prevAyah = ayahs.find(o => o.number == currAyah - 1)
        Reactotron.log('prev ayah is :', prevAyah)
        if (prevAyah) {
            setSelectedAyah(prevAyah)
        }
    }


    //load the player and play ayah
    const playAyah = () => {
        setIsPlayClicked(true)
        sound1 = new Sound(selectedAyah ? selectedAyah.audio : '', Sound.MAIN_BUNDLE,
            (error, sound) => {
                setIsPlayClicked(false)
                console.log('started playing');
                if (error) {
                    alert('error' + error.message);
                    return;
                }

                setIsPlaying(true)
                console.log('duration in seconds: ' + sound1.getDuration() + 'number of channels: ' + sound1.getNumberOfChannels());
                sound1.play((success) => {
                    if (success) {
                        console.log('successfully finished playing');
                    } else {
                        console.log('playback failed due to audio decoding errors');
                    }
                    setIsPlaying(false)
                    sound1.release();
                });
            });
    }

    // stop the player
    const stopAyah = () => {
        //console.log(sound1);
        if (sound1) {
            sound1.stop(() => {
                setIsPlaying(false)
                console.log('Stop');
            });
        } else {
            console.log('no player running');
        }

    }

    //load sound recorder and record sound
    const recordAyah = () => {

        // create websocket with server
        connectServer();
        // start recording
        SoundRecorder.start(SoundRecorder.PATH_CACHE + '/test.wav')
            .then(function () {
                setIsRecording(true)
                console.log('started recording');
            });

    }


    //stop sound recorder
    const stopRecordAyah = async () => {
        
        SoundRecorder.stop()
            .then(async (result) => {
                setIsRecording(false)
                setRecordedFile(result.path)
                console.log('stopped recording, audio file saved at: ' + result.path);
                // send data to server through websocket
                await sendDataToServer(result.path)
                // send EOF to terminate websocket
                sendEOF()
                
            });
    }

    //cancel record 
    const cancelRecord = () => {
        SoundRecorder.stop()
            .then(function (result) {
                setIsRecording(false)
                //setRecordFile(result.path)
                console.log('Recording is cancelled');
            });
    }


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
                setPermissionStatus(true)
            } else {
                setPermissionStatus(false)
            }
        } catch (err) {
            console.error(err);
            setPermissionStatus(false)
        }
    }

    //modal header component
    const _renderModalHeader = () => {
        return (
            <View style={styles.forwardBackContainer}>
                <TouchableOpacity
                    onPress={handlePrev}
                >
                    <Icon name={"backward"} size={26} color="#93A8B3" />
                </TouchableOpacity>

                <View style={styles.NumberCircle}>
                    <Text style={styles.textNumber}>{selectedAyah ? selectedAyah.numberInSurah : ''}</Text>
                </View>

                <TouchableOpacity
                    onPress={handleNext}
                >
                    <Icon name="forward" size={26} color="#93A8B3" />
                </TouchableOpacity>
            </View>
        )
    }

    //modal footer component
    const _renderModalFooter = () => {
        return (
            <View style={styles.modalFooterContainer}>
                <View style={styles.resultContainer}>
                    {
                        socketResponse.length !== 0 && responseRecieved ? 
                        <Text style={styles.responseText}>
                                    {   socketResponse[socketResponse.length - 1].result ?
                                        socketResponse[socketResponse.length - 1].result.hypotheses[0].transcript
                                        :
                                        null
                                    }
                        </Text>
                        /* 
                        socketResponse.map((item,index) => {
                            return(
                                <Text style={styles.responseText} key={index}>
                                    {   item.result ?
                                        item.result.hypotheses[0].transcript
                                        :
                                        null
                                    }
                                </Text>
                            )
                        })
                         */
                        : 
                        <Text>
                            {
                                fetchingResponse ? 
                                'Fetching Response'
                                :
                                'No Response Recieved'
                            }
                            
                        </Text>
                    }
                </View>

            <View style={styles.playRecordContainer}>

                {
                    isRecording ?
                        <View
                            style={styles.stopCancelContainer}
                        >
                            <TouchableOpacity
                                style={styles.cancelIcon}
                                onPress={() => cancelRecord()}
                            >
                                <Icon
                                    name={"close"}
                                    size={20}
                                    color="#FFF"
                                //style={styles.cancelIcon}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ ...styles.micButtonContainer, backgroundColor: 'rgba(219 ,68 ,55,1)' }}
                                onPress={() => stopRecordAyah()}
                                disabled={isPlaying}
                            >
                                <Icon
                                    name={"stop"}
                                    size={26}
                                    color="#FFF"
                                    style={styles.micIcon}
                                />
                            </TouchableOpacity>
                        </View>
                        :

                        <TouchableOpacity
                            style={styles.micButtonContainer}
                            onPress={() => recordAyah()}
                            disabled={isPlaying}
                        >
                            <Icon
                                name={"microphone"}
                                size={30}
                                color="#FFF"
                                style={styles.micIcon}
                            />
                        </TouchableOpacity>

                }
                {
                    isPlaying ?
                        <TouchableOpacity
                            style={styles.playButtonContainer}
                            onPress={() => stopAyah()}
                            disabled={isRecording}
                        >
                            <Icon
                                name={'pause'}
                                size={26}
                                color="#3D425C"
                            //style={styles.playIcon}
                            />
                        </TouchableOpacity>
                        :
                        isPlayClicked ?
                            <View style={styles.playButtonContainer}>
                                <ActivityIndicator />
                            </View>
                            :
                            <TouchableOpacity
                                style={styles.playButtonContainer}
                                onPress={() => playAyah()}
                                disabled={isRecording}
                            >
                                <Icon
                                    name={'play'}
                                    size={26}
                                    color="#3D425C"
                                    style={styles.playIcon}
                                />
                            </TouchableOpacity>
                }

            </View>
            
            </View>
        )
    }

    console.log('socketConnected : ',socketConnected);
    console.log('socketResponse', socketResponse.length !=0  ? socketResponse[0].result ? socketResponse[0].result.hypotheses[0].transcript : 'no response!' : 'response empty!' );
    //return modalize component
    return (
        <Modalize
            ref={forwardRef}
            modalHeight={HEIGHT / 1.2}
            modalStyle={{ padding: 12 }}
            HeaderComponent={_renderModalHeader}
            FooterComponent={_renderModalFooter}
            onClose={()=> {
                stopAyah();
                setSocketResponse([])
            }}
            childrenStyle={styles.mainContainer}
        >
            
                <View style={styles.coverContainer}>
                    <Text style={styles.descTextRight}>{selectedAyah ? selectedAyah.text : ''}</Text>
                </View>
                
            

        </Modalize>

    )
}

export { AyahPlayer }

const styles = StyleSheet.create({
    borderRed: {
        borderWidth: 1,
        borderColor: 'red'
    },
    mainContainer:{
        flex:1,
    },
    container: {
        flex: 1,

        backgroundColor: "#EAEAEC",
        borderWidth: 1,
        borderColor: 'red'
    },
    textLight: {
        color: "#B6B7BF"
    },
    text: {
        color: "#8E97A6"
    },
    textDark: {
        color: "#3D425C"
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
        shadowColor: "#5D3F6A",
        shadowOffset: { height: 15 },
        shadowRadius: 8,
        shadowOpacity: 0.3,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    cover: {
        width: 250,
        height: 250,
        borderRadius: 125
    },
    track: {
        height: 2,
        borderRadius: 1,
        backgroundColor: "#FFF"
    },
    thumb: {
        width: 8,
        height: 8,
        backgroundColor: "#3D425C"
    },
    timeStamp: {
        fontSize: 11,
        fontWeight: "500"
    },
    modalFooterContainer:{
        height: 200,
    },
    resultContainer:{
        height:100,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    responseText:{
        fontFamily: FontType.aaQamri,
        color: 'rgba(18, 140, 126,1)',
        fontSize: 22,
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
        backgroundColor: "rgba(18, 140, 126,1)",
        //borderWidth: 16,
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 8,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 4,
    },
    playButtonContainer: {
        backgroundColor: "#FFF",
        //borderColor: "rgba(93, 63, 106, 0.2)",
        //borderWidth: 12,
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 8,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 4,
    },
    playIcon: {
        marginLeft: 8,
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
        fontFamily: FontType.aaQamri,
        lineHeight: 70,
        letterSpacing: 15,
        color: 'rgba(18, 140, 126,1)'
    },
    
    textNumber: {
        color: Colors.grey,
        fontSize: 13,
        fontFamily: FontType.semiBold,

    },
    NumberCircle: {
        height: 32,
        width: 32,
        borderRadius: 16,
        borderColor: Colors.separator,
        borderWidth: 2,
        backgroundColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center',

    },
});