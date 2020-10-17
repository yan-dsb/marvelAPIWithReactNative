import React from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native'


const CharacterItem = ({name, image, onPress, onPressFavourite, favourite}) =>{
    const imageNotAvailable = image.includes('image_not_available');
    var source = {};
    if(imageNotAvailable){
      source = require('../../assets/img/image-not-available.jpg') 
    }else{
      source.uri = image
    }
    const sourceFavourite = favourite ? require('../../assets/img/like.png') : require('../../assets/img/nolike.png')
    return (
        <>
        <View style={styles.container}>
            <View style={styles.separator} />
              <TouchableOpacity
                  accessibilityRole={'button'}
                  onPress={onPress}
                  style={styles.characterContainer}
                  >
                  <Image style={styles.image} source={source} />
                  <Text style={styles.name}>{name}</Text>
                  <TouchableOpacity 
              accessibilityRole={'button'}
              onPress={onPressFavourite}
            >
              <Image style={styles.like} source={sourceFavourite} />
            </TouchableOpacity>
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
      padding: 10,
    },
    separator: {
      backgroundColor: '#DAE1E7',
      height: 2,
    },
    name: {
      fontSize: 16,
      // paddingLeft: 50,
      fontWeight: '400',
      color: "#ED1D24",
    },
    image: {
      width: 60, 
      height: 60, 
    },
    like: {
      width: 40, height: 40
    }
  });

  export default CharacterItem;