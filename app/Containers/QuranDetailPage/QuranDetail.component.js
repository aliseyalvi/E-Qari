/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef, Fragment } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  Share,
  TouchableNativeFeedback,
  ToastAndroid,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import Clipboard from '@react-native-community/clipboard';
import Icon from 'react-native-vector-icons/Ionicons';
import get from 'lodash/get';

import { Basmallah } from '../../Components/Basmallah/Basmallah.component';
import { Loading } from '../../Components/Loading/Loading.component';
import { CardAyatList } from '../../Components/CardAyatList/CardAyatList.component';
import { Separator } from '../../Components/Separator/Separator.component';
import { Constants } from '../../Utils/Constants';
import { HeaderSurahDetail } from '../../Components/HeaderSurahDetail/HeaderSurahDetail.component';
import { keyExtractor } from '../../Utils/Helper';
import { FontType } from '../../Themes/Fonts';
import { Colors } from '../../Themes/Colors';
import { RbSheetStyle } from '../../Themes/Styles';
import { AyahPlayer } from './AyahPlayer.component';
//import SurahDataProvider from SurahDataContext
import { SurahDataProvider } from './SurahDataContext';

function QuranDetail(props) {
  const {
    arabicData,
    translationData,
    getDetailQuran,
    getQuranTextAudioTranslationDefault,
    getQuranTranslationSelected,
    refreshing,
    isLoading,
    navigation,
  } = props;

  const refRBSheet = useRef();
  const [rbSheetData, setRbSheetData] = useState({});
  const [selectedTranslation, setSelectedTranslation] = useState('ur.maududi');
  useEffect(() => {
    // pass customHeaderComponent as param to navigation options for rendering in header
    navigation.setParams({
      customHeaderComponent: customHeaderComponent,
    });

    // render surah details, fetch data from API and load in store.
    renderDetailSurah();
  }, []);

  // render custom navigation header component
  const customHeaderComponent = () => {
    const dataSurah = get(navigation, 'state.params.dataSurah');
    console.log('dataSurah : ', dataSurah);
    return (
      <HeaderSurahDetail
        suratName={dataSurah.englishName}
        suratArabic={dataSurah.name}
        suratTranslate={dataSurah.englishNameTranslation}
        countAyat={dataSurah.numberOfAyahs}
        rightIcon1={
          <TouchableOpacity onPress={openBottomSheet}>
            <Icon name={'book'} size={26} color="#93A8B3" />
          </TouchableOpacity>
        }
      />
    );
  };

  const translationsOptions = [
    {
      key: 'ur.jalandhry',
      name: 'Fateh Muhammad Jalandhry',
      icon: 'person-circle',
      image: undefined,
      action: () => null,
    },
    {
      key: 'ur.kanzuliman',
      name: 'Ahmed Raza Khan',
      icon: undefined,
      image: require('../../Assets/Images/ahmed-raza-khan-barelvi.jpg'),
      action: () => null,
    },
    {
      key: 'ur.qadri',
      name: 'Tahir ul Qadri',
      icon: undefined,
      image: require('../../Assets/Images/tahir-ul-qadri.jpg'),
      action: () => null,
    },
    {
      key: 'ur.junagarhi',
      name: 'Muhammad Junagarhi',
      icon: 'person-circle',
      image: undefined,
      action: () => null,
    },
    {
      key: 'ur.maududi',
      name: "Abul A'ala Maududi",
      icon: undefined,
      image: require('../../Assets/Images/molana-modudi.jpg'),
      action: () => null,
    },
  ];

  // change translation based on user selection
  const changeTranslation = async key => {
    setSelectedTranslation(key);
    const surahId = get(navigation, 'state.params.dataSurah.number');
    const translationKey = key;
    const payload = {
      surahId,
      translationKey,
    };

    // fetch the translatio from API using redux
    await getQuranTranslationSelected(payload);
  };

  const renderDetailSurah = async () => {
    const surahId = get(navigation, 'state.params.dataSurah.number');
    const countAyat = get(navigation, 'state.params.dataSurah.numberOfAyahs');

    const payload = {
      surahId,
      countAyat,
    };

    // get quran data with text, audio and translation from redux
    await getQuranTextAudioTranslationDefault(payload);
    // await getDetailQuran(payload);
  };

  const openBottomSheet = () => {
    // console.log(item);
    // setRbSheetData(item);
    console.log('open bottom sheet');
    refRBSheet.current.open();
  };

  const onTapShare = async () => {
    try {
      const result = await Share.share({
        message: `${rbSheetData.aya_text}\n\n${
          rbSheetData.translation_aya_text
        }`,
      });
      if (result.action === Share.sharedAction) {
        if (!result.activityType) {
          ToastAndroid.show(
            'Pilih aplikasi untuk membagikan',
            ToastAndroid.SHORT,
          );
          setTimeout(() => {
            refRBSheet.current.close();
          }, 0);
        }
      }
    } catch (error) {
      // error
    }
  };

  const onTapCopy = () => {
    console.log(rbSheetData);
    Clipboard.setString(
      `${rbSheetData.aya_text}\n\n${rbSheetData.translation_aya_text}`,
    );
    ToastAndroid.show('Ayat disalin', ToastAndroid.SHORT);
    refRBSheet.current.close();
  };

  /* const listHeaderComponent = () => {
    const surahId = get(navigation, 'state.params.dataSurah.id', '');

    switch (surahId) {
      case Constants.DATA_SURAH.AL_FATIHAH:
        return null;
      case Constants.DATA_SURAH.AL_TAUBAH:
        return null;
      default:
        return <Basmallah />;
    }
  }; */

  // render header component for flatlist, select translations here
  const listHeaderComponent = () => {
    return (
      <View style={Styles.translationSelectContainer}>
        <TouchableOpacity onPress={() => openBottomSheet()}>
          <Text>Translation Selection</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderCardContent = ({ item, index }) => {
    // get translation text from translationData and pass into ayah list component
    const translationText = translationData?.ayahs[index].text;
    return (
      <CardAyatList
        ayatNumber={index + 1}
        //ayatNumber={item?.number}
        ayatText={item?.text}
        translationText={translationText}
        //ayatTranslate={item?.translation_aya_text}
        //onPress={openBottomSheet(item)}
        ayahData={item}
        onPress={openAyahPlayerModal}
      />
    );
  };

  const renderTranslationsOptions = () => {
    const surahName = get(navigation, 'state.params.dataSurah.surat_name', '');
    return (
      <View style={Styles.bsContainer}>
        <StatusBar
          backgroundColor={Colors.statusbarModal}
          barStyle="dark-content"
          animated
        />
        <Text style={Styles.bsTextInfo}>Select Translation</Text>
        <ScrollView>
          {translationsOptions.map((item, i) => (
            <TouchableNativeFeedback
              onPress={() => changeTranslation(item.key)}
              key={i}>
              <View style={Styles.bsItemContainer}>
                <View style={Styles.nameIconWrapper}>
                {item.icon ? (
                  <Icon name={item.icon} size={40} color="black" />
                ) : (
                  <Image
                    source={item.image}
                    style={{ width: 40, height: 40, borderRadius: 20 }}
                  />
                )}

                <Text style={Styles.bsItemText}>{item.name}</Text>
                </View>
                {item.key === selectedTranslation ? (
                  <Icon name={'checkmark'} size={24} color="black" />
                ) : null}
              </View>
            </TouchableNativeFeedback>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderBottomSheet = () => {
    return (
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        height={300}
        duration={250}
        closeOnPressMask={true}
        customStyles={RbSheetStyle}>
        {renderTranslationsOptions()}
      </RBSheet>
    );
  };

  //render ayahs flatlist
  const renderData = () => {
    return (
      <FlatList
        data={arabicData.ayahs} //pass arabicData.ayahs in flatlist which is arabic data fetchced from api
        keyExtractor={keyExtractor}
        renderItem={renderCardContent}
        refreshing={refreshing}
        onRefresh={renderDetailSurah}
        // ItemSeparatorComponent={Separator}
        showsVerticalScrollIndicator={false}
        // ListHeaderComponent={listHeaderComponent}
        style={{paddingHorizontal:8,}}
      />
    );
  };

  //Load modal ayah player modal component
  const ayahPlayerModalizeRef = useRef(null);
  const [selectedAyah, setSelectedAyah] = useState(null);
  const openAyahPlayerModal = ayahData => {
    // Reactotron.log('openAyahPlayerModal', ayahData);
    setSelectedAyah(ayahData);
    ayahPlayerModalizeRef.current?.open();
  };
  const renderAyahPlayerModal = () => {
    return (
      <AyahPlayer forwardRef={ayahPlayerModalizeRef} ayahData={selectedAyah} />
    );
  };

  console.log('selectedTranslation : ', selectedTranslation);

  return isLoading ? (
    <Loading />
  ) : (
    <>
      <SurahDataProvider
        value={{ ...props.arabicData, selectedAyahData: selectedAyah }}>
        {renderData()}

        {renderAyahPlayerModal()}
        {renderBottomSheet()}
      </SurahDataProvider>
    </>
  );
}

QuranDetail.navigationOptions = ({ navigation }) => {
  // console.log('navigation',navigation.state.params.headerTitle);
  const customHeaderComponent = get(
    navigation,
    'state.params.customHeaderComponent',
  );

  return {
    headerTitle: customHeaderComponent,
  };
};

// QuranDetail.navigationOptions = ({
//   navigation: {
//     state: {
//       params: { dataSurah },
//     },
//   },
// }) => {
//   // console.log('state', state);
//   const suratName = dataSurah.englishName;
//   const suratArabic = dataSurah.name;
//   const suratTranslate = dataSurah.englishNameTranslation;
//   const countAyat = dataSurah.numberOfAyahs;
//   return {
//     headerTitle: (
//       <HeaderSurahDetail
//         suratName={suratName}
//         suratArabic={suratArabic}
//         suratTranslate={suratTranslate}
//         countAyat={countAyat}
//         rightIcon1={
//           <TouchableOpacity>
//             <Icon name={'book-open-page-variant'} size={26} color="#93A8B3" />
//           </TouchableOpacity>
//         }
//       />
//     ),
//   };
// };

//export const SurahDataContext = React.createContext(props.arabicData)
// Reactotron.log('');
const Styles = StyleSheet.create({
  bsContainer: {
    flex: 1,
    marginTop: 20,
  },
  bsItemContainer: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nameIconWrapper: {
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'flex-start'
  },
  bsItemText: {
    fontSize: 15,
    paddingLeft: 16,
    fontFamily: FontType.regular,
  },
  bsTextInfo: {
    textAlign: 'center',
    fontFamily: FontType.bold,
    paddingBottom: 20,
  },
  translationSelectContainer: {
    borderColor: 'rgba(0,0,0,0.1)',
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 8,
  },
});

export default QuranDetail;
