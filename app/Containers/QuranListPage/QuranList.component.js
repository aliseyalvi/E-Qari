import React, { useEffect, useCallback } from 'react';
import { FlatList, BackHandler } from 'react-native';
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
        type="Peringatan"
        isVisible={isError}
        onPressOke={() => BackHandler.exitApp()}
        message={errorMessage}
      />
    );
  };

  const renderCardContent = ({ item }) => {
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
        ItemSeparatorComponent={Separator}
        ListEmptyComponent={renderListEmpty}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return isLoading ? <Loading /> : renderData();
}

export default QuranList;
