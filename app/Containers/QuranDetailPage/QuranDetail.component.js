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
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import Clipboard from '@react-native-community/clipboard';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
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
import Reactotron from 'reactotron-react-native'
import {AyahPlayer} from '../../Components/AyahPlayer/AyahPlayer.component'
function QuranDetail(props) {
  const refRBSheet = useRef();
  const [rbSheetData, setRbSheetData] = useState({});

  
  useEffect(() => {
    renderDetailSurah();
  }, []);

  const quranOptions = [
    {
      icon: 'play',
      title: 'Mainkan Surat',
      action: () => null,
    },
    {
      icon: 'book-open-variant',
      title: 'Lihat Tafsir',
      action: () => null,
    },
    {
      icon: 'content-copy',
      title: 'Salin Ayat',
      action: () => onTapCopy(),
    },
    {
      icon: 'share-variant',
      title: 'Bagikan Ayat',
      action: () => onTapShare(),
    },
  ];

  const renderDetailSurah = async () => {
    const { getDetailQuran, navigation } = props;

    const surahId = get(navigation, 'state.params.dataSurah.number');
    const countAyat = get(navigation, 'state.params.dataSurah.numberOfAyahs');

    const payload = {
      surahId,
      countAyat,
    };

    await getDetailQuran(payload);
  };

  const openBottomSheet = item => () => {
    console.log(item);
    setRbSheetData(item);
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

  const listHeaderComponent = () => {
    const { navigation } = props;

    const surahId = get(navigation, 'state.params.dataSurah.id', '');

    switch (surahId) {
      case Constants.DATA_SURAH.AL_FATIHAH:
        return null;
      case Constants.DATA_SURAH.AL_TAUBAH:
        return null;
      default:
        return <Basmallah />;
    }
  };

  const renderCardContent = ({ item,index }) => {
    return (
      <CardAyatList
        ayatNumber={index+1}
        //ayatNumber={item?.number}
        ayatText={item?.text}
        //ayatTranslate={item?.translation_aya_text}
        //onPress={openBottomSheet(item)}
        ayahData = {item}
        onPress = {openAyahPlayerModal}
      />
    );
  };

  const renderQuranOptions = () => {
    const { navigation } = props;
    const surahName = get(navigation, 'state.params.dataSurah.surat_name', '');
    return (
      <View style={Styles.bsContainer}>
        <StatusBar
          backgroundColor={Colors.statusbarModal}
          barStyle="dark-content"
          animated
        />
        <Text style={Styles.bsTextInfo}>
          QS. {surahName}: Ayat {rbSheetData.aya_number}
        </Text>
        {quranOptions.map((item, i) => (
          <TouchableNativeFeedback onPress={item.action} key={i}>
            <View style={Styles.bsItemContainer}>
              <Icon name={item.icon} size={24} color="black" />
              <Text style={Styles.bsItemText}>{item.title}</Text>
            </View>
          </TouchableNativeFeedback>
        ))}
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
        {renderQuranOptions()}
      </RBSheet>
    );
  };

  //render ayahs flatlist
  const renderData = () => {
    const { dataAyat, refreshing } = props;
    const ayaat = dataAyat.ayahs
    Reactotron.log('Ayyats:',dataAyat.ayahs)
    return (
      <FlatList
        data={dataAyat.ayahs}
        keyExtractor={keyExtractor}
        renderItem={renderCardContent}
        refreshing={refreshing}
        onRefresh={renderDetailSurah}
        ItemSeparatorComponent={Separator}
        showsVerticalScrollIndicator={false}
        //ListHeaderComponent={listHeaderComponent}
      />
    );
  };

  //Load modal ayah player modal component
  const ayahPlayerModalizeRef = useRef(null);
  const [selectedAyah,setSelectedAyah] = useState(null)
  const openAyahPlayerModal = (ayahData) => {
    Reactotron.log('openAyahPlayerModal', ayahData)
    setSelectedAyah(ayahData)
    ayahPlayerModalizeRef.current?.open();
  }
  const renderAyahPlayerModal = () => {
    return(
      <AyahPlayer
        forwardRef = {ayahPlayerModalizeRef}
        ayahData = {selectedAyah}
      />
    )
  }

  return props.isLoading ? (
    <Loading />
  ) : (
    <Fragment>
      {renderData()}
      
      {renderAyahPlayerModal()}
      {renderBottomSheet()}
    </Fragment>
  );
}

QuranDetail.navigationOptions = ({
  navigation: {
    state: {
      params: { dataSurah },
    },
  },
}) => {
  console.log('datasurah',dataSurah)
  const suratName = dataSurah.englishName;
  const suratArabic = dataSurah.name;
  const suratTranslate = dataSurah.englishNameTranslation;
  const countAyat = dataSurah.numberOfAyahs;
  return {
    headerTitle: (
      <HeaderSurahDetail
        suratName={suratName}
        suratArabic={suratArabic}
        suratTranslate={suratTranslate}
        countAyat={countAyat}
      />
    ),
  };
};

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
});

export default QuranDetail;
