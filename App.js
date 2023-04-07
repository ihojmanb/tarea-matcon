import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import ResourcesScreen from './src/screens/ResourcesScreen';
import CardDetailScreen from './src/screens/CardDetailScreen';
import OfflineCardDetailScreen from './src/screens/OfflineCardDetailScreen';
import OfflineResourcesScreen from './src/screens/OfflineResourcesScreen';
import { ScrollView, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import DownloadButton from './src/components/DownloadButton';
import { readRegisteredIds } from './src/utils/downloadFilesUtils';
import { useNetInfo } from "@react-native-community/netinfo";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeScreen({
  navigation,
  resourcesList,
  setResourcesList,
  resourcesSelected,
  setResourcesSelected
}) {

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <Stack.Navigator>
        <Stack.Screen name="Recursos">
          {(props) =>
            <ResourcesScreen
              {...props}
              resourcesList={resourcesList}
              setResourcesList={setResourcesList}
              resourcesSelected={resourcesSelected}
              setResourcesSelected={setResourcesSelected}
            />}
        </Stack.Screen>
        <Stack.Screen name="Card" component={CardDetailScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </ScrollView>

  )

}
function OfflineScreen({
  navigation,
  registeredIds
}) {

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <Stack.Navigator>
        <Stack.Screen name="Recursos Offline">
          {(props) =>
            <OfflineResourcesScreen
              {...props}
              registeredIds={registeredIds}
            />}
        </Stack.Screen>
        <Stack.Screen name="OfflineCard" component={OfflineCardDetailScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </ScrollView>

  )

}

export default function App() {

  let [resourcesList, setResourcesList] = useState();
  let [resourcesSelected, setResourcesSelected] = useState([]);
  let [registeredIds, setRegisteredIds] = useState([]);

  useEffect(() => {
    async function fetchRegisteredIds() {
      const ids = await readRegisteredIds();
      setRegisteredIds(ids)
    }
    fetchRegisteredIds();
  }, [])

  useEffect(() => {
    console.log('registeredIds: ', registeredIds)
  }, [registeredIds]);

  const netInfo = useNetInfo();

  if (netInfo.isConnected) {
    return (
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Home"
            options={{
              headerRight: () => (
                <DownloadButton
                  resourcesList={resourcesList}
                  resourcesSelected={resourcesSelected}
                  setRegisteredIds={setRegisteredIds}
                />
              ),
            }}

          >
            {(props) =>
              <HomeScreen
                {...props}
                resourcesList={resourcesList}
                setResourcesList={setResourcesList}
                resourcesSelected={resourcesSelected}
                setResourcesSelected={setResourcesSelected}
              />

            }

          </Tab.Screen>
          <Tab.Screen name="Offline" >
            {(props) =>
              <OfflineScreen
                {...props}
                registeredIds={registeredIds}
              />
            }
          </ Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
    );

  }
  else {
    <View
      className='flex justify-center items-center mt-5 mb-5'

    >

      <Text>
        whoops not connected
      </Text>
    </View>
  }
}