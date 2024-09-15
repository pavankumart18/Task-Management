import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { db } from '../../config/FireBaseConfigs'; // Adjust the path as needed
import { useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Timestamp } from 'firebase/firestore';
import { getDocs } from 'firebase/firestore';
import { query, collection, where, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { getDoc } from 'firebase/firestore';

export default function OneTasks() {
  const task = useLocalSearchParams(); // Get the task ID from the search params
  const [inputs, setInputs] = useState([]);
  const [thoughts, setThoughts] = useState('');
  const [howYouFinished, setHowYouFinished] = useState('');
  const navigation = useNavigation();

  const GetTask = async () => {
    if (!task?.id) {
      console.log('Task ID is not available');
      return;
    }
  
    try {
      const taskDocRef = doc(db, 'tasks', task.id);
      const docSnapshot = await getDoc(taskDocRef);
  
      if (docSnapshot.exists()) {
        const taskData = docSnapshot.data();
        setInputs(taskData.inputs || []); // Update state with existing inputs or an empty array
      } else {
        console.log('No task data found');
      }
    } catch (error) {
      console.error('Error fetching task data: ', error);
    }
  };
  

  useEffect(() => {
    // console.log('Task ID: ', task?.id);
    GetTask();
  }, []);

  const addInput = async () => {
    if (thoughts.trim() === '' || howYouFinished.trim() === '') {
      alert('Please fill in both fields');
      return;
    }

    try {
      const taskDocRef = doc(db, 'tasks', task.id);
      await updateDoc(taskDocRef, {
        inputs: arrayUnion({
          thoughts,
          howYouFinished,
          timestamp: Timestamp.now(), // Use Firestore Timestamp
        })
      });

      // Update local state
      setInputs(prev => [
        ...prev,
        { thoughts, howYouFinished, timestamp: Timestamp.now() }
      ]);
      setThoughts('');
      setHowYouFinished('');
    } catch (error) {
      console.error("Error updating task: ", error);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      {task ? (
        <>
          <Text style={styles.header}>{task?.taskName}</Text>

          {/* Display existing inputs */}
          {inputs.length > 0 ? (
            inputs.map((item, index) => (
              <View key={index} style={styles.inputItem}>
                <Text style={styles.inputText}>Thoughts: {item.thoughts}</Text>
                <Text style={styles.inputText}>How you finished: {item.howYouFinished}</Text>
                <Text style={styles.inputText}>
                  {item.timestamp?.toDate().toLocaleString()}
                </Text>
              </View>
            ))
          ) : (
            <Text>No inputs available</Text>
          )}

          {/* Input fields */}
          <TextInput
            placeholder="What's your thoughts?"
            value={thoughts}
            onChangeText={setThoughts}
            style={styles.textInput}
          />
          <TextInput
            placeholder="How did you finish?"
            value={howYouFinished}
            onChangeText={setHowYouFinished}
            style={styles.textInput}
          />
          <TouchableOpacity onPress={addInput} style={styles.addButton}>
            <Text style={styles.addButtonText}>Add Input</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text>Loading task...</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#d8f3dc',
  },
  backButton: {
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputItem: {
    marginBottom: 10,
  },
  inputText: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#342',
    padding: 20,
    marginBottom: 10,
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: '#342',
    padding: 20,
    borderRadius: 99,
  },
  addButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
});
