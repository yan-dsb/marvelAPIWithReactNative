import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';

const CharacterDetails = ({
  name,
  image,
  description,
  onPressFavourite,
  favourite,
}) => {
  const imageNotAvailable = image.includes('image_not_available');
  var source = {};
  if (imageNotAvailable) {
    source = require('../../assets/img/image-not-available.jpg');
  } else {
    source.uri = image;
  }
  const sourceFavourite = favourite
    ? require('../../assets/img/like.png')
    : require('../../assets/img/nolike.png');
  return (
    <>
      <View style={styles.container}>
        <Image style={styles.imageCharacter} source={source} />
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.description}>
          {description.length > 0
            ? description
            : 'No description available for this character.'}
        </Text>
        <TouchableOpacity
          accessibilityRole={'button'}
          onPress={onPressFavourite}>
          <Image style={styles.like} source={sourceFavourite} />
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
    padding: 24,
    borderRadius: 10,
    borderColor: '#ED1D24',
    borderWidth: 1,
  },
  name: {
    marginTop: 20,
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#ED1D24',
  },
  description: {
    marginTop: 20,
    fontSize: 16,
    color: '#444',
    textAlign: 'justify',
  },
  like: {
    marginTop: 20,
    width: 70,
    height: 70,
    alignSelf: 'center',
  },
  imageCharacter: {
    width: 250,
    height: 250,
    borderRadius: 125,
    alignSelf: 'center',
  },
});

export default CharacterDetails;
