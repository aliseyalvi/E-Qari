import React, { useEffect, useCallback } from 'react';
import { FlatList, BackHandler, View } from 'react-native';
import SplashScreen from 'react-native-splash-screen';

import { ModalDialog } from '../../Components/ModalDialog/ModalDialogComponent';
import { Loading } from '../../Components/Loading/Loading.component';
import { CardSurahList } from '../../Components/CardSurahList/CardSurahList.component';
import { Separator } from '../../Components/Separator/Separator.component';
import { Routes } from '../../Navigation/Routes';
import { keyExtractor } from '../../Utils/Helper';

function QuranList(props) {
  const {
    getQuranList,
    navigation,
    isError,
    errorMessage,
    data,
    refreshing,
    isLoading,
  } = props;

  useEffect(() => {
    SplashScreen.hide();
    getDataQuran();
  }, [getDataQuran]);

  const getDataQuran = useCallback(async () => {
    await getQuranList();
  }, [getQuranList]);

  const goToDetailpage = dataSurah => {
    navigation.navigate(Routes.QuranDetail, { dataSurah });
  };

  const renderListEmpty = () => {
    return (
      <ModalDialog
        type="Error"
        isVisible={isError}
        onPressOke={() => BackHandler.exitApp()}
        message={errorMessage}
      />
    );
  };

  const renderCardContent = ({ item }) => {
    // for now show only 1st and 112th Surah, just for testing
    if (item?.number == 1 || item?.number == 112) {
      return (
        <CardSurahList
          surahNumber={item?.number}
          surahText={item?.name}
          surahName={item?.englishName}
          surahMean={item?.englishNameTranslation}
          surahAyat={item?.numberOfAyahs}
          onPress={() => goToDetailpage(item)}
        />
      );
    } else {
      return null;
    }
  };

  const renderData = () => {
    //console.log(data)
    return (
      <FlatList
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderCardContent}
        refreshing={refreshing}
        onRefresh={getDataQuran}
        // ItemSeparatorComponent={Separator}
        ListEmptyComponent={renderListEmpty}
        showsVerticalScrollIndicator={false}
        style={{paddingHorizontal:8,}}
        ListFooterComponent={ <View style={{ margin: 10, }} /> }
      />
    );
  };

  return isLoading ? <Loading /> : renderData();
}

export default QuranList;
