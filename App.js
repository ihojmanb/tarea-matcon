import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import CardScreen from './src/screens/CardScreen';

const Stack = createStackNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Recursos" component={HomeScreen} />
        <Stack.Screen name="Card" component={CardScreen} />
      </Stack.Navigator>
    </NavigationContainer>

  );
}