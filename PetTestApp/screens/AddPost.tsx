import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AddPost() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>This is the Add Post page!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
}); 