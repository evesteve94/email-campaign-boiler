import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/LoginForm';

const HomePage: React.FC = () => {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <div className="form-container p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Welcome to Campaign Manager</h1>
      {isLoggedIn ? (
        <div className="text-center">
          <p className="mb-4">You are logged in!</p>
          <button
            onClick={() => navigate('/campaigns')}
            className="btn btn-primary"
          >
            Go to Campaigns
          </button>
        </div>
      ) : (
        <div>
          <LoginForm onLoginSuccess={handleLoginSuccess} />
          <div className="mt-4 text-center">
            <p>Don't have an account?</p>
            <button
              onClick={() => navigate('/register')}
              className="btn btn-secondary mt-2"
            >
              Register
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
