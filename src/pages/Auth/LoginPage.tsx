import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import { Button, Input, Toast } from '@components/common';
import { useAuthStore } from '@store';
import './LoginPage.scss';

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setUser, setToken } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Toast state
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const validateForm = (): boolean => {
    let isValid = true;
    
    // Reset errors
    setEmailError('');
    setPasswordError('');
    
    // Email validation
    if (!email.trim()) {
      setEmailError(t('auth.errors.emailRequired'));
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError(t('auth.errors.emailInvalid'));
      isValid = false;
    }
    
    // Password validation
    if (!password) {
      setPasswordError(t('auth.errors.passwordRequired'));
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError(t('auth.errors.passwordTooShort'));
      isValid = false;
    }
    
    return isValid;
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToastMessage(message);
    setToastType(type);
    setToastOpen(true);
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Firebase authentication
      const result = await FirebaseAuthentication.signInWithEmailAndPassword({
        email: email.trim(),
        password,
      });
      
      if (result.user) {
        // Get ID token
        const tokenResult = await FirebaseAuthentication.getIdToken();
        
        // Update auth store
        setUser({
          id: result.user.uid,
          email: result.user.email || '',
          firstName: result.user.displayName?.split(' ')[0] || '',
          lastName: result.user.displayName?.split(' ').slice(1).join(' ') || '',
          phone: result.user.phoneNumber || '',
          language: 'en',
          profileImage: result.user.photoUrl || undefined,
          notificationsEnabled: true,
        });
        
        setToken(tokenResult.token);
        
        showToast(t('auth.loginSuccess'), 'success');
        
        // Navigate to home after short delay
        setTimeout(() => {
          navigate('/home');
        }, 1000);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle Firebase errors
      let errorMessage = t('auth.errors.loginFailed');
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = t('auth.errors.userNotFound');
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = t('auth.errors.wrongPassword');
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = t('auth.errors.tooManyAttempts');
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = t('auth.errors.networkError');
      }
      
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1 className="login-title">{t('auth.login')}</h1>
          <p className="login-subtitle">{t('auth.welcomeBack')}</p>
        </div>
        
        <form className="login-form" onSubmit={(e) => e.preventDefault()}>
          <Input
            label={t('auth.email')}
            type="email"
            placeholder={t('auth.emailPlaceholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            error={emailError}
            autoComplete="email"
            disabled={isLoading}
            clearable
            onClear={() => setEmail('')}
          />
          
          <Input
            label={t('auth.password')}
            type="password"
            placeholder={t('auth.passwordPlaceholder')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            error={passwordError}
            autoComplete="current-password"
            disabled={isLoading}
          />
          
          <Link to="/forgot-password" className="forgot-password-link">
            {t('auth.forgotPassword')}
          </Link>
          
          <Button
            variant="primary"
            fullWidth
            onClick={handleLogin}
            loading={isLoading}
            disabled={isLoading}
          >
            {t('auth.login')}
          </Button>
        </form>
        
        <div className="login-footer">
          <p className="register-link">
            {t('auth.noAccount')}{' '}
            <Link to="/register">{t('auth.register')}</Link>
          </p>
        </div>
      </div>
      
      <Toast
        isOpen={toastOpen}
        onClose={() => setToastOpen(false)}
        message={toastMessage}
        type={toastType}
        duration={3000}
      />
    </div>
  );
};

export default LoginPage;
