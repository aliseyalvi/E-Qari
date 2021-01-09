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
    
    const [isPlaying, setIsPlaying] = useState(false)
    const playAyah = () => {
        sound1 = new Sound(ayahData ? ayahData.audio : '', Sound.MAIN_BUNDLE,
            (error, sound) => {
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
                <TouchableOpacity style={styles.micButtonContainer} >
                    <Icon
                        name={"microphone"}
                        size={40}
                        color="#3D425C"
                        style={styles.micIcon}
                    />
                </TouchableOpacity>
                {
                    isPlaying ?
                        <TouchableOpacity style={styles.playButtonContainer} onPress={() => stopAyah()}>
                            <Icon
                                name={'pause'}
                                size={32}
                                color="#3D425C"
                                style={styles.playIcon}
                            />
                        </TouchableOpacity>
                        :
                        <TouchableOpacity style={styles.playButtonContainer} onPress={() => playAyah()}>
                            <Icon
                                name={'play'}
                                size={32}
                                color="#3D425C"
                                style={styles.playIcon}
                            />
                        </TouchableOpacity>
                }

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
        fontFamily: FontType.muhammadi,
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