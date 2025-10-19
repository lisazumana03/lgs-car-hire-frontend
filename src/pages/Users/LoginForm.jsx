import Button from './Button.jsx';
import { useState } from 'react';
import LoginButton from './LoginButton.jsx';
import { loginUser } from '../../scripts/index.js';
function LoginForm({ onLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Logging in...');
    
    try {
      const response = await loginUser(formData.email, formData.password);
      // Response structure: { token, user, tokenType }
      
      // Save JWT token and user data to localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('tokenType', response.tokenType || 'Bearer');
      localStorage.setItem('user', JSON.stringify(response.user));
      sessionStorage.setItem('user', JSON.stringify(response.user)); // For compatibility
      
      setMessage('Login successful! Redirecting...');
      console.log('Login successful:', response);
      
      // Call onLogin to update parent state and redirect
      setTimeout(() => {
        onLogin(response);
      }, 1000);
    } catch (error) {
      setMessage(`Login failed: ${error.message}`);
      console.error('Login error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h1>Login</h1>
      <div className="form-group">
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
          <div className={`message ${message.includes('successful') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <div className="form-footer">
          <label htmlFor="remember">
            <input type="checkbox" id="remember" name="remember" />
            Remember me
          </label>
          <a href="/register" className="forgot-password">Register</a>
        </div>
      </div>
    </form>
  );
}

export default LoginForm;
