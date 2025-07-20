import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { auth } from '../src/services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter, useSegments } from 'expo-router';
import { Tabs } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { styles, colors } from '../src/constants/Styles';

export default function Layout() {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const inAuthGroup = segments[0] === '(auth)';

      if (!user && !inAuthGroup) {
        // 如果用户未登录且不在认证组中，重定向到登录页面
        router.replace('/');
      } else if (user && inAuthGroup) {
        // 如果用户已登录且在认证组中，重定向到主页
        router.replace('/home');
      }
    });

    return () => unsubscribe();
  }, [segments]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: 'white' },
      }}
    >
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.gray[500],
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '500',
            marginBottom: 5
          },
          tabBarIconStyle: {
            marginTop: 5
          }
        }}
      >      
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <FontAwesome5 name="home" color={color} size={size-2} />
            ),
          }}
        />
        
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size }) => (
              <FontAwesome5 name="paw" color={color} size={size-2} />
            ),
          }}
        />
        
        <Tabs.Screen
          name="social"
          options={{
            title: "Social",
            tabBarIcon: ({ color, size }) => (
              <FontAwesome5 name="users" color={color} size={size-2} />
            ),
          }}
        />
        
        <Tabs.Screen
          name="tasks"
          options={{
            title: "Tasks",
            tabBarIcon: ({ color, size }) => (
              <FontAwesome5 name="tasks" color={color} size={size-2} />
            ),
          }}
        />
        
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            tabBarIcon: ({ color, size }) => (
              <FontAwesome5 name="cog" color={color} size={size-2} />
            ),
          }}
        />
      </Tabs>
    </Stack>
  );
} 