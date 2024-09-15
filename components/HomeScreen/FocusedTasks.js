import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/FireBaseConfigs'; // Adjust the import as needed

export default function FocusedTasks() {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasksCollection = collection(db, 'tasks');
        const tasksQuerySnapshot = await getDocs(tasksCollection);
        const tasksList = tasksQuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTasks(tasksList);
      } catch (error) {
        console.error('Error fetching tasks: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Focused Tasks</Text>
    { tasks.length > 0 ? (
        tasks.map((task) => (
          <View key={task.id} style={styles.taskItem}>
            <View>
              <Text style={styles.taskName}>{task.taskName || 'Unnamed Task'}</Text>
              <Text style={styles.taskTime}>{task.time || 'No Time Set'}</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                router.push({
                  pathname: '/timed-task',
                  params: task,
                });
              }}
              style={styles.startButton}
            >
              <Text style={styles.startButtonText}>Start</Text>
              <Ionicons name="time" size={24} color="white" />
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <Text style={styles.emptyText}>No tasks with duration available.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2c3e50',
  },
  taskItem: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  taskTime: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  taskDuration: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 5,
  },
  startButton: {
    backgroundColor: '#40916c',
    padding: 10,
    borderRadius: 99,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  startButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyText: {
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 20,
  },
  loadingText: {
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
  },
});
