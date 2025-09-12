import React, { useState } from 'react';
import handleApi from '../../libs/handleAPi';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaSignInAlt } from 'react-icons/fa';

const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await handleApi("/login", "POST", formData, navigate)
      console.log('Login response:', response)
      
      if (response && response.token) {
        localStorage.setItem('token', response.token)
        // Force the navigation after setting token
        setTimeout(() => {
          navigate('/')
        }, 0)
      } else {
        console.error('Login failed:', response)
      }
    } catch (error) {
      console.error('Login error:', error)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="card w-full max-w-md">
        <div className="card-header text-center">
          <div className="w-16 h-16 bg-blue text-white rounded-lg flex items-center justify-center mx-auto mb-4">
            <FaUser className="text-2xl" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-700">
            Welcome Back
          </h2>
          <p className="text-gray-500 mt-2">
            Sign in to your account
          </p>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                <FaUser className="inline mr-2" />
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="form-input"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                <FaLock className="inline mr-2" />
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="form-input"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`btn btn-primary w-full py-3 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Signing in...
                </>
              ) : (
                <>
                  <FaSignInAlt className="mr-2" />
                  Sign In
                </>
              )}
            </button>
          </form>
        </div>

        <div className="card-footer text-center">
          <p className="text-xs text-gray-500">
            © 2024 Customer Sheet. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;