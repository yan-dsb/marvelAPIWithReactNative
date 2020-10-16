import React from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native'


const CharacterItem = ({name, image, onPress}) =>{
    const imageNotAvailable = image.includes('image_not_available');
    var source = {};
    if(imageNotAvailable){
      source = require('../../assets/img/image-not-available.jpg') 
    }else{
      source.uri = image
    }
    return (
        <>
        <View style={styles.container}>
            <View style={styles.separator} />
            <TouchableOpacity
                accessibilityRole={'button'}
                onPress={onPress}
                style={styles.characterContainer}>
                <Image style={{width: 50, height: 50, marginLeft: 30}} source={source} />
                <Text style={styles.name}>{name}</Text>
                
            </TouchableOpacity>
        </View>
        </>
    )

}

const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 24,
    },
    characterContainer: {
      flexWrap: 'wrap',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
    },
    separator: {
      backgroundColor: '#DAE1E7',
      height: 1,
    },
    name: {
      flex: 2,
      fontSize: 18,
      paddingLeft: 50,
      fontWeight: '400',
      color: "#ED1D24",
    },
  });

  export default CharacterItem;