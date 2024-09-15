import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { db, collection, addDoc, deleteDoc, doc, onSnapshot } from '../../config/FireBaseConfigs'; // Adjust path as needed

export default function Notes() {
  const [notes, setNotes] = useState([]); // State to store notes
  const [noteText, setNoteText] = useState(''); // State to handle input text
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });

    // Fetch notes from Firestore
    const notesCollection = collection(db, 'notes');
    const unsubscribe = onSnapshot(notesCollection, (snapshot) => {
      const notesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNotes(notesData);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  // Function to add a note
  const addNote = async () => {
    if (noteText.trim() !== '') {
      try {
        await addDoc(collection(db, 'notes'), { text: noteText }); // Add note to Firestore
        setNoteText(''); // Clear the input field
      } catch (error) {
        console.error("Error adding note: ", error);
      }
    }
  };

  // Function to delete a note
  const deleteNote = async (id) => {
    try {
      await deleteDoc(doc(db, 'notes', id)); // Delete note from Firestore
    } catch (error) {
      console.error("Error deleting note: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notes</Text>

      {/* Input field to add a note */}
      <TextInput
        style={styles.input}
        placeholder="Enter your note"
        value={noteText}
        onChangeText={setNoteText} // Update input value
        multiline={true}
      />

      {/* Button to add the note */}
      <TouchableOpacity style={styles.addButton} onPress={addNote}>
        <Text style={styles.addButtonText}>Add Note</Text>
      </TouchableOpacity>

      {/* Display notes in a list */}
      <FlatList
        data={notes}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.noteItem}>
            {/* Note text */}
            <Text style={styles.noteText}>{item.text}</Text>

            {/* Delete button */}
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteNote(item.id)}
            >
              <Ionicons name="trash" size={24} color="white" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={() => (
          <Text style={styles.emptyListText}>
            No notes available
          </Text>
        )}
      />
      <View
        style={{
          marginBottom: 50,
        }}
      >

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d8f3dc',
    paddingTop: 50,
    padding: 20,
  },
  header: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
  },
  input: {
    height: 150,
    borderColor: '#2c3e50',
    borderWidth: 1,
    padding: 10,
    marginTop: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  addButton: {
    backgroundColor: '#2c3e50',
    padding: 20,
    borderRadius: 30,
    marginTop: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  noteItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
  },
  noteText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
    marginLeft: 10,
  },
  emptyListText: {
    color: '#2c3e50',
    marginTop: 20,
    textAlign: 'center',
  },
});
