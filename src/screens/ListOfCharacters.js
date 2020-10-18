import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  FlatList,
  TextInput,
  TouchableOpacity,
  Share,
  Image,
  ActivityIndicator,
} from 'react-native';

import _ from 'lodash';
import {useFocusEffect} from '@react-navigation/native';

import api from '../services/api';
import auth from '../services/auth';
import CharacterItem from '../components/CharacterItem';

import {getData, setData} from '../persistence/Store';

const ListOfCharacters = ({navigation}) => {
  const [characters, setCharacters] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    getCharacters();
    getFavouritesCharacters();
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      getFavouritesCharacters();
      return () => {};
    }, []),
  );
  const getCharacters = async () => {
    console.log(offset);
    const response = await api.get('/characters', {
      params: {ts: auth.ts, apikey: auth.apikey, hash: auth.hash, offset},
    });
    if (offset === 0) {
      setCharacters(response.data.data.results);
    } else {
      setCharacters([...characters, ...response.data.data.results]);
    }

    setOffset(offset + response.data.data.results.length);
    setRefreshing(false);
    setLoading(false);
  };

  const searchCharacter = async (term) => {
    setSearch(term);
    setLoading(true);
    if (term.length > 0) {
      const response = await api.get('/characters', {
        params: {
          nameStartsWith: term.toLowerCase(),
          ts: auth.ts,
          apikey: auth.apikey,
          hash: auth.hash,
        },
      });
      setCharacters(response.data.data.results);
      setOffset(0);
      setLoading(false);
    } else {
      getCharacters();
    }
  };
  const searchDelayed = _.debounce(searchCharacter, 500);

  const getFavouritesCharacters = async () => {
    var data = await getData('favourites');
    if (data != null) {
      data = JSON.parse(data);
      setFavourites([...favourites, ...data]);
    }
  };

  const storeFavouritesCharacters = async (id, name) => {
    var isAlreadyFavourite = favourites.find((f) => f.id === id);
    isAlreadyFavourite =
      typeof isAlreadyFavourite !== 'undefined' ? true : false;
    //had to declare this variable favouritesToSave because the "State update using the updater provided by useState hook is also asynchronous, and will not be reflected immediately." - some guy in stackeroverflow -> https://stackoverflow.com/a/54069332
    var favouritesToSave = favourites;
    if (isAlreadyFavourite) {
      const onlyFavouritesCharacters = favourites.filter(
        (fav) => fav.id !== id,
      );
      setFavourites([...new Set(onlyFavouritesCharacters)]);
      favouritesToSave = [...new Set(onlyFavouritesCharacters)];
    } else {
      const newFavourite = [{id, name}];
      setFavourites([...favourites, ...newFavourite]);
      favouritesToSave = [...favourites, ...newFavourite];
    }
    await setData('favourites', favouritesToSave);
  };

  const listCharacters = ({item}) => {
    const favourite = favourites.find((f) => f.id === item.id) ? true : false;
    return (
      <View style={styles.body}>
        <CharacterItem
          onPress={() => navigation.navigate('Character', {id: item.id})}
          name={item.name}
          image={`${item.thumbnail.path.replace(
            'http',
            'https',
          )}/standard_amazing.${item.thumbnail.extension}`}
          onPressFavourite={() => storeFavouritesCharacters(item.id, item.name)}
          favourite={favourite}
        />
      </View>
    );
  };

  const shareContent = () => {
    return (
      <View style={styles.shareView}>
        <TouchableOpacity style={styles.share} onPress={() => onShare()}>
          <Image
            style={styles.shareImage}
            source={require('../../assets/img/share-option.png')}
          />
          <Text style={styles.shareText}>Share your favourites characters</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const onShare = async () => {
    const shareMessage = `Here is my favourites characters of the Marvel Universe: \n${favourites
      .map((fav) => `${fav.name} \n`)
      .join('')}`;

    try {
      const result = await Share.share({
        message: shareMessage,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
        } else {
        }
      } else if (result.action === Share.dismissedAction) {
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const onRefresh = () => {
    this.search.clear();
    setRefreshing(true);
    getCharacters();
  };
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <View style={styles.searchBar}>
          <TextInput
            ref={(input) => {
              this.search = input;
            }}
            placeholderTextColor="#ED1D24"
            style={styles.searchInput}
            placeholder="Search your favourite character here"
            onChangeText={searchDelayed}
            autoCapitalize="none"
          />
        </View>
        {characters.length > 0 ? (
          <View style={styles.listContainer}>
            <View style={styles.listSection}>
              <FlatList
                data={characters}
                keyExtractor={(character) => character.id.toString()}
                renderItem={listCharacters}
                refreshing={refreshing}
                onRefresh={() => onRefresh()}
                ListFooterComponent={() => {
                  if (search.length === 0) {
                    return (
                      <TouchableOpacity
                        style={styles.showMore}
                        onPress={() => getCharacters()}>
                        <Text style={styles.showMoreText}>Show more</Text>
                      </TouchableOpacity>
                    );
                  } else {
                    return <></>;
                  }
                }}
              />
              {shareContent()}
            </View>
          </View>
        ) : loading ? (
          <ActivityIndicator />
        ) : (
          <View style={styles.viewNothingFound}>
            <Text style={styles.messageNothingFound}>
              Sorry, we couldn't find anything. Try again.
            </Text>
          </View>
        )}
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  listContainer: {
    flex: 1,
  },
  listSection: {
    flex: 2,
  },
  searchBar: {
    marginTop: 20,
    marginBottom: 20,
    padding: 10,
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    borderColor: '#ED1D24',
    borderWidth: 0.5,
  },
  searchInput: {
    color: '#ED1D24',
  },
  sectionContainer: {
    paddingHorizontal: 24,
  },
  viewNothingFound: {
    marginTop: 40,
  },
  messageNothingFound: {
    textAlign: 'center',
    fontSize: 15,
    color: '#ED1D24',
  },
  shareView: {
    backgroundColor: '#FFFFFF',
  },
  share: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    padding: 10,
  },
  shareText: {
    color: '#ED1D24',
    fontSize: 15,
  },
  shareImage: {
    width: 25,
    height: 25,
  },
  showMore: {
    marginTop: 20,
    marginBottom: 20,
    padding: 10,
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#000042',
    borderRadius: 5,
  },
  showMoreText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default ListOfCharacters;
