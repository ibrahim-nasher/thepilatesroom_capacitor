import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import { Button, Input, Toast } from '@components/common';
import { useAuthStore } from '@store';
import './RegisterPage.scss';

const RegisterPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setUser, setToken } = useAuthStore();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  // Toast state
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // First name validation
    if (!firstName.trim()) {
      newErrors.firstName = t('auth.errors.firstNameRequired');
    }
    
    // Last name validation
    if (!lastName.trim()) {
      newErrors.lastName = t('auth.errors.lastNameRequired');
    }
    
    // Email validation
    if (!email.trim()) {
      newErrors.email = t('auth.errors.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = t('auth.errors.emailInvalid');
    }
    
    // Phone validation
    if (!phone.trim()) {
      newErrors.phone = t('auth.errors.phoneRequired');
    } else if (!/^\+?[1-9]\d{9,14}$/.test(phone.replace(/\s/g, ''))) {
      newErrors.phone = t('auth.errors.phoneInvalid');
    }
    
    // Password validation
    if (!password) {
      newErrors.password = t('auth.errors.passwordRequired');
    } else if (password.length < 6) {
      newErrors.password = t('auth.errors.passwordTooShort');
    }
    
    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = t('auth.errors.confirmPasswordRequired');
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = t('auth.errors.passwordsDoNotMatch');
    }
    
    // Terms validation
    if (!acceptedTerms) {
      showToast(t('auth.errors.termsRequired'), 'error');
      return false;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToastMessage(message);
    setToastType(type);
    setToastOpen(true);
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Create user with Firebase
      const result = await FirebaseAuthentication.createUserWithEmailAndPassword({
        email: email.trim(),
        password,
      });
      
      if (result.user) {
        // Update user profile
        await FirebaseAuthentication.updateProfile({
          displayName: `${firstName.trim()} ${lastName.trim()}`,
        });
        
        // Send email verification
        await FirebaseAuthentication.sendEmailVerification();
        
        // Get ID token
        const tokenResult = await FirebaseAuthentication.getIdToken();
        
        // Update auth store
        setUser({
          id: result.user.uid,
          email: result.user.email || '',
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          phone: phone.trim(),
          language: 'en',
          notificationsEnabled: true,
        });
        
        setToken(tokenResult.token);
        
        showToast(t('auth.registerSuccess'), 'success');
        
        // Navigate to home after short delay
        setTimeout(() => {
          navigate('/home');
        }, 1500);
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Handle Firebase errors
      let errorMessage = t('auth.errors.registerFailed');
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = t('auth.errors.emailInUse');
        setErrors({ ...errors, email: errorMessage });
      } else if (error.code === 'auth/weak-password') {
        errorMessage = t('auth.errors.weakPassword');
        setErrors({ ...errors, password: errorMessage });
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = t('auth.errors.networkError');
      }
      
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <h1 className="register-title">{t('auth.register')}</h1>
          <p className="register-subtitle">{t('auth.createAccount')}</p>
        </div>
        
        <form className="register-form" onSubmit={(e) => e.preventDefault()}>
          <div className="name-row">
            <Input
              label={t('auth.firstName')}
              type="text"
              placeholder={t('auth.firstNamePlaceholder')}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              error={errors.firstName}
              disabled={isLoading}
              clearable
              onClear={() => setFirstName('')}
            />
            
            <Input
              label={t('auth.lastName')}
              type="text"
              placeholder={t('auth.lastNamePlaceholder')}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              error={errors.lastName}
              disabled={isLoading}
              clearable
              onClear={() => setLastName('')}
            />
          </div>
          
          <Input
            label={t('auth.email')}
            type="email"
            placeholder={t('auth.emailPlaceholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            autoComplete="email"
            disabled={isLoading}
            clearable
            onClear={() => setEmail('')}
          />
          
          <Input
            label={t('auth.phone')}
            type="tel"
            placeholder={t('auth.phonePlaceholder')}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            error={errors.phone}
            autoComplete="tel"
            disabled={isLoading}
            clearable
            onClear={() => setPhone('')}
          />
          
          <Input
            label={t('auth.password')}
            type="password"
            placeholder={t('auth.passwordPlaceholder')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            autoComplete="new-password"
            disabled={isLoading}
          />
          
          <Input
            label={t('auth.confirmPassword')}
            type="password"
            placeholder={t('auth.confirmPasswordPlaceholder')}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
            autoComplete="new-password"
            disabled={isLoading}
          />
          
          <label className="terms-checkbox">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              disabled={isLoading}
            />
            <span>
              {t('auth.acceptTerms')}{' '}
              <a href="/terms" target="_blank">{t('auth.termsAndConditions')}</a>
            </span>
          </label>
          
          <Button
            variant="primary"
            fullWidth
            onClick={handleRegister}
            loading={isLoading}
            disabled={isLoading}
          >
            {t('auth.register')}
          </Button>
        </form>
        
        <div className="register-footer">
          <p className="login-link">
            {t('auth.haveAccount')}{' '}
            <Link to="/login">{t('auth.login')}</Link>
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

export default RegisterPage;
