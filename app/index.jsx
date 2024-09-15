import { Text, View } from "react-native";
import SplashScreen from "../components/SplashScreen";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
export default function Index() {
  const router = useRouter();
  useEffect(() => {
    setTimeout(() => {
      router.push("home");
    },3000);
  }, []);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <SplashScreen />
    </View>
  );
}
