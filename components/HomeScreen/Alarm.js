import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import moment from 'moment';
import { Audio } from 'expo-av';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../config/FireBaseConfigs'; // Adjust the import as needed
import { useRouter } from 'expo-router';
export default function Alarm({task}) {
  const [timeLeft, setTimeLeft] = useState(task?.duration*60 || 600);
  const [progress, setProgress] = useState(100); 
  const [isRunning, setIsRunning] = useState(false); 
  const [initialTime, setInitialTime] = useState(600); 
  const [customTime, setCustomTime] = useState('10'); 
  const timerRef = useRef(null);
  const soundRef = useRef(null); 
  const router = useRouter();

  const playAlarmSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/alarm.wav') 
      );
      soundRef.current = sound;
      await sound.playAsync();
    } catch (error) {
      console.log('Error loading sound:', error);
    }
  };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
        setProgress((timeLeft / initialTime) * 100); 
      }, 1000);
    } else if (timeLeft === 0) {
      playAlarmSound();
      setIsRunning(false); 
    }

    return () => clearTimeout(timerRef.current); 
  }, [timeLeft, isRunning]);

  const formatTime = (seconds) => {
    return moment.utc(seconds * 1000).format('mm:ss');
  };

  const startTimer = () => {
    setIsRunning(true);
  };

  const stopTimer = () => {
    setIsRunning(false);
    if (soundRef.current) {
      soundRef.current.stopAsync(); 
    }
  };

  const resetTimer = () => {
    setTimeLeft(initialTime); 
    setProgress(100); 
    setIsRunning(false); 
    if (soundRef.current) {
      soundRef.current.stopAsync(); 
    }
  };

  const customizeTimer = () => {
    const timeInSeconds = parseInt(customTime) * 60;
    setInitialTime(timeInSeconds);
    setTimeLeft(timeInSeconds);
    setProgress(100);
  };

  const deleteTask = async () => {
    try {
      await deleteDoc(doc(db, 'tasks', task.id));
      router.push('home');

    } catch (error) {
      console.error('Error deleting task: ', error);
    }
  }


  return (
    <View style={styles.container}>
      
      <AnimatedCircularProgress
        size={200} 
        width={10} 
        fill={progress} 
        rotation={170} 
        tintColor="#00e0ff" 
        backgroundColor="#3d5875" 
      >
        {() => (
          <Text style={styles.timerText}>
            {formatTime(timeLeft)}
          </Text>
        )}
      </AnimatedCircularProgress>
      {/* Control Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={startTimer} style={styles.button}>
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={stopTimer} style={styles.button}>
          <Text style={[styles.buttonText, { color: 'red' }]}>Stop</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={resetTimer} style={styles.button}>
          <Text style={[styles.buttonText, { color: 'blue' }]}>Reset</Text>
        </TouchableOpacity>
      </View>

      {/* Timer Customization */}
      <View style={styles.customizationContainer}>
        <Text style={styles.customizeLabel}>Customize Timer (Minutes):</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={customTime}
          onChangeText={(text) => setCustomTime(text)}
        />
        <TouchableOpacity onPress={customizeTimer} style={styles.customizeButton}>
          <Text style={{ color: 'purple' }}>Set Timer</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity onPress={deleteTask} style={styles.customizeButton}>
          <Text style={{ color: 'purple' }}>Delete Task</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
  },
  timerText: {
    fontSize: 48,
    color: 'black',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 20,
    width: '80%',
  },
  button: {
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
    minWidth: 80,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: 'black',
  },
  customizationContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  customizeLabel: {
    marginBottom: 10,
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: 100,
    textAlign: 'center',
    marginBottom: 10,
    borderRadius: 5,
  },
  customizeButton: {
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
});
