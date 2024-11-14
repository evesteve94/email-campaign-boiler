// src/components/Header.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const Header: React.FC = () => {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      setIsLoggedIn(false);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header data-testid="header" className="bg-blue-600 text-white p-4 w-full">
      <div className="container mx-auto">
        <nav className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">Campaign Manager</Link>
          <ul className="flex space-x-4 items-center">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/">Bajs</Link></li>
            <li><Link to="/">Råtta</Link></li>

            <li><Link to="/campaigns">Campaigns</Link></li>
            {isLoggedIn && (
              <li>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded transition-colors"
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
