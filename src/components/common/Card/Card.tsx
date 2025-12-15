import React from 'react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import './Card.scss';

export interface CardProps {
  children: React.ReactNode;
  onClick?: () => void;
  padding?: 'none' | 'small' | 'medium' | 'large';
  elevation?: 'none' | 'low' | 'medium' | 'high';
  variant?: 'default' | 'outlined';
  className?: string;
  hapticFeedback?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  onClick,
  padding = 'medium',
  elevation = 'medium',
  variant = 'default',
  className = '',
  hapticFeedback = true,
}) => {
  const isClickable = !!onClick;

  const handleClick = async () => {
    if (!onClick) return;

    // Haptic feedback for clickable cards
    if (hapticFeedback) {
      try {
        await Haptics.impact({ style: ImpactStyle.Light });
      } catch (error) {
        console.debug('Haptics not available');
      }
    }

    onClick();
  };

  const classNames = [
    'card',
    `card--padding-${padding}`,
    `card--elevation-${elevation}`,
    `card--${variant}`,
    isClickable && 'card--clickable',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const CardElement = isClickable ? 'button' : 'div';

  return (
    <CardElement
      className={classNames}
      onClick={isClickable ? handleClick : undefined}
      type={isClickable ? 'button' : undefined}
    >
      {children}
    </CardElement>
  );
};
