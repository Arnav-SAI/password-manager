import React, { useState, useEffect } from 'react';
import styles from '../../styles/Login.module.css';
import { supabase } from '../../utils/supabase';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Eye, EyeOff, LogOut, Plus, Search, Shield, ExternalLink } from 'lucide-react';

function Dashboard() {
  const [passwords, setPasswords] = useState([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const router = useRouter();

  // Fetch passwords from Supabase
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
        setError('Could not fetch passwords. Please try again later.');
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

  const togglePasswordVisibility = (id) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredPasswords = passwords.filter(
    (pass) =>
      pass.website.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pass.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const navigateToAdd = () => {
    router.push('/dashboard/add');
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.dashboardHeader}>
          <div className={styles.headerLeft}>
            <h2 className={styles.title}>
              <Shield className="mr-2 text-purple-400" size={28} />
              SecurePass
            </h2>
          </div>
          <div className={styles.headerRight}>
            <button
              onClick={handleLogout}
              className={styles.logoutButton}
            >
              <LogOut size={16} className="mr-2" /> Logout
            </button>
          </div>
        </div>

        <div className={styles.dashboardContent}>
          <div className={styles.actionBar}>
            <div className={styles.searchContainer}>
              <Search size={18} className="text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search passwords..."
                className={styles.searchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={navigateToAdd}
              className={styles.addButton}
            >
              <Plus size={16} className="mr-2" /> Add Password
            </button>
          </div>

          <div className={styles.savedPasswordsBox}>
            <h3 className={styles.sectionTitle}>Your Secure Passwords</h3>
            {error && <p className={styles.error}>{error}</p>}

            {passwords.length === 0 ? (
              <div className={styles.emptyState}>
                <Shield size={48} className="text-gray-500 mb-4" />
                <p>No passwords saved yet.</p>
                <p className="text-sm text-gray-400 mt-2">Add your first password to get started</p>
                <button
                  onClick={navigateToAdd}
                  className={styles.emptyStateButton}
                >
                  <Plus size={16} className="mr-2" /> Add Your First Password
                </button>
              </div>
            ) : (
              <>
                {filteredPasswords.length === 0 ? (
                  <p className="text-center py-6 text-gray-400">No results found for "{searchTerm}"</p>
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
                        {filteredPasswords.map((pass) => (
                          <tr key={pass.id}>
                            <td className={styles.websiteCell}>
                              <span className={styles.favicon}>
                                {pass.website.charAt(0).toUpperCase()}
                              </span>
                              {pass.website}
                            </td>
                            <td>{pass.username}</td>
                            <td className={styles.passwordCell}>
                              {visiblePasswords[pass.id] ? pass.password : '••••••••••'}
                              <button
                                className={styles.visibilityToggle}
                                onClick={() => togglePasswordVisibility(pass.id)}
                              >
                                {visiblePasswords[pass.id] ? (
                                  <EyeOff size={16} />
                                ) : (
                                  <Eye size={16} />
                                )}
                              </button>
                            </td>
                            <td className={styles.actionButtons}>
                              <button
                                className={styles.actionButton}
                                title="Copy Password"
                                onClick={() => {
                                  navigator.clipboard.writeText(pass.password);
                                  // In a real app, add a toast notification here
                                }}
                              >
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                >
                                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
                                </svg>
                              </button>
                              <a
                                href={
                                  pass.website.startsWith('http')
                                    ? pass.website
                                    : `https://${pass.website}`
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.actionButton}
                                title="Visit Website"
                              >
                                <ExternalLink size={16} />
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>

          <div className={styles.securityInfoBox}>
            <div className={styles.securityHeader}>
              <Shield size={18} className="text-purple-400 mr-2" />
              <h4>Password Security Tips</h4>
            </div>
            <ul className={styles.securityTips}>
              <li>Use a unique password for each website</li>
              <li>Include numbers, symbols, and mixed case letters</li>
              <li>Avoid using personal information in your passwords</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;