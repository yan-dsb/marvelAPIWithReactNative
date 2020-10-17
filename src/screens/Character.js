import React, {useState, useEffect} from 'react';
import {StyleSheet, View, ActivityIndicator} from 'react-native';

import api from '../services/api';
import auth from '../services/auth';
import CharacterDetails from '../components/CharacterDetails';
import {getData, setData} from '../persistence/Store';

const Character = ({route}) => {
  const [character, setCharacter] = useState(null);
  const [favourite, setFavourite] = useState(false);

  const {id} = route.params;
  useEffect(() => {
    getCharacter();
    getFavouriteCharacter(id);
  }, []);
  const getCharacter = async () => {
    const response = await api.get(`/characters/${id}`, {
      params: {ts: auth.ts, apikey: auth.apikey, hash: auth.hash},
    });
    setCharacter(response.data.data.results[0]);
  };
  const getFavouriteCharacter = async (id) => {
    var data = await getData('favourites');
    if (data != null) {
      data = JSON.parse(data);
      var isFavourite = data.find((f) => f.id === id);
      isFavourite = typeof isFavourite !== 'undefined' ? true : false;
      isFavourite ? setFavourite(true) : setFavourite(false);
    }
  };

  const storeFavouriteCharacter = async (id, name) => {
    var favourites = await getData('favourites');
    if (favourites != null) {
      favourites = JSON.parse(favourites);
    } else {
      favourites = [];
    }
    var isAlreadyFavourite = favourites.find((f) => f.id === id);
    isAlreadyFavourite =
      typeof isAlreadyFavourite !== 'undefined' ? true : false;
    if (isAlreadyFavourite) {
      favourites = favourites.filter((f) => f.id !== id);
      setFavourite(false);
    } else {
      const newFavourite = [{id, name}];
      favourites = [...favourites, ...newFavourite];
      setFavourite(true);
    }
    await setData('favourites', favourites);
  };

  return (
    <>
      {character ? (
        <View style={styles.container}>
          <CharacterDetails
            name={character.name}
            image={`${character.thumbnail.path}/standard_amazing.${character.thumbnail.extension}`}
            description={character.description}
            onPressFavourite={() =>
              storeFavouriteCharacter(character.id, character.name)
            }
            favourite={favourite}
          />
        </View>
      ) : (
        <ActivityIndicator style={styles.activity} />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    padding: 24,
    flex: 1,
  },
  activity: {
    top: 100,
  },
});

export default Character;
