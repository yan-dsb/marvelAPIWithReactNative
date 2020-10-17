import AsyncStorage from '@react-native-community/async-storage';

export const getData = async (key) => {
  try {
    const favouritesStored = await AsyncStorage.getItem(`@${key}`);
    return favouritesStored;
  } catch (e) {
    console.log(e);
  }
};
export const setData = async (key, data) => {
  try {
    await AsyncStorage.setItem(`@${key}`, JSON.stringify(data));
  } catch (e) {
    console.log(e);
  }
};
