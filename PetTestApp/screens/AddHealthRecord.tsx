import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StatusBar, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../constants/Styles';

export default function AddHealthRecord() {
  const navigation = useNavigation();
  const [type, setType] = useState('');
  const [date, setDate] = useState('');
  const [status, setStatus] = useState('');

  const handleSave = () => {
    if (!type || !status) {
      Alert.alert('Error', 'Please fill in the type and status');
      return;
    }
    const newHealthRecord = {
      id: Date.now(),
      type,
      date,
      status,
    };
    navigation.navigate('ProfileMain', { newHealthRecord });
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={{ color: colors.primary, fontSize: 8 }}>{'< Back'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Health Record</Text>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.label}>Type *</Text>
        <TextInput
          style={styles.input}
          value={type}
          onChangeText={setType}
          placeholder="e.g. Rabies Vaccine"
        />
        <Text style={styles.label}>Date</Text>
        <TextInput
          style={styles.input}
          value={date}
          onChangeText={setDate}
          placeholder="e.g. 2024-03-20"
        />
        <Text style={styles.label}>Status *</Text>
        <TextInput
          style={styles.input}
          value={status}
          onChangeText={setStatus}
          placeholder="e.g. valid, normal, expired"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 4,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
  },
  saveButton: {
    padding: 4,
  },
  saveButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '500',
  },
  formContainer: {
    padding: 24,
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
}); 