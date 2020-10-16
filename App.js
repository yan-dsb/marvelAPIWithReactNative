import 'react-native-gesture-handler';
import React from 'react'
import { View, Text } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ListOfCharacters from './src/screens/ListOfCharacters'
import Character from './src/screens/Character'

const Stack = createStackNavigator();
const App = () =>{
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ListOfCharacters">
        <Stack.Screen name="Characters" component={ListOfCharacters} />
        <Stack.Screen name="Character" component={Character} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App;