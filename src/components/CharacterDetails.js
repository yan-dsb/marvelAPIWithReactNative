import React from 'react'
import { View, Text, Image, StyleSheet} from 'react-native'


const CharacterDetails = ({name, image, description}) =>{
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
                <Image style={{width: 250, height: 250, alignSelf: 'center'}} source={source} />
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.description}>{description.length > 0 ? description  : 'No description available for this character.' }</Text>
        </View>
        </>
    )

}

const styles = StyleSheet.create({
    container: {
        marginTop: 32,
        padding: 24,
        borderColor: '#DAE1E7',
        borderWidth: 1,
        borderRadius: 10
      
    },
    name: {
        marginTop: 20,
        fontSize: 18,
        textAlign: 'center',
        fontWeight: '400',
        color: "#ED1D24",
    },
    description: {
        marginTop: 20,
        fontSize: 16,
        color: '#444',
        textAlign: 'justify'
    }
  });

  export default CharacterDetails;