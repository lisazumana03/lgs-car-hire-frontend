import Button from './Button.jsx';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../scripts/index.js';

function RegistrationForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    idNumber: '',
    dateOfBirth: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    role: 'CUSTOMER' // Default role
  });
  const [message, setMessage] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({
    isStrong: false,
    requirements: {
      minLength: false,
      hasUpperCase: false,
      hasLowerCase: false,
      hasNumbers: false,
      hasSpecialChar: false,
    },
    score: 0
  });
  const [idValidation, setIdValidation] = useState({
    isValid: false,
    message: '',
    gender: '',
    citizenship: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });

    // Auto-validate ID number and extract DOB
    if (name === 'idNumber') {
      validateAndExtractID(value);
    }
  };

  // Validate South African ID Number and extract date of birth
  // const validateAndExtractID = (idNumber) => {
  //   // Remove any spaces or special characters
  //   const cleanID = idNumber.replace(/\s+/g, '');
  //
  //   // Basic validation - SA ID must be 13 digits
  //   if (cleanID.length !== 13 || !/^\d+$/.test(cleanID)) {
  //     setIdValidation({
  //       isValid: false,
  //       message: 'ID must be exactly 13 digits',
  //       gender: '',
  //       citizenship: ''
  //     });
  //     return;
  //   }
  //
  //   // Extract date parts (YYMMDD format)
  //   const yearPart = cleanID.substring(0, 2);
  //   const monthPart = cleanID.substring(2, 4);
  //   const dayPart = cleanID.substring(4, 6);
  //
  //   // Determine century and create full date
  //   const currentYear = new Date().getFullYear();
  //   const shortYear = parseInt(yearPart);
  //   const fullYear = shortYear < (currentYear % 100) ? 2000 + shortYear : 1900 + shortYear;
  //
  //   // Validate date
  //   const extractedDate = new Date(fullYear, parseInt(monthPart) - 1, parseInt(dayPart));
  //   const isValidDate = extractedDate.getFullYear() === fullYear &&
  //       extractedDate.getMonth() === parseInt(monthPart) - 1 &&
  //       extractedDate.getDate() === parseInt(dayPart);
  //
  //   if (!isValidDate) {
  //     setIdValidation({
  //       isValid: false,
  //       message: 'Invalid date in ID number',
  //       gender: '',
  //       citizenship: ''
  //     });
  //     return;
  //   }
  //
  //   // Extract gender (7th digit: 0-4 = female, 5-9 = male)
  //   const genderDigit = parseInt(cleanID.substring(6, 7));
  //   const gender = genderDigit < 5 ? 'Female' : 'Male';
  //
  //   // Extract citizenship (10th digit: 0 = SA citizen, 1 = permanent resident)
  //   const citizenshipDigit = parseInt(cleanID.substring(10, 11));
  //   const citizenship = citizenshipDigit === 0 ? 'South African Citizen' : 'Permanent Resident';
  //
  //   // Luhn algorithm validation for SA ID
  //   const isLuhnValid = validateLuhn(cleanID);
  //
  //   if (!isLuhnValid) {
  //     setIdValidation({
  //       isValid: false,
  //       message: 'Invalid ID number format',
  //       gender: '',
  //       citizenship: ''
  //     });
  //     return;
  //   }
  //
  //   // Format date as YYYY-MM-DD for input field
  //   const formattedDate = `${fullYear}-${monthPart.padStart(2, '0')}-${dayPart.padStart(2, '0')}`;
  //
  //   // Update form data with extracted date of birth
  //   setFormData(prev => ({
  //     ...prev,
  //     dateOfBirth: formattedDate
  //   }));
  //
  //   setIdValidation({
  //     isValid: true,
  //     message: `✅ Valid ID - ${gender}, ${citizenship}`,
  //     gender,
  //     citizenship
  //   });
  // };

  // Luhn algorithm for SA ID validation
  // const validateLuhn = (idNumber) => {
  //   let sum = 0;
  //   let isEven = false;
  //
  //   for (let i = idNumber.length - 1; i >= 0; i--) {
  //     let digit = parseInt(idNumber.charAt(i));
  //
  //     if (isEven) {
  //       digit *= 2;
  //       if (digit > 9) {
  //         digit -= 9;
  //       }
  //     }
  //
  //     sum += digit;
  //     isEven = !isEven;
  //   }
  //
  //   return sum % 10 === 0;
  // };

  // Simplified ID validation without Luhn check
  const validateAndExtractID = (idNumber) => {
    // Remove any spaces or special characters
    const cleanID = idNumber.replace(/\s+/g, '');

    // Basic validation - SA ID must be 13 digits
    if (cleanID.length !== 13 || !/^\d+$/.test(cleanID)) {
      setIdValidation({
        isValid: false,
        message: 'ID must be exactly 13 digits',
        gender: '',
        citizenship: ''
      });
      return;
    }

    // Extract date parts (YYMMDD format)
    const yearPart = cleanID.substring(0, 2);
    const monthPart = cleanID.substring(2, 4);
    const dayPart = cleanID.substring(4, 6);

    // Determine century and create full date
    const currentYear = new Date().getFullYear();
    const shortYear = parseInt(yearPart);
    const fullYear = shortYear < (currentYear % 100) ? 2000 + shortYear : 1900 + shortYear;

    // Validate date
    const extractedDate = new Date(fullYear, parseInt(monthPart) - 1, parseInt(dayPart));
    const isValidDate = extractedDate.getFullYear() === fullYear &&
        extractedDate.getMonth() === parseInt(monthPart) - 1 &&
        extractedDate.getDate() === parseInt(dayPart);

    if (!isValidDate) {
      setIdValidation({
        isValid: false,
        message: 'Invalid date in ID number',
        gender: '',
        citizenship: ''
      });
      return;
    }

    // Extract gender (7th digit: 0-4 = female, 5-9 = male)
    const genderDigit = parseInt(cleanID.substring(6, 7));
    const gender = genderDigit < 5 ? 'Female' : 'Male';

    // Extract citizenship (10th digit: 0 = SA citizen, 1 = permanent resident)
    const citizenshipDigit = parseInt(cleanID.substring(10, 11));
    const citizenship = citizenshipDigit === 0 ? 'South African Citizen' : 'Permanent Resident';

    // Format date as YYYY-MM-DD for input field
    const formattedDate = `${fullYear}-${monthPart.padStart(2, '0')}-${dayPart.padStart(2, '0')}`;

    // Update form data with extracted date of birth
    setFormData(prev => ({
      ...prev,
      dateOfBirth: formattedDate
    }));

    setIdValidation({
      isValid: true,
      message: `✅ Valid ID - ${gender}, ${citizenship}`,
      gender,
      citizenship
    });
  };

  // Validate ID number meets basic requirements
  const isValidIDNumber = (idNumber) => {
    const cleanID = idNumber.replace(/\s+/g, '');
    return cleanID.length === 13 && /^\d+$/.test(cleanID);
  };

  const validatePassword = (password) => {
    const requirements = {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumbers: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    const isStrong = Object.values(requirements).every(Boolean);

    return {
      isStrong,
      requirements,
      score: Object.values(requirements).filter(Boolean).length
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate ID number
    if (!isValidIDNumber(formData.idNumber)) {
      setMessage('Please enter a valid 13-digit ID number');
      return;
    }

    if (!idValidation.isValid) {
      setMessage('Please enter a valid South African ID number');
      return;
    }

    // Add password strength check
    if (!passwordStrength.isStrong) {
      setMessage('Please use a stronger password that meets all requirements!');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match!');
      return;
    }

    setMessage('Creating account...');

    try {
      // Match SignUpRequestDTO structure
      const userData = {
        userId: null, // Will be auto-generated by backend
        idNumber: parseInt(formData.idNumber.replace(/\s+/g, '')),
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        dateOfBirth: formData.dateOfBirth,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        role: formData.role
      };

      const response = await registerUser(userData);
      // Response structure: { token, user, tokenType }

      // Save JWT token and user data (auto-login after registration)
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('tokenType', response.tokenType || 'Bearer');
        localStorage.setItem('user', JSON.stringify(response.user));
        sessionStorage.setItem('user', JSON.stringify(response.user));

        setMessage('Account created successfully! Redirecting to dashboard...');
        console.log('Registration successful:', response);

        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        // If no token returned, redirect to login
        setMessage('Account created successfully! Please login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      setMessage(`Registration failed: ${error.message}`);
      console.error('Registration error:', error);
    }
  };

  return (
      <form onSubmit={handleSubmit} className="form">
        <h1>Create Account</h1>
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
              type="text"
              placeholder="Enter First Name"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
          />

          <label htmlFor="lastName">Last Name</label>
          <input
              type="text"
              placeholder="Enter Last Name"
              id="lastName"
              name="lastName"
              value={formData.lastName}
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

          <label htmlFor="idNumber">South African ID Number</label>
          <input
              type="text"
              placeholder="Enter 13-digit ID Number"
              id="idNumber"
              name="idNumber"
              value={formData.idNumber}
              onChange={handleChange}
              maxLength="13"
              required
          />

          {/* ID Validation Indicator */}
          {formData.idNumber && (
              <div className="id-validation" style={{
                marginTop: '8px',
                padding: '12px',
                borderRadius: '6px',
                backgroundColor: idValidation.isValid ? '#1a3a1a' : '#3a1a1a',
                border: `1px solid ${idValidation.isValid ? '#10b981' : '#ef4444'}`,
                fontSize: '13px'
              }}>
                <div style={{
                  color: idValidation.isValid ? '#10b981' : '#ef4444',
                  fontWeight: '600',
                  marginBottom: idValidation.isValid ? '8px' : '0'
                }}>
                  {idValidation.message}
                </div>
                {idValidation.isValid && (
                    <div style={{ color: '#ccc', fontSize: '12px' }}>
                      <div>Gender: {idValidation.gender}</div>
                      <div>Citizenship: {idValidation.citizenship}</div>
                      <div>Date of Birth: {formData.dateOfBirth}</div>
                    </div>
                )}
              </div>
          )}

          <label htmlFor="dateOfBirth">Date of Birth</label>
          <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
              readOnly={formData.idNumber.length === 13}
              style={{
                backgroundColor: formData.idNumber.length === 13 ? '#2a2a2a' : '#2c2c2c',
                color: formData.idNumber.length === 13 ? '#888' : 'white'
              }}
          />
          {formData.idNumber.length === 13 && (
              <small style={{ color: '#aaa', fontSize: '12px', marginTop: '5px' }}>
                Date of birth auto-filled from ID number
              </small>
          )}

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
                border: '1px solid #555',
                borderRadius: '8px',
                backgroundColor: '#2c2c2c',
                color: 'white',
                fontSize: '1rem'
              }}
          >
            <option value="CUSTOMER">Customer</option>
            <option value="CAR_OWNER">Car Owner</option>
            <option value="ADMIN">Administrator</option>
          </select>

          <label htmlFor="password">Password</label>
          <input
              type="password"
              placeholder="Enter Password"
              id="password"
              name="password"
              value={formData.password}
              onChange={(e) => {
                handleChange(e);
                setPasswordStrength(validatePassword(e.target.value));
              }}
              required
          />

          {/* Password Strength Indicator */}
          {formData.password && (
              <div className="password-strength" style={{
                marginTop: '10px',
                padding: '15px',
                borderRadius: '8px',
                backgroundColor: '#2a2a2a',
                border: '1px solid #444'
              }}>
                <div style={{display: 'flex', alignItems: 'center', marginBottom: '12px'}}>
                  <span style={{color: 'white', marginRight: '10px', fontSize: '14px', fontWeight: '600'}}>Password Strength:</span>
                  <div style={{
                    width: '100px',
                    height: '8px',
                    backgroundColor: '#444',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${(passwordStrength.score / 5) * 100}%`,
                      height: '100%',
                      backgroundColor: passwordStrength.score <= 2 ? '#ef4444' :
                          passwordStrength.score <= 4 ? '#f59e0b' : '#10b981',
                      transition: 'all 0.3s ease'
                    }}></div>
                  </div>
                  <span style={{
                    marginLeft: '10px',
                    color: passwordStrength.score <= 2 ? '#ef4444' :
                        passwordStrength.score <= 4 ? '#f59e0b' : '#10b981',
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}>
                {passwordStrength.score <= 2 ? 'Weak' : passwordStrength.score <= 4 ? 'Medium' : 'Strong'}
              </span>
                </div>

                <div style={{fontSize: '13px', color: '#ccc'}}>
                  <div style={{display: 'flex', alignItems: 'center', marginBottom: '6px'}}>
                <span style={{
                  color: passwordStrength.requirements.minLength ? '#10b981' : '#ef4444',
                  marginRight: '8px',
                  fontWeight: 'bold'
                }}>
                  {passwordStrength.requirements.minLength ? '✓' : '✗'}
                </span>
                    At least 8 characters
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', marginBottom: '6px'}}>
                <span style={{
                  color: passwordStrength.requirements.hasUpperCase ? '#10b981' : '#ef4444',
                  marginRight: '8px',
                  fontWeight: 'bold'
                }}>
                  {passwordStrength.requirements.hasUpperCase ? '✓' : '✗'}
                </span>
                    Uppercase letter
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', marginBottom: '6px'}}>
                <span style={{
                  color: passwordStrength.requirements.hasLowerCase ? '#10b981' : '#ef4444',
                  marginRight: '8px',
                  fontWeight: 'bold'
                }}>
                  {passwordStrength.requirements.hasLowerCase ? '✓' : '✗'}
                </span>
                    Lowercase letter
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', marginBottom: '6px'}}>
                <span style={{
                  color: passwordStrength.requirements.hasNumbers ? '#10b981' : '#ef4444',
                  marginRight: '8px',
                  fontWeight: 'bold'
                }}>
                  {passwordStrength.requirements.hasNumbers ? '✓' : '✗'}
                </span>
                    Number
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', marginBottom: '6px'}}>
                <span style={{
                  color: passwordStrength.requirements.hasSpecialChar ? '#10b981' : '#ef4444',
                  marginRight: '8px',
                  fontWeight: 'bold'
                }}>
                  {passwordStrength.requirements.hasSpecialChar ? '✓' : '✗'}
                </span>
                    Special character (!@#$%^&* etc.)
                  </div>
                </div>
              </div>
          )}

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