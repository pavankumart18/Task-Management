import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Button, Alert } from 'react-native';
import { useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import Slider from '@react-native-community/slider';
import { db, collection, addDoc, deleteDoc, doc, onSnapshot } from '../../config/FireBaseConfigs'; // Adjust the path as needed
import { useRouter } from 'expo-router';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [priority, setPriority] = useState(5);
  const [duration, setTaskDuration] = useState(20);
  const [time, setTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [focusedTask, setFocusedTask] = useState(null);
  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });

    const tasksCollection = collection(db, 'tasks');
    const unsubscribe = onSnapshot(tasksCollection, (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTasks(tasksData);
    });

    return () => unsubscribe(); 
  }, [navigation]);

  const addTask = async () => {
    if (taskName.trim() === '' || duration === null) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await addDoc(collection(db, 'tasks'), {
        taskName,
        priority,
        duration: parseInt(duration),
        time: time.toLocaleTimeString(),
        createdAt: new Date(),
      });
      Alert.alert('Success', 'Task added successfully');
      setTaskName('');
      setPriority(5);
      setTaskDuration(20);
      setTime(new Date());
    } catch (error) {
      Alert.alert('Error', 'Failed to add task');
      console.error('Error adding task: ', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await deleteDoc(doc(db, 'tasks', id)); 
    } catch (error) {
      console.error("Error deleting task: ", error);
    }
  };

  const focusOnTask = (task) => {
    setFocusedTask(task);
    router.push({
      pathname: '/timed-task',
      params: task,
    });
  };

  const onTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowPicker(false);
    setTime(currentTime);
  };

  const getPriorityLabel = (value) => {
    return value;
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Tasks</Text>

      <TextInput
        placeholder="Task Name"
        value={taskName}
        onChangeText={setTaskName}
        style={styles.input}
        multiline={true}
      />

      <Text style={styles.subHeader}>Set Time</Text>
      <Button title="Choose Time" onPress={() => setShowPicker(true)} />
      {showPicker && (
        <DateTimePicker
          value={time}
          mode="time"
          display="default"
          onChange={onTimeChange}
        />
      )}
      <Text style={styles.subHeader}>Selected Time: {time.toLocaleTimeString()}</Text>

      <Text style={styles.subHeader}>Priority Level: {getPriorityLabel(priority)}</Text>
      <Slider
        style={styles.slider}
        minimumValue={1}
        maximumValue={10}
        step={1}
        value={priority}
        onValueChange={setPriority}
        minimumTrackTintColor="#1fb28a"
        maximumTrackTintColor="#d3d3d3"
        thumbTintColor="#1fb28a"
      />

      <Text style={styles.subHeader}>Duration {duration} (in minutes)</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={60}
        step={1}
        value={duration}
        onValueChange={setTaskDuration}
        minimumTrackTintColor="#1fb28a"
        maximumTrackTintColor="#d3d3d3"
        thumbTintColor="#1fb28a"
      />

      <TouchableOpacity onPress={addTask} style={styles.addButton}>
        <Text style={styles.addButtonText}>Add Task</Text>
      </TouchableOpacity>

      {tasks.length > 0 ? (
        tasks.map((task) => (
          <View key={task.id} style={styles.taskItem}>
            <View style={styles.taskDetails}>
              <Text style={styles.taskName}>{task.taskName}</Text>
              <Text style={styles.taskInfo}>Priority: {task.priority}</Text>
              <Text style={styles.taskInfo}>Duration: {task.duration} mins</Text>
              <Text style={styles.taskInfo}>Time: {task.time}</Text>
            </View>

            <View style={styles.taskActions}>
              <TouchableOpacity
                onPress={() => focusOnTask(task)}
                style={styles.focusButton}
              >
                <Text style={styles.buttonText}>Focus</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => deleteTask(task.id)}
                style={styles.deleteButton}
              >
                <Ionicons name="trash" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.emptyListText}>No tasks available.</Text>
      )}

      {focusedTask && (
        <View style={styles.focusedTaskContainer}>
          <Text style={styles.focusedTaskHeader}>
            Focusing on: {focusedTask.taskName}
          </Text>
          <Text style={styles.focusedTaskInfo}>
            Duration: {focusedTask.duration} mins
          </Text>
          <TouchableOpacity
            onPress={() => setFocusedTask(null)}
            style={styles.focusButton}
          >
            <Text>Stop Focusing</Text>
          </TouchableOpacity>
        </View>
      )}
      <View
        style={{
          height: 200,
        }}
      >

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#d8f3dc',
    paddingTop: 50,
    padding: 20,
    height: '100%',
  },
  header: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
  },
  input: {
    height: 100,
    borderColor: '#da627d',
    borderWidth: 1,
    marginTop: 15,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    color: '#2c3e50',
  },
  addButton: {
    backgroundColor: '#081c15',
    padding: 20,
    marginTop: 20,
    borderRadius: 99,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
  },
  taskDetails: {
    flex: 1,
  },
  taskName: {
    fontSize: 18,
    color: '#2c3e50',
  },
  taskInfo: {
    color: '#2c3e50',
  },
  taskActions: {
    flexDirection: 'row',
  },
  focusButton: {
    backgroundColor: '#1abc9c',
    padding: 5,
    borderRadius: 5,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
  },
  emptyListText: {
    color: '#2c3e50',
    textAlign: 'center',
    marginTop: 20,
  },
  focusedTaskContainer: {
    backgroundColor: '#e9ecef',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
  },
  focusedTaskHeader: {
    fontSize: 24,
    color: '#2c3e50',
    marginBottom: 10,
  },
  focusedTaskInfo: {
    fontSize: 18,
    color: '#2c3e50',
  },
  subHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 20,
  },
  slider: {
    width: '100%',
    height: 40,
    marginTop: 10,
  },
});
