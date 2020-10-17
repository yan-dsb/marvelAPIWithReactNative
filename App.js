import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import ListOfCharacters from './src/screens/ListOfCharacters';
import Character from './src/screens/Character';

const opts = {
  headerStyle: {
    backgroundColor: '#fff',
  },
  headerTintColor: '#ED1D24',
  headerTitleStyle: {
    fontWeight: 'bold',
    alignSelf: 'center',
  },
};

const Stack = createStackNavigator();
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ListOfCharacters">
        <Stack.Screen
          name="Characters"
          options={opts}
          component={ListOfCharacters}
        />
        <Stack.Screen name="Character" options={opts} component={Character} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
