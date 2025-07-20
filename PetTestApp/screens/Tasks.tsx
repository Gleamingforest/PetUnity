import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { styles, colors } from '../constants/Styles';
import { useTasks } from '../contexts/TaskContext';

export default function Tasks() {
  const { tasks, addTask, toggleTask, deleteTask } = useTasks();
  const [newTask, setNewTask] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);

  const handleAddTask = async () => {
    if (newTask.trim()) {
      await addTask({
        title: newTask.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        icon: 'plus',
        iconBg: '#E3F2FD',
        iconColor: '#2196F3',
        completed: false,
      });
      setNewTask('');
      setIsAddingTask(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        {/* Header */}
        <View style={[styles.flexBetween, { marginBottom: 24, paddingHorizontal: 20 }]}>
          <Text style={[styles.title, { marginBottom: 0 }]}>任务</Text>
          <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              backgroundColor: colors.gray[100],
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => setIsAddingTask(true)}
          >
            <FontAwesome name="plus" size={16} color={colors.gray[500]} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={[
            styles.scrollViewContent,
            { paddingBottom: 100 }
          ]}
        >
          {/* Add Task Input */}
          {isAddingTask && (
            <View style={[styles.card, { marginBottom: 16 }]}>
              <TextInput
                style={{
                  height: 40,
                  borderWidth: 1,
                  borderColor: colors.gray[200],
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  marginBottom: 12,
                }}
                placeholder="输入新任务"
                value={newTask}
                onChangeText={setNewTask}
              />
              <View style={styles.flexBetween}>
                <TouchableOpacity
                  style={{
                    padding: 8,
                    backgroundColor: colors.gray[100],
                    borderRadius: 8,
                  }}
                  onPress={() => setIsAddingTask(false)}
                >
                  <Text style={{ color: colors.gray[500] }}>取消</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    padding: 8,
                    backgroundColor: colors.primary,
                    borderRadius: 8,
                  }}
                  onPress={handleAddTask}
                >
                  <Text style={{ color: colors.white }}>添加任务</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Tasks List */}
          <View style={[styles.card, { padding: 0 }]}>
            {tasks.map((task, index) => (
              <View 
                key={task.id} 
                style={[
                  styles.taskItem, 
                  index === tasks.length - 1 ? { borderBottomWidth: 0 } : null
                ]}
              >
                <View style={[styles.taskIconContainer, { backgroundColor: task.iconBg }]}>
                  <FontAwesome5 name={task.icon} size={16} color={task.iconColor} />
                </View>
                <View style={styles.taskContent}>
                  <Text style={[
                    styles.taskTitle,
                    task.completed && { textDecorationLine: 'line-through', color: colors.gray[400] }
                  ]}>
                    {task.title}
                  </Text>
                  <Text style={styles.taskTime}>{task.time}</Text>
                </View>
                <View style={styles.flexStart}>
                  <TouchableOpacity 
                    style={[
                      styles.taskCheckbox,
                      task.completed && { backgroundColor: colors.primary }
                    ]}
                    onPress={() => toggleTask(task.id)}
                  >
                    {task.completed && (
                      <FontAwesome name="check" size={12} color={colors.white} />
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ marginLeft: 12 }}
                    onPress={() => deleteTask(task.id)}
                  >
                    <FontAwesome name="trash" size={16} color={colors.gray[400]} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
} 