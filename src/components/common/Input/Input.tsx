import React, { useState, forwardRef } from 'react';
import './Input.scss';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  success?: boolean;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  clearable?: boolean;
  onClear?: () => void;
  containerClassName?: string;
  inputClassName?: string;
  size?: 'small' | 'medium' | 'large';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      success = false,
      prefixIcon,
      suffixIcon,
      clearable = false,
      onClear,
      type = 'text',
      disabled = false,
      value,
      containerClassName = '',
      inputClassName = '',
      size = 'medium',
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;
    const hasValue = value !== undefined && value !== '';

    const containerClasses = [
      'input-container',
      `input-container--${size}`,
      error && 'input-container--error',
      success && 'input-container--success',
      disabled && 'input-container--disabled',
      isFocused && 'input-container--focused',
      containerClassName,
    ]
      .filter(Boolean)
      .join(' ');

    const inputClasses = [
      'input',
      prefixIcon && 'input--has-prefix',
      (suffixIcon || isPassword || (clearable && hasValue)) && 'input--has-suffix',
      inputClassName,
    ]
      .filter(Boolean)
      .join(' ');

    const handleClear = () => {
      onClear?.();
    };

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    return (
      <div className={containerClasses}>
        {label && <label className="input-label">{label}</label>}

        <div className="input-wrapper">
          {prefixIcon && <span className="input-icon input-icon--prefix">{prefixIcon}</span>}

          <input
            ref={ref}
            type={inputType}
            className={inputClasses}
            disabled={disabled}
            value={value}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />

          <div className="input-suffix">
            {clearable && hasValue && !disabled && (
              <button
                type="button"
                className="input-clear"
                onClick={handleClear}
                tabIndex={-1}
              >
                ×
              </button>
            )}

            {isPassword && (
              <button
                type="button"
                className="input-password-toggle"
                onClick={togglePasswordVisibility}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="1" y1="1" x2="23" y2="23" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            )}

            {suffixIcon && !isPassword && (
              <span className="input-icon input-icon--suffix">{suffixIcon}</span>
            )}
          </div>
        </div>

        {error && <span className="input-error">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
