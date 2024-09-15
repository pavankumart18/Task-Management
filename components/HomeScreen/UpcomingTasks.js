import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { db, collection, query, orderBy, onSnapshot } from '../../config/FireBaseConfigs'; // Adjust path as needed

export default function UpcomingTasks() {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Reference to the tasks collection
    const tasksCollection = collection(db, 'tasks');

    // Create a query to get tasks ordered by time
    const q = query(tasksCollection);

    // Subscribe to changes in the tasks collection
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTasks(tasksList);
    });
    // console.log(tasks);

    // Clean up the subscription on component unmount
    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Upcoming Tasks</Text>

      {/* Tasks List */}
      {tasks.length > 0 ? (
        tasks.map((task) => (
          <View
            key={task.id}
            style={styles.taskItem}
          >
            <View>
              <Text style={styles.taskName}>{task.taskName}</Text>
              <Text style={styles.taskTime}>{task.time}</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                router.push({
                  pathname: '/one-tasks',
                  params: task,
                });
              }}
              style={styles.arrowButton}
            >
              <Ionicons name="arrow-forward" size={24} color="white" />
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <Text style={styles.emptyText}>No upcoming tasks</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d8f3dc',
    padding: 20,
  },
  header: {
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
  arrowButton: {
    backgroundColor: '#40916c',
    padding: 10,
    borderRadius: 99,
  },
  emptyText: {
    color: '#2c3e50',
    textAlign: 'center',
    marginTop: 20,
  },
});
