import React from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../components/RegisterForm';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const handleRegisterSuccess = () => {
    navigate('/');
  };

  return (
    <div className="form-container p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Register</h1>
      <RegisterForm onRegisterSuccess={handleRegisterSuccess} />
      <div className="mt-4 text-center">
        <p>Already have an account?</p>
        <button
          onClick={() => navigate('/')}
          className="btn btn-secondary mt-2"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default RegisterPage;