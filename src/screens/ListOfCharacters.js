

import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  FlatList,
  TextInput
} from 'react-native';

import _ from 'lodash';

import api from '../services/api'
import auth from '../services/auth'
import CharacterItem from '../components/CharacterItem'

const ListOfCharacters = ({navigation}) => {
  const [characters, setCharacters] = useState([])
  useEffect(() => {
    getCharacters()
  }, [])

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
  const searchDelayed = _.debounce(searchCharacter, 1200);

  const listCharacters = ({item}) =>{
    return(
        <View style={styles.body}>
            <CharacterItem 
                onPress={() => navigation.navigate('Character', {id: item.id})} 
                name={item.name}  
                image={`${item.thumbnail.path.replace('http', 'https')}/standard_amazing.${item.thumbnail.extension}`} 
            />
        </View>
    )
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
            <View style={styles.searchBar}>
                <TextInput
                    placeholder="Search here your favourite character"
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
    }
});

export default ListOfCharacters;
