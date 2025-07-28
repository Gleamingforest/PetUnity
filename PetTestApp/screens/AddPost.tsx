import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

export default function AddPost() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.text}>This is the Add Post page!</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 100, // 为底部导航栏留出空间
  },
  text: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
}); 