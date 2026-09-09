import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppProvider } from './src/utils/AppContext';
import MainTabs from './src/navigation/MainTabs';
import ProximityPingScreen from './src/screens/ProximityPingScreen';
import { RootStackParamList } from './src/navigation/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="ProximityPing" component={ProximityPingScreen} />
        </Stack.Navigator>
        <StatusBar style="light" />
      </NavigationContainer>
    </AppProvider>
  );
}
