import React, { useState, useEffect } from 'react';
import styles from '../../styles/Login.module.css';
import { supabase } from '../../utils/supabase';
import { useRouter } from 'next/router';
import Link from 'next/link';

function Dashboard() {
  const [passwords, setPasswords] = useState([]);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchPasswords = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/');
        return;
      }

      const { data, error } = await supabase
        .from('passwords')
        .select('*')
        .eq('user_id', session.user.id);

      if (error) {
        setError(error.message);
        return;
      }

      setPasswords(data || []);
    };

    fetchPasswords();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <div className={styles.container}>
      <div className={styles.card} style={{ maxWidth: '800px' }}>
        <h2 className={styles.title}>Dashboard</h2>
        <button onClick={handleLogout} className={styles.button} style={{ marginBottom: '20px' }}>
          Logout
        </button>
        <Link href="/dashboard/add" className={styles.navButton}>
          Go to Add Password
        </Link>
        <div className={styles.savedPasswordsBox}>
          <h3>Your Passwords</h3>
          {error && <p className={styles.error}>{error}</p>}
          {passwords.length === 0 ? (
            <p style={{ color: '#ffffff' }}>No passwords saved yet.</p>
          ) : (
            <table className={styles.passwordTable}>
              <thead>
                <tr>
                  <th>Website</th>
                  <th>Username</th>
                  <th>Password</th>
                </tr>
              </thead>
              <tbody>
                {passwords.map((pass) => (
                  <tr key={pass.id}>
                    <td>{pass.website}</td>
                    <td>{pass.username}</td>
                    <td>{pass.password}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;