import { View, Text, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import React, { useState , useEffect} from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import Slider from '@react-native-community/slider';
import { useLocalSearchParams } from 'expo-router';
import { db } from '../../config/FireBaseConfigs'; // Adjust the path as needed
import { collection, addDoc } from 'firebase/firestore';
import { useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
export default function AddTask() {
  const task = useLocalSearchParams();

  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  const [taskName, setTaskName] = useState(task.task || '');
  const [priority, setPriority] = useState(5);
  const [duration, setDuration] = useState('');
  const [time, setTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const onTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowPicker(false);
    setTime(currentTime);
  };

  const getPriorityLabel = (value) => {
    return value;
  };

  const saveTask = async () => {
    if (taskName.trim() === '' || duration.trim() === '') {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await addDoc(collection(db, 'tasks'), {
        taskName,
        priority,
        duration: parseInt(duration),
        time: time.toLocaleTimeString(),
      });
      Alert.alert('Success', 'Task added successfully');
      setTaskName('');
      setPriority(5);
      setDuration('');
      setTime(new Date());
    } catch (error) {
      Alert.alert('Error', 'Failed to add task');
      console.error('Error adding task: ', error);
    }
  };

  return (
    <View
      style={{
        flex:1,
        backgroundColor: '#d8f3dc',
        padding: 20,
        paddingTop: 50,
        borderRadius: 10,
      }}
    >
      <TouchableOpacity onPress={() => navigation.goBack()} style={{
        padding: 10,
        marginVertical: 10,
        borderRadius: 99,
      }}>
        <Ionicons name="arrow-back" size={24} color="green" />
      </TouchableOpacity>
      <Text style={{ 
        fontSize: 20, 
        fontWeight: 'bold', 
        marginBottom: 20,
        padding: 10,
        textAlign: 'center',
        }}>Add Your Customized New Task</Text>

      {/* Task Name Input */}
      <Text
        style={{
          fontSize: 16,
          fontWeight: 'bold',
          marginBottom: 10,
        }}
      >Task Name</Text>
      <TextInput
        placeholder="Enter task name"
        value={taskName}
        height={150}
        multiline={true}
        onChangeText={setTaskName}
        style={{
          borderWidth: 1,
          borderColor: '#40916c',
          padding: 20,
          marginVertical: 10,
          borderRadius: 5,
        }}
      />

      {/* Time Picker */}
      <Text
        style={{
          fontSize: 16,
          fontWeight: 'bold',
          marginBottom: 10,
        }}
      >Set Time</Text>
      <Button title="Choose Time" onPress={() => setShowPicker(true)} />
      {showPicker && (
        <DateTimePicker
          value={time}
          mode="time"
          display="default"
          onChange={onTimeChange}
        />
      )}
      <Text
        style={{
          fontSize: 16,
          fontWeight: 'bold',
          marginBottom: 10,
        }}
      >Selected Time: {time.toLocaleTimeString()}</Text>

      {/* Priority Slider */}
      <Text
        style={{
          fontSize: 16,
          fontWeight: 'bold',
          marginBottom: 10,
        }}
      >Priority Level: {getPriorityLabel(priority)}</Text>
      <Slider
        style={{ width: '100%', height: 40 }}
        minimumValue={1}
        maximumValue={10}
        step={1}
        value={priority}
        onValueChange={setPriority}
        minimumTrackTintColor="#1fb28a"
        maximumTrackTintColor="#d3d3d3"
        thumbTintColor="#1fb28a"
      />

      {/* Task Duration Input */}
      <Text
        style={{
          fontSize: 16,
          fontWeight: 'bold',
          marginBottom: 10,
        }}
      >Duration (in minutes)</Text>
      <TextInput
        placeholder="Enter duration"
        value={duration}
        onChangeText={setDuration}
        keyboardType="numeric"
        style={{
          borderWidth: 1,
          borderColor: '#40916c',
          padding: 10,
          marginVertical: 10,
          borderRadius: 5,
        }}
      />

      {/* Save Button */}
      <TouchableOpacity  onPress={saveTask} 
      style={{
        backgroundColor: '#40916c',
        padding: 25,
        marginVertical: 10,
        borderRadius: 99,
      }}
      >
        <Text style={{ color: '#fff', textAlign: 'center',
        fontSize: 20, fontWeight: 'bold'
         }}>Save Task</Text>
      </TouchableOpacity>
    </View>
  );
}
