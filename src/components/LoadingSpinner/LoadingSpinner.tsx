import React from 'react';
import styles from './LoadingSpinner.module.scss';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Загрузка...' }) => {
  return (
    <div className={styles.spinnerContainer}>
      <div className={styles.spinner}>
        <div className={styles.dot1}></div>
        <div className={styles.dot2}></div>
        <div className={styles.dot3}></div>
      </div>
      <p className={styles.message}>{message}</p>
    </div>
  );
};

export default LoadingSpinner;