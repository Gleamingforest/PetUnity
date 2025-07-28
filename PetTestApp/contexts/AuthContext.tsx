import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { friendService } from '../services/FriendService';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  image?: string;
}

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // 用户已登录
        const userData = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'User',
          email: firebaseUser.email || '',
          phone: firebaseUser.phoneNumber || undefined,
          image: firebaseUser.photoURL || undefined
        };
        
        setUser(userData);
        
        // 自动创建或更新用户资料到 Realtime Database
        try {
          // 使用安全更新方法，避免覆盖好友数据
          await friendService.safeUpdateUserProfile({
            name: userData.name,
            email: userData.email,
            avatar: userData.image
          });
        } catch (error) {
          console.error('Failed to create/update user profile:', error);
        }
      } else {
        // 用户未登录
        setUser(null);
      }
      setIsLoading(false);
    });

    // 清理监听器
    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await auth.signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, updateUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 