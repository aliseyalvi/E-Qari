import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
    Platform,
    PermissionsAndroid,
    Button,
    Switch,
    Image,
    StatusBar,
    SafeAreaView
} from 'react-native';
import { Modalize } from 'react-native-modalize';
import { Colors } from '../../Themes/Colors';
import { FontType } from '../../Themes/Fonts';
//import TrackPlayer from 'react-native-track-player';
import Icon from 'react-native-vector-icons/FontAwesome';

import {
    Player,
    Recorder,
    MediaStates,
} from '@react-native-community/audio-toolkit';

import Reactotron from 'reactotron-react-native'
const HEIGHT = Dimensions.get('window').height
var player;
var recorder;
//const filename = 'https://cdn.alquran.cloud/media/audio/ayah/ar.alafasy/1';
const filename = 'test.mp3'
const AyahPlayer = (props) => {
    const {
        forwardRef,
        ayahData
    } = props
    Reactotron.log('ayah data in player modal ', ayahData)
    
    const [playPauseButton, setPlayPauseButton] = useState('')
    const [recordButton, setRecordButton] = useState('')
    const [stopButtonDisabled, setStopButtonDisabled] = useState(true)
    const [playButtonDisabled, setPlayButtonDisabled] = useState(true)
    const [recordButtonDisabled, setRecordButtonDisabled] = useState(true)
    const [loopButtonStatus, setLoopButtonStatus] = useState(false)
    const [error, setError] = useState(null)




    const _reloadPlayer = () => {
        if (player) {
            player.destroy();
        }
        
        player = new Player(ayahData? ayahData.audio : '', {
            autoDestroy: false
        }).prepare((err) => {
            if (err) {
                console.log('error at _reloadPlayer():');
                console.log(err);
            } else {
                player.looping = loopButtonStatus
            }

            _updateState();
        });
        //console.log('inside reload player',player)
        _updateState();

        player.on('ended', () => {
            _updateState();
        });
        player.on('pause', () => {
            _updateState();
        });
    }

    const _reloadRecorder = () => {
        if (recorder) {
            recorder.destroy();
        }

        recorder = new Recorder(filename, {
            bitrate: 256000,
            channels: 2,
            sampleRate: 44100,
            quality: 'max'
        }).prepare((err,fsPath)=>{
            console.log('fspath:',fsPath);
        });

        _updateState();
    }

    const _toggleRecord = () => {
        if (player) {
            player.destroy();
        }

        let recordAudioRequest;
        if (Platform.OS == 'android') {
            recordAudioRequest = _requestRecordAudioPermission();
        } else {
            recordAudioRequest = new Promise(function (resolve, reject) { resolve(true); });
        }

        recordAudioRequest.then((hasPermission) => {
            if (!hasPermission) {
                setError('Record Audio Permission was denied')

                return;
            }
            
            recorder.toggleRecord((err, stopped,) => {
                if (err) {
                    setError(err.message)

                }
                if (stopped) {
                    //console.log('inside toggle record');
                    _reloadPlayer();
                    _reloadRecorder();
                }

                _updateState();
            });
        });
    }
    const _startRecord = () => {
        if (player) {
            player.destroy();
        }
        recorder.record((err)=>{
            setError(err)
        })
        _updateState();
    }
    const _stopRecord = () => {
        if (player) {
            player.destroy();
        }
        recorder.stop((err)=>{
            setError(err)
        })
        _reloadPlayer();
        _reloadRecorder();
        _updateState();
    }

    const _requestRecordAudioPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                {
                    title: 'Microphone Permission',
                    message: 'ExampleApp needs access to your microphone to test react-native-audio-toolkit.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                return true;
            } else {
                return false;
            }
        } catch (err) {
            console.error(err);
            return false;
        }
    }

    const _toggleLooping = (value) => {
        setLoopButtonStatus(value)

        if (player) {
            player.looping = value;
        }
    }

    const _playPause = () => {
        console.log('inside playpause',player)
        if(player){
            console.log('inside if',player)
            player.playPause((err, paused) => {
                if (err) {
                    setError(err.message)
    
                }
                _updateState();
            })
        }
        
    }

    const _stop = () => {
        player.stop(() => {
            _updateState();
        });
    }

    const _updateState = (err) => {
        setPlayPauseButton(player && player.isPlaying ? 'pause' : 'play')
        setRecordButton(recorder && recorder.isRecording ? 'Stop' : 'Record')
        setStopButtonDisabled(!player || !player.canStop)
        setPlayButtonDisabled(!player || !player.canPlay || recorder.isRecording)
        setRecordButtonDisabled(!recorder || (player && !player.isStopped))

    }

    useEffect(()=>{
        _reloadPlayer()
        _reloadRecorder()
    },[ayahData])

    /*     //state to manage whether track player is initialized or not
        const [isTrackPlayerInit, setIsTrackPlayerInit] = useState(false);
        const [isPlaying, setIsPlaying] = useState(false);
        //function to initialize the Track Player 
        const trackPlayerInit = async () => {
            await TrackPlayer.setupPlayer();
            await TrackPlayer.add({
                id: '1',
                url: 'https://cdn.alquran.cloud/media/audio/ayah/ar.alafasy/1',
                //url:ayahData? ayahData.audio : '',
                type: 'default',
                title: 'My Title',
                album: 'My Album',
                artist: 'Rohan Bhatia',
                artwork: 'https://picsum.photos/100',
            });
            return true;
        };
    
    
        //initialize the TrackPlayer when the App component is mounted
        useEffect(() => {
            const startPlayer = async () => {
                let isInit = await trackPlayerInit();
                setIsTrackPlayerInit(isInit);
            }
            startPlayer();
        }, [ayahData]);
    
        //start playing the TrackPlayer when the button is pressed 
        const onButtonPressed = () => {
            if (!isPlaying) {
                TrackPlayer.play();
                setIsPlaying(true);
              } else {
                TrackPlayer.pause();
                setIsPlaying(false);
              }
        }; */

        const record =()=> {
            // Disable button while recording and playing back
           
          
            // Start recording
            let rec = new Recorder("filename.mp4").record();
          
            // Stop recording after approximately 3 seconds
            setTimeout(() => {
              rec.stop((err) => {
                // NOTE: In a real situation, handle possible errors here
          
                // Play the file after recording has stopped
                new Player("filename.mp4")
                .play()
                .on('ended', () => {
                  // Enable button again after playback finishes
                  console.log('recording ended');
                });
              });
            }, 5000);
          }

    const _renderModalHeader = () => {
        return (
            <View style={styles.forwardBackContainer}>
                <TouchableOpacity>

                    <Icon name={"backward"} size={32} color="#93A8B3" />
                </TouchableOpacity>
                <View style={styles.NumberCircle}>
                    <Text style={styles.textNumber}>{ayahData ? ayahData.number : ''}</Text>
                </View>
                <TouchableOpacity>
                    <Icon name="forward" size={32} color="#93A8B3" />
                </TouchableOpacity>
            </View>
        )
    }
    const _renderModalFooter = () => {
        return (
            <View style={styles.playRecordContainer}>
                <TouchableOpacity style={styles.micButtonContainer}>
                    <Icon
                        name={"microphone"}
                        size={40}
                        color="#3D425C"
                        style={styles.micIcon}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.playButtonContainer} disabled={playButtonDisabled} onPress={() => _playPause()}>
                    <Icon
                        name={playPauseButton}
                        size={32}
                        color="#3D425C"
                        style={styles.playIcon}
                    />
                </TouchableOpacity>
            </View>
        )
    }
    return (
        <Modalize
            ref={forwardRef}
            modalHeight={HEIGHT / 1.2}
            modalStyle={{ padding: 12 }}
            HeaderComponent={_renderModalHeader}
            FooterComponent={_renderModalFooter}
        >


            <View style={styles.coverContainer}>
                
                <Text style={styles.descTextRight}>{ayahData ? ayahData.text : ''}</Text>
                 
                {/** 
                <View style={styles.settingsContainer}>
                    <Switch
                        onValueChange={(value) => _toggleLooping(value)}
                        value={loopButtonStatus} />
                    <Text>Toggle Looping</Text>
                </View>
                
                
                <View>
                    <Text style={styles.title}>
                        Recording
                    </Text>
                </View>
                <View>
                    
                <TouchableOpacity disabled={recordButtonDisabled} onPress={() => _toggleRecord()}>
                        <Text>
                        {recordButton}
                        </Text>
                    </TouchableOpacity>
                </View>
                */}
                {/** 
                <View>
                    
                <TouchableOpacity disabled={recordButtonDisabled} onPress={() => _startRecord()}>
                        <Text>
                        start record
                        </Text>
                    </TouchableOpacity>
                </View>
                <View>
                <TouchableOpacity disabled={recordButtonDisabled} onPress={() => _stopRecord()}>
                        <Text>
                        stop record
                        </Text>
                    </TouchableOpacity>
                </View>
                */}
                <View>
                    <Text style={styles.errorMessage}>{error}</Text>
                </View>
            </View>
            <View style={{}}>
                {/** 
                    <Slider
                        minimumValue={0}
                        maximumValue={this.state.trackLength}
                        trackStyle={styles.track}
                        thumbStyle={styles.thumb}
                        minimumTrackTintColor="#93A8B3"
                        onValueChange={seconds => this.changeTime(seconds)}
                    ></Slider>
                    
                <View style={{ marginTop: -12, flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={[styles.textLight, styles.timeStamp]}>{this.state.timeElapsed}</Text>
                    <Text style={[styles.textLight, styles.timeStamp]}>{this.state.timeRemaining}</Text>
                </View>
                */}
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
        paddingHorizontal: 12,
        paddingVertical: 8,
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
    playRecordContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 150,
    },
    micButtonContainer: {
        backgroundColor: "#FFF",
        borderColor: "rgba(93, 63, 106, 0.2)",
        borderWidth: 16,
        width: 120,
        height: 120,
        borderRadius: 60,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#5D3F6A",
        shadowRadius: 30,
        shadowOpacity: 0.5,
        marginHorizontal: 8,
    },
    playButtonContainer: {
        backgroundColor: "#FFF",
        borderColor: "rgba(93, 63, 106, 0.2)",
        borderWidth: 12,
        width: 90,
        height: 90,
        borderRadius: 45,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#5D3F6A",
        shadowRadius: 30,
        shadowOpacity: 0.5,
        marginHorizontal: 8,
    },
    playIcon: {
        marginLeft: 8,
    },

    descTextRight: {
        textAlign: 'right',
        paddingTop: 10,
        paddingRight: 10,
        fontSize: 27,
        fontFamily: FontType.arabic,
        lineHeight: 70,
    },
    textNumber: {
        color: Colors.grey,
        fontSize: 18,
        fontFamily: FontType.semiBold,

    },
    NumberCircle: {
        height: 40,
        width: 40,
        borderRadius: 100,
        borderColor: Colors.separator,
        borderWidth: 2,
        backgroundColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center',

    },
});