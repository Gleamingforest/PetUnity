import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { AppRegistry } from 'react-native';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { TaskProvider } from './contexts/TaskContext';
import AuthNavigator from './components/AuthNavigator';
import LoadingScreen from './components/LoadingScreen';
import AppNavigator from './navigation/AppNavigator';
import { NavigationContainer } from '@react-navigation/native';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <StatusBar style="auto" />
      {user ? <AppNavigator /> : <AuthNavigator />}
    </>
  );
};

function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
          <TaskProvider>
            <NavigationContainer>
              <AppContent />
            </NavigationContainer>
          </TaskProvider>
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}

AppRegistry.registerComponent('main', () => App);

export default App;
