import api from '@/api';
import React from 'react';
import { Link } from 'react-router-dom';


const handleLogout = () => {
  api.post('/auth/logout')
  console.log('User logged out');
};

const Header: React.FC = () => {
  return (
    <header className="bg-blue-600 text-white p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">Campaign Manager</Link>
        <ul className="flex space-x-4">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/campaigns">Campaigns</Link></li>
          <li><Link to="/register">Register</Link></li>
          <li><button onClick={handleLogout}>Logout</button></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;