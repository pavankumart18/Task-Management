import { View, Text ,ScrollView} from 'react-native'
import React ,{ useEffect} from 'react'
import { useRouter } from 'expo-router'
import { useNavigation } from 'expo-router'
import Add from '../../components/HomeScreen/Add';
import UpcomingTasks from '../../components/HomeScreen/UpcomingTasks';
import FocusedTasks from '../../components/HomeScreen/FocusedTasks';
export default function Home() {
    const router = useRouter();
    const navigation = useNavigation();
    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, []);
  return (
    <View
        style={{
            flex: 1,
            backgroundColor: '#d8f3dc',
            paddingTop: 50,
            padding: 20,

        }}
    >
      <Text
        style={{
            fontSize: 40,
            fontWeight: 'bold',
            marginLeft: 10,
            color: '#2c3e50',
            textAlign: 'center',
        }}
      >Will You ?</Text>

      <ScrollView
        
      >

      <View
        style={{
            marginBottom:100,
        }}
      >
        {/* Add a Task */}
        <Add />
        {/* Upcoming Tasks */}
        <UpcomingTasks />
        {/* Focused Tasks */}
        <FocusedTasks />
      </View>
      </ScrollView>
    </View>
  )
}