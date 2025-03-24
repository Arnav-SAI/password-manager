import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, LogOut, Plus, Search, Shield, ExternalLink } from 'lucide-react';

// Mock data for demonstration
const mockPasswords = [
  { id: 1, website: 'gmail.com', username: 'user@example.com', password: 'password123' },
  { id: 2, website: 'github.com', username: 'devuser', password: 'securePass!42' },
  { id: 3, website: 'netflix.com', username: 'moviefan', password: 'show$time2024' }
];

function Dashboard() {
  const [passwords, setPasswords] = useState(mockPasswords);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [visiblePasswords, setVisiblePasswords] = useState({});

  // In a real app, this would fetch from your backend
  useEffect(() => {
    // Simulating data fetching
    const fetchPasswords = async () => {
      try {
        // This would be replaced with your actual API call
        setPasswords(mockPasswords);
      } catch (err) {
        setError("Could not fetch passwords. Please try again later.");
      }
    };
    
    fetchPasswords();
  }, []);

  const handleLogout = () => {
    // In a real app, this would handle logout logic
    console.log("Logging out...");
    // Redirect to login page would happen here
  };

  const togglePasswordVisibility = (id) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredPasswords = passwords.filter(pass => 
    pass.website.toLowerCase().includes(searchTerm.toLowerCase()) || 
    pass.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const navigateToAdd = () => {
    console.log("Navigating to add password page...");
    // In a real app, this would navigate to the add password page
  };

  return (
    <div className="flex justify-center items-start p-10 min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-6xl border border-gray-700">
        <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-700">
          <div className="flex items-center">
            <h2 className="text-2xl font-bold m-0 flex items-center">
              <Shield className="mr-2 text-purple-400" size={28} />
              SecurePass
            </h2>
          </div>
          <div>
            <button 
              onClick={handleLogout} 
              className="flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white border border-gray-600 rounded-lg text-sm font-medium transition-all duration-200"
            >
              <LogOut size={16} className="mr-2" /> Logout
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center mb-2">
            <div className="relative w-1/2">
              <Search size={18} className="text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search passwords..."
                className="w-full py-2 pl-10 pr-4 bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={navigateToAdd}
              className="flex items-center py-2 px-4 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-semibold transition-all duration-200"
            >
              <Plus size={16} className="mr-2" /> Add Password
            </button>
          </div>

          <div className="bg-gray-700 p-6 rounded-xl shadow-md border border-gray-600">
            <h3 className="text-xl font-semibold mb-6 text-white">Your Secure Passwords</h3>
            {error && <p className="text-red-400 bg-red-400 bg-opacity-10 p-3 rounded-lg mb-4 border-l-4 border-red-400">{error}</p>}
            
            {passwords.length === 0 ? (
              <div className="flex flex-col items-center py-10 text-center text-gray-300">
                <Shield size={48} className="text-gray-500 mb-4" />
                <p>No passwords saved yet.</p>
                <p className="text-sm text-gray-400 mt-2">Add your first password to get started</p>
                <button 
                  onClick={navigateToAdd}
                  className="flex items-center mt-6 py-2 px-4 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-semibold transition-all duration-200"
                >
                  <Plus size={16} className="mr-2" /> Add Your First Password
                </button>
              </div>
            ) : (
              <>
                {filteredPasswords.length === 0 ? (
                  <p className="text-center py-6 text-gray-400">No results found for "{searchTerm}"</p>
                ) : (
                  <div className="overflow-x-auto rounded-lg">
                    <table className="w-full text-sm">
                      <thead>
                        <tr>
                          <th className="bg-gray-800 bg-opacity-50 p-4 text-left text-gray-300 font-semibold uppercase text-xs tracking-wider">Website</th>
                          <th className="bg-gray-800 bg-opacity-50 p-4 text-left text-gray-300 font-semibold uppercase text-xs tracking-wider">Username</th>
                          <th className="bg-gray-800 bg-opacity-50 p-4 text-left text-gray-300 font-semibold uppercase text-xs tracking-wider">Password</th>
                          <th className="bg-gray-800 bg-opacity-50 p-4 text-left text-gray-300 font-semibold uppercase text-xs tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPasswords.map((pass) => (
                          <tr key={pass.id} className="border-b border-gray-700 hover:bg-gray-800 hover:bg-opacity-30">
                            <td className="p-4">
                              <div className="flex items-center">
                                <span className="flex items-center justify-center w-8 h-8 bg-purple-600 text-white rounded-md mr-3 font-bold text-sm">
                                  {pass.website.charAt(0).toUpperCase()}
                                </span>
                                {pass.website}
                              </div>
                            </td>
                            <td className="p-4">{pass.username}</td>
                            <td className="p-4">
                              <div className="flex items-center font-mono tracking-wide">
                                {visiblePasswords[pass.id] ? (
                                  pass.password
                                ) : (
                                  "••••••••••"
                                )}
                                <button 
                                  className="ml-2 p-1 text-gray-400 hover:text-white hover:bg-gray-600 rounded"
                                  onClick={() => togglePasswordVisibility(pass.id)}
                                >
                                  {visiblePasswords[pass.id] ? (
                                    <EyeOff size={16} />
                                  ) : (
                                    <Eye size={16} />
                                  )}
                                </button>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex gap-2">
                                <button 
                                  className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-600 rounded"
                                  title="Copy Password"
                                  onClick={() => {
                                    navigator.clipboard.writeText(pass.password);
                                    // Add toast notification in a real app
                                  }}
                                >
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
                                  </svg>
                                </button>
                                <a 
                                  href={pass.website.startsWith('http') ? pass.website : `https://${pass.website}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-600 rounded"
                                  title="Visit Website"
                                >
                                  <ExternalLink size={16} />
                                </a>
                              </div>
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

          <div className="bg-gray-700 p-6 rounded-xl shadow-md border border-gray-600">
            <div className="flex items-center mb-4">
              <Shield size={18} className="text-purple-400 mr-2" />
              <h4 className="text-lg font-semibold m-0 text-white">Password Security Tips</h4>
            </div>
            <ul className="pl-5 mb-0">
              <li className="mb-2 text-gray-300">Use a unique password for each website</li>
              <li className="mb-2 text-gray-300">Include numbers, symbols, and mixed case letters</li>
              <li className="text-gray-300">Avoid using personal information in your passwords</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;