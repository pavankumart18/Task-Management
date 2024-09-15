import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { Easing, useSharedValue, useAnimatedStyle, withTiming, withDelay } from 'react-native-reanimated';
import Svg, { Line, Polygon } from 'react-native-svg';
import { useRouter } from 'expo-router';

export default function SplashScreen() {
  const router = useRouter();
  
  const WTranslateX = useSharedValue(200); 
  const ITranslateY = useSharedValue(-50); 
  const L1TranslateY = useSharedValue(50); 
  const L2TranslateY = useSharedValue(-50); 
  const YTranslateX = useSharedValue(-100); 
  const OTranslateY = useSharedValue(100); 
  const UTranslateX = useSharedValue(100);  
  const questionMarkOpacity = useSharedValue(0); 
  const arrowTranslateX = useSharedValue(-300); // Arrow starts off-screen

  useEffect(() => {
    WTranslateX.value = withTiming(0, {
      duration: 1000,
      easing: Easing.out(Easing.exp),
    });

    ITranslateY.value = withDelay(800, withTiming(0, {
      duration: 500,
      easing: Easing.out(Easing.exp),
    }));

    L1TranslateY.value = withDelay(1000, withTiming(0, {
      duration: 500,
      easing: Easing.out(Easing.exp),
    }));

    L2TranslateY.value = withDelay(1200, withTiming(0, {
      duration: 500,
      easing: Easing.out(Easing.exp),
    }));

    YTranslateX.value = withDelay(1400, withTiming(0, {
      duration: 800,
      easing: Easing.out(Easing.exp),
    }));

    OTranslateY.value = withDelay(1500, withTiming(0, {
      duration: 800,
      easing: Easing.out(Easing.exp),
    }));

    UTranslateX.value = withDelay(1600, withTiming(0, {
      duration: 800,
      easing: Easing.out(Easing.exp),
    }));

    questionMarkOpacity.value = withDelay(2200, withTiming(1, { duration: 500 }));


    // Animate the arrow from left to right
    arrowTranslateX.value = withDelay(0,withTiming(300, {
      duration: 3000, // Arrow moves across the screen in 3 seconds
      easing: Easing.linear,
    }));
  }, [WTranslateX, ITranslateY, L1TranslateY, L2TranslateY, YTranslateX, OTranslateY, UTranslateX, questionMarkOpacity, arrowTranslateX]);

  // Animated styles for letters
  const WStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: WTranslateX.value }],
  }));

  const IStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: ITranslateY.value }],
  }));

  const L1Style = useAnimatedStyle(() => ({
    transform: [{ translateY: L1TranslateY.value }],
  }));

  const L2Style = useAnimatedStyle(() => ({
    transform: [{ translateY: L2TranslateY.value }],
  }));

  const YStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: YTranslateX.value }],
  }));

  const OStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: OTranslateY.value }],
  }));

  const UStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: UTranslateX.value }],
  }));

  const questionMarkStyle = useAnimatedStyle(() => ({
    opacity: questionMarkOpacity.value,
  }));

  const arrowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: arrowTranslateX.value }],
  }));

  return (
    <View
        style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        }}
    >
      <View style={styles.container}>
        <Animated.Text style={[styles.text, WStyle]}>W</Animated.Text>

        <Animated.Text style={[styles.text, IStyle]}>I</Animated.Text>
        <Animated.Text style={[styles.text, L1Style]}>L</Animated.Text>
        <Animated.Text style={[styles.text, L2Style]}>L</Animated.Text>

        <Text style={styles.text}> </Text>

        <Animated.Text style={[styles.text, YStyle]}>Y</Animated.Text>
        <Animated.Text style={[styles.text, OStyle]}>O</Animated.Text>
        <Animated.Text style={[styles.text, UStyle]}>U</Animated.Text>

        <Animated.Text style={[styles.question, questionMarkStyle]}>?</Animated.Text>
      </View>

      {/* Arrow animation */}
      <Animated.View style={[styles.arrowContainer, arrowStyle]}>
        <Svg height="10" width="200">
          <Line x1="0" y1="5" x2="200" y2="5" stroke="black" strokeWidth="2" />
          <Polygon points="190,0 200,5 190,10" fill="black" />
        </Svg>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 2,
  },
  text: {
    fontSize: 50,
    fontWeight: 'bold',
  },
  question: {
    fontSize: 70,
    fontWeight: 'bold',
  },
  arrowContainer: {
    flex:1,
    position: 'absolute',
    bottom: 400,
  },
});
