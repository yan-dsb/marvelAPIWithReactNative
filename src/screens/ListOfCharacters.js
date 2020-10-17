

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
  Image
} from 'react-native';

import _ from 'lodash';
import { useFocusEffect } from '@react-navigation/native';

import api from '../services/api'
import auth from '../services/auth'
import CharacterItem from '../components/CharacterItem'

import { getData, setData } from '../persistence/Store'
 
const ListOfCharacters = ({navigation}) => {
  const [characters, setCharacters] = useState([])
  const [favourites, setFavourites] = useState([])
  useEffect(() => {
    getCharacters()
    getFavouritesCharacters()
    
  }, [])
  useFocusEffect(
    React.useCallback(() => {
      getFavouritesCharacters()

      return () => {
      };
    }, [])
  );
  const getCharacters = async () => {
     const response  = await api.get('/characters', {params: {ts: auth.ts, apikey: auth.apikey, hash: auth.hash}})
     setCharacters(response.data.data.results)
  }

  const searchCharacter = async (term) =>{
    if(term.length > 0){
        const response = await api.get('/characters', {params: {nameStartsWith: term.toLowerCase(), ts: auth.ts, apikey: auth.apikey, hash: auth.hash}})
        setCharacters(response.data.data.results)
    }else{
        getCharacters()
    }
    
  }
  const searchDelayed = _.debounce(searchCharacter, 1000)

  const getFavouritesCharacters = async () => {
      var data = await getData('favourites')
      if( data != null){
        data = JSON.parse(data)
        setFavourites([...favourites, ...data])
      }
  }
  
  const storeFavouritesCharacters =  async (id, name) =>{
    var isAlreadyFavourite = favourites.find(f => f.id === id)
    isAlreadyFavourite = typeof isAlreadyFavourite !== "undefined" ? true : false
    //had to declare this variable favouritesToSave because the "State update using the updater provided by useState hook is also asynchronous, and will not be reflected immediately." - some guy in stackeroverflow -> https://stackoverflow.com/a/54069332
    var favouritesToSave = favourites;
    if(isAlreadyFavourite){
      const onlyFavouritesCharacters = favourites.filter(fav => fav.id !== id)
      setFavourites([...new Set(onlyFavouritesCharacters)]) 
      favouritesToSave = [...new Set(onlyFavouritesCharacters)]
    }else{
      const newFavourite = [{id, name}]
      setFavourites([...favourites, ...newFavourite])
      favouritesToSave = [...favourites, ...newFavourite]
    }
    await setData('favourites', favouritesToSave)
  }

  const listCharacters = ({item}) =>{
    const favourite = favourites.find(f => f.id === item.id) ? true : false
    return(
        <View style={styles.body}>
            <CharacterItem 
                onPress={() => navigation.navigate('Character', {id: item.id})} 
                name={item.name}  
                image={`${item.thumbnail.path}/standard_amazing.${item.thumbnail.extension}`}
                onPressFavourite={()=> storeFavouritesCharacters(item.id, item.name)}
                favourite={favourite} 
            />
        </View>
    )
  }

  const shareContent = () =>{
    return (
        <TouchableOpacity style={styles.share} onPress={()=> onShare()}><Image style={styles.shareImage} source={require('../../assets/img/share-option.png')} /></TouchableOpacity>
      
    )
  }

  const onShare = async () => {
    const shareMessage = 
    `Here is my Marvel's favourites characters \n${favourites.map(fav => `${fav.name} \n`).join('')}`
    
    try {
      const result = await Share.share({
        message:
        shareMessage
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
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
            <View style={styles.searchBar}>
                <TextInput
                    placeholder="Search your favourite character here"
                    onChangeText={searchDelayed}
                    autoCapitalize="none"
                />
            </View>
         {
         characters.length > 0 ?
            <FlatList 
            data={characters}
            keyExtractor={(character) => character.id.toString()}
            renderItem={listCharacters}
            ListHeaderComponent={()=> shareContent()}
            stickyHeaderIndices={[0]}
          /> 
          : 
          <View style={styles.viewNothingFound}>
              <Text style={styles.messageNothingFound}>Sorry, we couldn't find anything. Try again.</Text>
          </View>
          
        }
            
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        flex: 1
    },
    searchBar: {
        marginTop: 32,
        marginBottom: 10,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        width: 300,
        borderRadius: 5,
        borderColor: '#DAE1E7',
        borderWidth: 1,
    },    
    sectionContainer: {
        paddingHorizontal: 24,
    },
    viewNothingFound: {
        marginTop: 40,
    },
    messageNothingFound: {
        textAlign: 'center',
        fontSize: 15
    },
    share: {
      justifyContent: 'flex-end',
      alignItems: 'center',
      alignSelf: 'flex-end',
      width: 100,
      marginRight: 60,
      backgroundColor: '#DAE1E7',
      borderColor: '#DAE1E7',
      marginBottom: 10,
      borderRadius: 5,
      borderWidth: 1
    },
    shareText: {
      color: "#ED1D24",
      fontSize: 15
    },
    shareImage: {
      width: 25,
      height: 25
    }
});

export default ListOfCharacters;
