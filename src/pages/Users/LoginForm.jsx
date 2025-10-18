import Button from './Button.jsx';
import { useState } from 'react';
import LoginButton from './LoginButton.jsx';
import { loginUser } from '../../scripts/index.js';
function LoginForm({ onLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'CUSTOMER' // Default role
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
      const userData = await loginUser(formData.email, formData.password, formData.role);
      setMessage('Login successful! Redirecting...');
      console.log('Login response:', userData);
      
      // Call onLogin to update parent state and redirect
      setTimeout(() => {
        onLogin(userData);
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

        <label htmlFor="role">Role</label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '15px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px'
          }}
        >
          <option value="CUSTOMER">Customer</option>
          <option value="CAR_OWNER">Car Owner</option>
          <option value="ADMIN">Administrator</option>
        </select>

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
