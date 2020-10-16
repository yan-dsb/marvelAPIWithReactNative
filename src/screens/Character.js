import React, { useState, useEffect } from 'react'
import { StyleSheet, View, ActivityIndicator } from 'react-native'

import api from '../services/api'
import auth from '../services/auth'
import CharacterDetails from '../components/CharacterDetails'

const Character = ({route}) =>{
    const [character, setCharacter] = useState(null)
    const { id } = route.params;
    useEffect(() => {
       getCharacter()
    }, [])
    const getCharacter = async () => {
        const response  = await api.get(`/characters/${id}`, {params: {ts: auth.ts, apikey: auth.apikey, hash: auth.hash}})
        setCharacter(response.data.data.results[0])
    }
    return(
        <>
        {character ?
            <View style={styles.container}>
                    <CharacterDetails 
                        name={character.name}  
                        image={`${character.thumbnail.path.replace('http', 'https')}/standard_amazing.${character.thumbnail.extension}`} 
                        description={character.description} 
                    />
            </View>
            :
            <ActivityIndicator style={{top: 100}} />
        }
        </>
    )
}

const styles = StyleSheet.create({
      container: {
        backgroundColor: '#FFF',
        padding: 24,
        flex: 1
      },
})

export default Character;