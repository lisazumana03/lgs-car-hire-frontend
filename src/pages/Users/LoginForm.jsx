import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginButton from '../../components/ui/LoginButton';
import { login } from '../../services/authService';
import './LoginForm.css';

function LoginForm({ onLogin }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const userData = await login(formData.email, formData.password);

      if (rememberMe) {
        localStorage.setItem('rememberedEmail', formData.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      setMessage('Login successful! Redirecting...');
      console.log('Login response:', userData);

      setTimeout(() => {
        onLogin(userData);
      }, 1000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      setMessage(`Login failed: ${errorMessage}`);
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <button
        className="back-to-home-btn"
        onClick={() => navigate('/')}
        aria-label="Back to home"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 10H5M5 10L10 5M5 10L10 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back to Home
      </button>

      <div className="login-container">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p className="login-subtitle">Sign in to continue to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          {message && (
            <div className={`alert ${message.includes('successful') ? 'alert-success' : 'alert-error'}`} role="alert">
              {message}
            </div>
          )}

          <div className="form-field">
            <label htmlFor="email" className="login-form-label">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              id="email"
              name="email"
              className="login-form-input"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
              aria-required="true"
            />
          </div>

          <div className="form-field">
            <label htmlFor="password" className="login-form-label">
              Password
            </label>
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                id="password"
                name="password"
                className="login-form-input"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
                aria-required="true"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex="-1"
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 3L21 21M10.584 10.587C10.2087 10.9622 9.99775 11.4708 9.99756 12.0014C9.99737 12.5319 10.208 13.0407 10.583 13.416C10.958 13.7913 11.4666 14.0023 11.9972 14.0025C12.5277 14.0027 13.0365 13.792 13.412 13.417M17.357 17.349C15.726 18.449 13.942 19 12 19C7 19 3.6 15.4 2 12C2.905 10.024 4.235 8.387 5.637 7.349M9.363 5.365C10.2204 5.11972 11.1082 4.99684 12 5C17 5 20.4 8.6 22 12C21.393 13.255 20.617 14.388 19.721 15.345M14.12 14.12L9.88 9.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5C7 5 3.6 8.6 2 12C3.6 15.4 7 19 12 19C17 19 20.4 15.4 22 12C20.4 8.6 17 5 12 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                id="remember"
                name="remember"
                className="checkbox-input"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span className="checkbox-text">Remember me</span>
            </label>
            <a href="/forgot-password" className="link-primary">
              Forgot password?
            </a>
          </div>

          <LoginButton isLoading={isLoading} disabled={isLoading} />

          <div className="form-footer">
            <p className="footer-text">
              Don't have an account?{' '}
              <a href="/register" className="link-primary">
                Sign up
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
