import React from 'react';
import './Loading.scss';

export interface LoadingProps {
  variant?: 'fullscreen' | 'inline' | 'skeleton-text' | 'skeleton-card' | 'skeleton-list';
  size?: 'small' | 'medium' | 'large';
  text?: string;
  className?: string;
  rows?: number; // For skeleton-list
}

export const Loading: React.FC<LoadingProps> = ({
  variant = 'inline',
  size = 'medium',
  text,
  className = '',
  rows = 3,
}) => {
  if (variant === 'fullscreen') {
    return (
      <div className={`loading-fullscreen ${className}`}>
        <div className={`loading-spinner loading-spinner--${size}`}>
          <div className="loading-spinner__circle"></div>
        </div>
        {text && <p className="loading-fullscreen__text">{text}</p>}
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`loading-inline ${className}`}>
        <div className={`loading-spinner loading-spinner--${size}`}>
          <div className="loading-spinner__circle"></div>
        </div>
        {text && <span className="loading-inline__text">{text}</span>}
      </div>
    );
  }

  if (variant === 'skeleton-text') {
    return (
      <div className={`loading-skeleton loading-skeleton--text ${className}`}>
        <div className="loading-skeleton__line loading-skeleton__line--full"></div>
        <div className="loading-skeleton__line loading-skeleton__line--full"></div>
        <div className="loading-skeleton__line loading-skeleton__line--half"></div>
      </div>
    );
  }

  if (variant === 'skeleton-card') {
    return (
      <div className={`loading-skeleton loading-skeleton--card ${className}`}>
        <div className="loading-skeleton__image"></div>
        <div className="loading-skeleton__content">
          <div className="loading-skeleton__line loading-skeleton__line--full"></div>
          <div className="loading-skeleton__line loading-skeleton__line--full"></div>
          <div className="loading-skeleton__line loading-skeleton__line--half"></div>
        </div>
      </div>
    );
  }

  if (variant === 'skeleton-list') {
    return (
      <div className={`loading-skeleton loading-skeleton--list ${className}`}>
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="loading-skeleton__list-item">
            <div className="loading-skeleton__avatar"></div>
            <div className="loading-skeleton__list-content">
              <div className="loading-skeleton__line loading-skeleton__line--full"></div>
              <div className="loading-skeleton__line loading-skeleton__line--half"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
};
