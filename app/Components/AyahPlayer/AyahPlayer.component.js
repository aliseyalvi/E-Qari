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
import Icon from 'react-native-vector-icons/FontAwesome';

// import Sound Component
import Sound from 'react-native-sound';
//import sound recorder component
import SoundRecorder from 'react-native-sound-recorder';
//import reactotron
import Reactotron from 'reactotron-react-native'

const HEIGHT = Dimensions.get('window').height
//sound instant variable
var sound1


const AyahPlayer = (props) => {
    const {
        forwardRef,
        ayahData
    } = props
    Reactotron.log('ayah data in player modal ', ayahData)

    const [recordFile, setRecordFile] = useState('')
    const [isPlaying, setIsPlaying] = useState(false)
    const [isRecording, setIsRecording] = useState(false)

    //load the player and play ayah
    const playAyah = () => {
        sound1 = new Sound(ayahData ? ayahData.audio : '', Sound.MAIN_BUNDLE,
            (error, sound) => {
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
        SoundRecorder.start(SoundRecorder.PATH_CACHE + '/test.mp4')
            .then(function () {
                setIsRecording(true)
                console.log('started recording');
            });
    }


    //stop sound recorder
    const stopRecordAyah = () => {
        SoundRecorder.stop()
            .then(function (result) {
                setIsRecording(false)
                //setRecordFile(result.path)
                console.log('stopped recording, audio file saved at: ' + result.path);
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
                return true;
            } else {
                return false;
            }
        } catch (err) {
            console.error(err);
            return false;
        }
    }

    //modal header component
    const _renderModalHeader = () => {
        return (
            <View style={styles.forwardBackContainer}>
                <TouchableOpacity>

                    <Icon name={"backward"} size={26} color="#93A8B3" />
                </TouchableOpacity>
                <View style={styles.NumberCircle}>
                    <Text style={styles.textNumber}>{ayahData ? ayahData.number : ''}</Text>
                </View>
                <TouchableOpacity>
                    <Icon name="forward" size={26} color="#93A8B3" />
                </TouchableOpacity>
            </View>
        )
    }

    //modal footer component
    const _renderModalFooter = () => {
        return (
            <View style={styles.playRecordContainer}>

                {
                    isRecording ?
                        <View
                            style={styles.stopCancelContainer}
                        >
                            <TouchableOpacity
                                style={styles.cancelIcon}
                                onPress={()=>cancelRecord()}
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
        )
    }

    //return modalize component
    return (
        <Modalize
            ref={forwardRef}
            modalHeight={HEIGHT / 1.2}
            modalStyle={{ padding: 12 }}
            HeaderComponent={_renderModalHeader}
            FooterComponent={_renderModalFooter}
            onClose={stopAyah}
        >

            <View style={styles.coverContainer}>
                <Text style={styles.descTextRight}>{ayahData ? ayahData.text : ''}</Text>
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
        padding:8,
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
        fontFamily: FontType.alQalamQuran,
        lineHeight: 70,
        letterSpacing: 15,
        color:'rgba(18, 140, 126,1)'
    },
    textNumber: {
        color: Colors.grey,
        fontSize: 16,
        fontFamily: FontType.semiBold,

    },
    NumberCircle: {
        height: 30,
        width: 30,
        borderRadius: 100,
        borderColor: Colors.separator,
        borderWidth: 2,
        backgroundColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center',

    },
});