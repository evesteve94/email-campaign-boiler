import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // Import the configured Axios instance
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, password });
      // Handle successful login (e.g., store token, redirect)
      console.log('Logged in:', response.data);
      navigate('/campaigns');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">Welcome to Campaign Manager</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-1">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-1">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Log In
        </button>
        <Link to="/register" className="text-blue-600 hover:underline">
        <button>Register</button>
        </Link>
      </form>
    </div>
  );
};

export default HomePage;