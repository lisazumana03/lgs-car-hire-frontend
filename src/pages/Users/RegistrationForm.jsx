import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { signup } from '../../services/authService';

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
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

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

    if (!acceptedTerms) {
      setMessage('Please accept the terms and conditions');
      return;
    }

    setIsLoading(true);
    setMessage('');

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

      const data = await signup(userData);
      setMessage('Account created successfully! Redirecting...');
      console.log('Registration response:', data);

      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      if (error.response?.status === 409) {
        setMessage('Email already exists. Please use a different email.');
      } else {
        setMessage(`Registration failed: ${errorMessage}`);
      }
      console.error('Registration error:', error);
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

      <div className="login-container registration-container">
        <div className="login-header">
          <h1>Create Account</h1>
          <p className="login-subtitle">Join us to start renting your dream car</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          {message && (
            <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-error'}`} role="alert">
              {message}
            </div>
          )}

          <div className="form-field">
            <label htmlFor="name" className="form-label">Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              id="name"
              name="name"
              className="form-input"
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
              required
              aria-required="true"
            />
          </div>

          <div className="form-field">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              id="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
              aria-required="true"
            />
          </div>

          <div className="form-field">
            <label htmlFor="idNumber" className="form-label">ID Number</label>
            <input
              type="text"
              placeholder="Enter your ID number"
              id="idNumber"
              name="idNumber"
              className="form-input"
              value={formData.idNumber}
              onChange={handleChange}
              required
              aria-required="true"
            />
          </div>

          <div className="form-field">
            <label htmlFor="dateOfBirth" className="form-label">Date of Birth</label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              className="form-input"
              value={formData.dateOfBirth}
              onChange={handleChange}
              autoComplete="bday"
              required
              aria-required="true"
            />
          </div>

          <div className="form-field">
            <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
            <input
              type="tel"
              placeholder="+1 (555) 000-0000"
              id="phoneNumber"
              name="phoneNumber"
              className="form-input"
              value={formData.phoneNumber}
              onChange={handleChange}
              autoComplete="tel"
              required
              aria-required="true"
            />
          </div>

          <div className="form-field">
            <label htmlFor="licenseNumber" className="form-label">Driver's License Number</label>
            <input
              type="text"
              placeholder="Enter license number"
              id="licenseNumber"
              name="licenseNumber"
              className="form-input"
              value={formData.licenseNumber}
              onChange={handleChange}
              required
              aria-required="true"
            />
          </div>

          <div className="form-field">
            <label htmlFor="password" className="form-label">Password</label>
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                id="password"
                name="password"
                className="form-input"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
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

          <div className="form-field">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <div className="password-field">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-enter your password"
                id="confirmPassword"
                name="confirmPassword"
                className="form-input"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                required
                aria-required="true"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                tabIndex="-1"
              >
                {showConfirmPassword ? (
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

          <div className="form-options" style={{ marginTop: '8px' }}>
            <label className="checkbox-label">
              <input
                type="checkbox"
                id="terms"
                name="terms"
                className="checkbox-input"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
              />
              <span className="checkbox-text">I agree to the terms and conditions</span>
            </label>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading ? (
              <>
                <span className="btn-spinner"></span>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>

          <div className="form-footer">
            <p className="footer-text">
              Already have an account?{' '}
              <a href="/login" className="link-primary">
                Sign in
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegistrationForm;
