import React, { useState, useEffect } from 'react';
import styles from '../../styles/Login.module.css';
import { supabase } from '../../utils/supabase';
import { useRouter } from 'next/router';
import Link from 'next/link';

function Dashboard() {
  const [passwords, setPasswords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visiblePasswords, setVisiblePasswords] = useState({}); // State to track visibility of each password
  const router = useRouter();

  useEffect(() => {
    fetchPasswords();
  }, []);

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
      console.error('Error fetching passwords:', error);
    } else {
      setPasswords(data);
      // Initialize visibility state for each password as hidden
      const initialVisibility = {};
      data.forEach((password) => {
        initialVisibility[password.id] = false;
      });
      setVisiblePasswords(initialVisibility);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/');
      return;
    }

    const { error } = await supabase
      .from('passwords')
      .delete()
      .eq('id', id)
      .eq('user_id', session.user.id);

    if (error) {
      console.error('Error deleting password:', error);
    } else {
      setPasswords(passwords.filter((password) => password.id !== id));
      // Remove the visibility state for the deleted password
      setVisiblePasswords((prev) => {
        const newVisibility = { ...prev };
        delete newVisibility[id];
        return newVisibility;
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  // Toggle password visibility for a specific password
  const togglePasswordVisibility = (id) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.card} style={{ maxWidth: '800px' }}>
        <div className={styles.dashboardHeader}>
          <div className={styles.headerLeft}>
            <h2 className={styles.logo}>Password Manager</h2>
          </div>
          <div className={styles.headerRight}>
            <button onClick={handleLogout} className={styles.logoutButton}>
              Logout
            </button>
          </div>
        </div>

        <div className={styles.dashboardContent}>
          <div>
            <div className={styles.actionBar}>
              <Link href="/dashboard/add" className={styles.addButton}>
                Add Password
              </Link>
            </div>

            <div className={styles.savedPasswordsBox}>
              <h3 className={styles.sectionTitle}>Saved Passwords</h3>
              {passwords.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>No passwords saved yet.</p>
                  <Link href="/dashboard/add" className={styles.emptyStateButton}>
                    Add Your First Password
                  </Link>
                </div>
              ) : (
                <div className={styles.tableContainer}>
                  <table className={styles.passwordTable}>
                    <thead>
                      <tr>
                        <th>Website</th>
                        <th>Username</th>
                        <th>Password</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {passwords.map((password) => (
                        <tr key={password.id}>
                          <td>
                            <div className={styles.websiteCell}>
                              <span className={styles.favicon}>
                                {password.website.charAt(0).toUpperCase()}
                              </span>
                              {password.website}
                            </div>
                          </td>
                          <td>{password.username}</td>
                          <td>
                            <div className={styles.passwordCell}>
                              {visiblePasswords[password.id] ? (
                                password.password
                              ) : (
                                '••••••••'
                              )}
                              <button
                                onClick={() => togglePasswordVisibility(password.id)}
                                className={styles.visibilityToggle}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  {visiblePasswords[password.id] ? (
                                    // Eye-off icon (when password is visible)
                                    <>
                                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                      <line x1="1" y1="1" x2="23" y2="23"></line>
                                    </>
                                  ) : (
                                    // Eye icon (when password is hidden)
                                    <>
                                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                      <circle cx="12" cy="12" r="3"></circle>
                                    </>
                                  )}
                                </svg>
                              </button>
                            </div>
                          </td>
                          <td>
                            <div className={styles.actionButtons}>
                              <button className={styles.actionButton}>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDelete(password.id)}
                                className={styles.actionButton}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <polyline points="3 6 5 6 21 6"></polyline>
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                  <line x1="10" y1="11" x2="10" y2="17"></line>
                                  <line x1="14" y1="11" x2="14" y2="17"></line>
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          <div className={styles.securityInfoBox}>
            <div className={styles.securityHeader}>
              <h4>Security Tips</h4>
            </div>
            <ul className={styles.securityTips}>
              <li>Use a unique password for each account.</li>
              <li>Include a mix of letters, numbers, and symbols.</li>
              <li>Avoid using personal information in passwords.</li>
              <li>Enable two-factor authentication where possible.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
