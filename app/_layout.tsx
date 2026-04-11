import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import '@/global.css';
import {useFonts} from "expo-font";
import {useEffect} from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'sans-regular': require('@/assets/fonts/PlusJakartaSans-Regular.ttf'),
    'sans-light': require('@/assets/fonts/PlusJakartaSans-Light.ttf'),
    'sans-medium': require('@/assets/fonts/PlusJakartaSans-Medium.ttf'),
    'sans-bold': require('@/assets/fonts/PlusJakartaSans-Bold.ttf'),
    'sans-semibold': require('@/assets/fonts/PlusJakartaSans-SemiBold.ttf'),
    'sans-extrabold': require('@/assets/fonts/PlusJakartaSans-ExtraBold.ttf'),
  });

  if (fontError) throw fontError;

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;
  return <Stack screenOptions={{headerShown: false}}/>;
}
