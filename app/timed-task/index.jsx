import { View, Text, TouchableOpacity } from 'react-native'
import React,{useEffect} from 'react'
import { useLocalSearchParams } from 'expo-router'
import Alarm from '../../components/HomeScreen/Alarm';
import { useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
export default function TimedTask() {
    const task = useLocalSearchParams();
    const navigation = useNavigation();
    useEffect(() => {
      navigation.setOptions({
        headerShown: false,
      });
    }, []);
  return (
    <View
      style={{
        padding: 20,
        paddingTop: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'#d8f3dc',
        height: '100%',
      }}
    >
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          position: 'absolute',
          top: 50,
          left: 20,
        }}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text
        style={{
          fontSize: 20,
          marginTop: 20,
          fontWeight: 'bold',
        }}
      >{task?.taskName}</Text>
      <Alarm task={task}/>
    </View>
  )
}