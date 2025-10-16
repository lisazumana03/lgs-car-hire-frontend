import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css';
import LoginButton from '../../../components/common/Button/LoginButton.jsx';
import authService from '../../../services/auth.service';
import { useAuth } from '../../../context/AuthContext.jsx';

function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Logging in...');

    try {
      const response = await authService.login(formData.email, formData.password);
      console.log('Login response:', response);

      const { token, userId, email, name, role } = response;

      const userData = {
        userId,
        email,
        name,
        role
      };

      login(userData, token, formData.rememberMe);

      setMessage('Login successful! Redirecting...');

      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      setMessage(`Login failed: ${error.message}`);
      console.error('Login error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h1>Login</h1>
      <div className="login-form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          placeholder="Enter Email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          placeholder="Enter Password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <LoginButton onClick={handleSubmit} />

        {message && (
          <div className={`login-message ${message.includes('successful') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <div className="login-form-footer">
          <label htmlFor="rememberMe">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
            />
            Remember me
          </label>
          <a href="/register" className="login-forgot-password">Register</a>
        </div>
      </div>
    </form>
  );
}

export default LoginForm;
