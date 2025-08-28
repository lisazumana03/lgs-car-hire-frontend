import Button from './Button.jsx';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../scripts/index.js';

function RegistrationForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    idNumber: '',
    dateOfBirth: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    licenseNumber: ''
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
    
    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match!');
      return;
    }
    
    setMessage('Creating account...');
    
    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        idNumber: formData.idNumber,
        dateOfBirth: formData.dateOfBirth,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        licenseNumber: formData.licenseNumber
      };

      const data = await registerUser(userData);
      setMessage('Account created successfully! Redirecting to login...');
      console.log('Registration response:', data);
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setMessage(`Registration failed: ${error.message}`);
      console.error('Registration error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h1>Create Account</h1>
      <div className="form-group">
        <label htmlFor="name">Full Name</label>
        <input
          type="text"
          placeholder="Enter Full Name"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

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

        <label htmlFor="idNumber">Identification Number</label>
        <input
          type="text"
          placeholder="Enter Identification Number"
          id="idNumber"
          name="idNumber"
          value={formData.idNumber}
          onChange={handleChange}
          required
        />

        <label htmlFor="dateOfBirth">Date of Birth</label>
        <input
          type="date"
          id="dateOfBirth"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
          required
        />

        <label htmlFor="phoneNumber">Phone Number</label>
        <input
          type="tel"
          placeholder="Enter Phone Number"
          id="phoneNumber"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
        />

        <label htmlFor="licenseNumber">Driver's License Number</label>
        <input
          type="text"
          placeholder="Enter Driver's License Number"
          id="licenseNumber"
          name="licenseNumber"
          value={formData.licenseNumber}
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

        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          type="password"
          placeholder="Confirm Password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        <Button />

        {message && (
          <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <label htmlFor="terms">
          <input type="checkbox" id="terms" name="terms" required />
          I agree to the terms and conditions
        </label>
        
        <div className="form-footer">
          <span>Already have an account? </span>
          <a href="/login" className="login-link">Login here</a>
        </div>
      </div>
    </form>
  );
}

export default RegistrationForm;
