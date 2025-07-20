import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { auth } from '../services/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'expo-router';

export default function Home() {
  const router = useRouter();
  const user = auth.currentUser;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/');
    } catch (error) {
      console.error('登出失败:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>欢迎回来！</Text>
      <Text style={styles.email}>{user?.email}</Text>
      
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>登出</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 