import React, { useState } from 'react';
import styles from '../../styles/Login.module.css';
import { supabase } from '../../utils/supabase';
import { useRouter } from 'next/router';
import Link from 'next/link';

function AddPassword() {
  const [website, setWebsite] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleAddPassword = async (e) => {
    e.preventDefault();
    setError('');

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/');
      return;
    }

    const { data, error } = await supabase
      .from('passwords')
      .insert([
        { user_id: session.user.id, website, username, password },
      ])
      .select();

    if (error) {
      setError(error.message);
      return;
    }

    // Redirect to the dashboard after adding the password
    router.push('/dashboard');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <div className={styles.container}>
      <div className={styles.card} style={{ maxWidth: '600px' }}>
        <h2 className={styles.title}>Add New Password</h2>
        <button onClick={handleLogout} className={styles.button} style={{ marginBottom: '20px' }}>
          Logout
        </button>
        <Link href="/dashboard" className={styles.navButton}>
          Back to Dashboard
        </Link>
        <div className={styles.addPasswordBox}>
          <h3>Add New Password</h3>
          {error && <p className={styles.error}>{error}</p>}
          <form onSubmit={handleAddPassword}>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="website">Website</label>
              <input
                type="text"
                id="website"
                className={styles.input}
                placeholder="e.g., example.com"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                className={styles.input}
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="password">Password</label>
              <input
                type="text"
                id="password"
                className={styles.input}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className={styles.button}>Add Password</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddPassword;