import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import { Button, Input, Toast } from '@components/common';
import './ForgotPasswordPage.scss';

const ForgotPasswordPage: React.FC = () => {
  const { t } = useTranslation();
  
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  
  // Toast state
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const validateForm = (): boolean => {
    setEmailError('');
    
    if (!email.trim()) {
      setEmailError(t('auth.errors.emailRequired'));
      return false;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError(t('auth.errors.emailInvalid'));
      return false;
    }
    
    return true;
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToastMessage(message);
    setToastType(type);
    setToastOpen(true);
  };

  const handleSendResetLink = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      await FirebaseAuthentication.sendPasswordResetEmail({
        email: email.trim(),
      });
      
      setEmailSent(true);
      showToast(t('auth.resetEmailSent'), 'success');
    } catch (error: any) {
      console.error('Password reset error:', error);
      
      let errorMessage = t('auth.errors.resetFailed');
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = t('auth.errors.userNotFound');
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
      handleSendResetLink();
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        <div className="forgot-password-header">
          <h1 className="forgot-password-title">{t('auth.forgotPassword')}</h1>
          <p className="forgot-password-subtitle">
            {emailSent
              ? t('auth.resetEmailSentDescription')
              : t('auth.forgotPasswordDescription')}
          </p>
        </div>
        
        {!emailSent ? (
          <>
            <form className="forgot-password-form" onSubmit={(e) => e.preventDefault()}>
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
              
              <Button
                variant="primary"
                fullWidth
                onClick={handleSendResetLink}
                loading={isLoading}
                disabled={isLoading}
              >
                {t('auth.sendResetLink')}
              </Button>
            </form>
            
            <div className="forgot-password-footer">
              <Link to="/login" className="back-to-login-link">
                ← {t('auth.backToLogin')}
              </Link>
            </div>
          </>
        ) : (
          <div className="email-sent-success">
            <div className="success-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="22 4 12 14.01 9 11.01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            
            <p className="success-message">{t('auth.checkEmailInbox')}</p>
            
            <div className="email-sent-actions">
              <Button variant="outline" fullWidth onClick={() => setEmailSent(false)}>
                {t('auth.resendEmail')}
              </Button>
              
              <Link to="/login">
                <Button variant="primary" fullWidth>
                  {t('auth.backToLogin')}
                </Button>
              </Link>
            </div>
          </div>
        )}
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

export default ForgotPasswordPage;
