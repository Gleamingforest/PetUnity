import React, { useState } from 'react';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

const AuthNavigator: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  const switchToRegister = () => {
    setIsLogin(false);
  };

  const switchToLogin = () => {
    setIsLogin(true);
  };

  return isLogin ? (
    <LoginScreen onSwitchToRegister={switchToRegister} />
  ) : (
    <RegisterScreen onSwitchToLogin={switchToLogin} />
  );
};

export default AuthNavigator; 