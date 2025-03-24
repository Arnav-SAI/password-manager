import React from 'react';
import styles from '../styles/Login.module.css';
import LoginForm from '../components/LoginForm';

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.card} style={{ maxWidth: '400px' }}>
        <LoginForm />
      </div>
    </div>
  );
}