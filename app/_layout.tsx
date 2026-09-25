//Reviewed
import { Stack } from 'expo-router'; //Stack = the navigation system that controls how screens appear and how you move between them.
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { Colors } from '../constants/colors';
// import { db } from '../firebase/firebase';
// import { collection, addDoc } from 'firebase/firestore';
SplashScreen.preventAutoHideAsync();

// useEffect(() => { TEST THE FIRST REQUEST TO FIRESTORE
//   const testFirestoreAPI = async () => {
//     try {
//       const docRef = await addDoc(collection(db, "connection_tests"), {
//         message: "Hello from React Native Expo on Android!",
//         timestamp: new Date()
//       });
//       console.log("Success! Document written with ID: ", docRef.id);
//     } catch (error) {
//       console.error("FAIL: ", error);
//     }
//   };

//   testFirestoreAPI();
// }, [])

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: Colors.background },
              animation: 'slide_from_right',
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="notes" />
            <Stack.Screen name="ai-tools" />
            <Stack.Screen name="settings" />
          </Stack>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}