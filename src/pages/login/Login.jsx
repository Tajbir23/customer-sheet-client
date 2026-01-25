import React, { useState } from 'react';
import handleApi from '../../libs/handleAPi';
import { useNavigate } from 'react-router-dom';


const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await handleApi("/login", "POST", formData, navigate)

      if (response && response.token) {
        localStorage.setItem('token', response.token)
        setTimeout(() => {
          navigate('/')
        }, 0)
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (error) {
      setError('Login failed. Please check your credentials.');
      console.error('Login error:', error)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'var(--bg-deepest)' }}>

      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <div
          className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full animate-float"
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 60%)',
            filter: 'blur(80px)',
            animationDuration: '8s',
          }}
        />
        <div
          className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full animate-float"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, transparent 60%)',
            filter: 'blur(80px)',
            animationDuration: '10s',
            animationDelay: '1s',
          }}
        />
        <div
          className="absolute bottom-0 left-1/3 w-[700px] h-[700px] rounded-full animate-float"
          style={{
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, transparent 60%)',
            filter: 'blur(100px)',
            animationDuration: '12s',
            animationDelay: '2s',
          }}
        />

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md mx-4 animate-scale-in">
        <div
          className="relative rounded-2xl p-8 sm:p-10 overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, rgba(30, 30, 42, 0.9) 0%, rgba(18, 18, 26, 0.95) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)',
          }}>

          {/* Gradient Border Effect */}
          <div
            className="absolute inset-0 rounded-2xl opacity-50"
            style={{
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, transparent 50%, rgba(6, 182, 212, 0.1) 100%)',
              pointerEvents: 'none',
            }}
          />

          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl animate-glow"
              style={{
                background: 'linear-gradient(135deg, var(--accent-purple) 0%, var(--accent-blue) 100%)',
              }}>
              <span className="text-white font-bold text-3xl">CS</span>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Welcome Back
            </h2>
            <p className="text-[var(--text-tertiary)]">
              Sign in to your Customer Sheet account
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-[var(--error-bg)] border border-[var(--error)]/30 animate-fade-in">
              <p className="text-[var(--error-light)] text-sm text-center">{error}</p>
            </div>
          )}

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Username Field */}
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium text-[var(--text-secondary)]">
                Username
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-[var(--text-muted)] group-focus-within:text-[var(--accent-purple)] transition-colors font-bold pl-1">U</span>
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-xl transition-all duration-300 text-white placeholder-[var(--text-muted)]"
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                  }}
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--accent-purple)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.15)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--border-subtle)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-[var(--text-secondary)]">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-[var(--text-muted)] group-focus-within:text-[var(--accent-purple)] transition-colors font-bold pl-1">***</span>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-xl transition-all duration-300 text-white placeholder-[var(--text-muted)]"
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                  }}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--accent-purple)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.15)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--border-subtle)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="relative w-full py-4 px-6 rounded-xl font-semibold text-white overflow-hidden group transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(135deg, var(--accent-purple) 0%, var(--accent-blue) 100%)',
                boxShadow: '0 10px 30px -10px rgba(139, 92, 246, 0.5)',
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 15px 40px -10px rgba(139, 92, 246, 0.6)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 30px -10px rgba(139, 92, 246, 0.5)';
              }}
            >
              {/* Shimmer Effect */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: 'linear-gradient(90deg, transparent for0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
                  animation: 'shimmer 2s infinite',
                }}
              />

              <span className="relative flex items-center justify-center gap-3">
                {isLoading ? (
                  <>
                    <svg className="animate-rotate w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    <span className="font-bold">→</span>
                    Sign In
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-[var(--border-subtle)]">
            <p className="text-center text-sm text-[var(--text-muted)]">
              © 2024 Customer Sheet. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;