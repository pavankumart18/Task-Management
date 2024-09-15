import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { db, collection, addDoc } from '../../config/FireBaseConfigs'; // Adjust the path as needed

export default function Add() {
  const router = useRouter();
  const [taskName, setTaskName] = useState('');

  // Function to add a task to Firestore
  const addTaskToFirestore = async () => {
    if (taskName.trim()) {
      try {
        const newTask = {
          taskName: taskName,
          createdAt: new Date(),
        };
        await addDoc(collection(db, 'tasks'), newTask);
        setTaskName(''); // Clear the input field
        alert('Task added successfully!');
      } catch (error) {
        console.error("Error adding task: ", error);
        alert('Failed to add task. Please try again.');
      }
    } else {
      alert('Task name cannot be empty.');
    }
  };

  return (
    <View
      style={{
        backgroundColor: '#fff',
        padding: 20,
        marginTop: 20,
        borderRadius: 15,
        borderColor: '#b7e4c7',
        borderWidth: 1,
        opacity: 0.9,
      }}
    >
      <TextInput
        placeholder="Add an immediate task"
        maxLength={200}
        multiline={true}
        height={150}
        value={taskName}
        onChangeText={setTaskName}
        style={{
          borderWidth: 1,
          padding: 20,
          marginVertical: 5,
          borderRadius: 10,
          borderColor: '#da627d',
          backgroundColor: '#fff',
        }}
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          marginVertical: 10,
          gap: 10,
        }}
      >
        <TouchableOpacity
          onPress={addTaskToFirestore} // Add task to Firestore
          style={{
            backgroundColor: '#081c15',
            padding: 20,
            borderRadius: 10,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Add Task</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            router.push({
              pathname: '/add-task',
              params: {
                task: taskName,
              },
            });
          }}
          style={{
            backgroundColor: '#5a189a',
            padding: 20,
            borderRadius: 10,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Customize your task</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
