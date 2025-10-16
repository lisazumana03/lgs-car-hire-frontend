/*
Extended Registration Form Page
Uses MultiStepForm component for detailed user registration
Date: 2025-10-16
*/
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MultiStepForm from '../../../components/common/MultiStepForm/MultiStepForm';
import { register } from '../../../services/auth.service';

const ExtendedRegistrationForm = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (formData) => {
    setLoading(true);
    setMessage('');

    try {
      // Transform the multi-step form data to match your backend User structure
      const registrationData = {
        // Basic auth fields
        email: formData.email,
        password: formData.password || 'DefaultPassword123!', // You might want to add password fields

        // Personal details
        firstName: formData.fullName.split(' ')[0],
        lastName: formData.fullName.split(' ').slice(1).join(' '),
        dateOfBirth: formData.dateOfBirth,
        phoneNumber: formData.mobileNumber,
        gender: formData.gender,

        // Identity details
        idType: formData.idType,
        idNumber: formData.idNumber,

        // Address details
        address: {
          addressType: formData.addressType,
          streetNumber: formData.blockNumber,
          streetName: formData.wardNumber,
          cityOrTown: formData.district,
          provinceOrState: formData.state,
          country: formData.nationality,
          postalCode: ''
        },

        // Additional details (you may need to add these fields to your User entity)
        occupation: formData.occupation,
        nationality: formData.nationality,

        // Role (default to USER)
        role: 'USER'
      };

      console.log('Submitting registration:', registrationData);

      // Call your registration service
      await register(registrationData);

      setMessage('Registration successful! Please login.');
      setMessageType('success');

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      console.error('Registration error:', error);
      setMessage(error.message || 'Registration failed. Please try again.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registration-page">
      {message && (
        <div className={`message-banner ${messageType}`}>
          <p>{message}</p>
        </div>
      )}

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Processing your registration...</p>
        </div>
      ) : (
        <MultiStepForm onSubmit={handleFormSubmit} />
      )}

      <style jsx>{`
        .registration-page {
          min-height: 100vh;
          padding: 2rem 1rem;
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
        }

        .message-banner {
          max-width: 900px;
          margin: 0 auto 2rem;
          padding: 1rem;
          border-radius: 8px;
          text-align: center;
          font-weight: 600;
        }

        .message-banner.success {
          background: rgba(0, 202, 9, 0.2);
          border: 1px solid #00ca09;
          color: #00ca09;
        }

        .message-banner.error {
          background: rgba(255, 0, 0, 0.2);
          border: 1px solid #ff0000;
          color: #ff6b6b;
        }

        .loading-container {
          max-width: 900px;
          margin: 4rem auto;
          text-align: center;
          color: #fff;
        }

        .spinner {
          width: 50px;
          height: 50px;
          margin: 0 auto 1rem;
          border: 4px solid rgba(255, 255, 255, 0.1);
          border-top-color: #00ca09;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .loading-container p {
          font-size: 1.1rem;
          color: rgba(255, 255, 255, 0.8);
        }
      `}</style>
    </div>
  );
};

export default ExtendedRegistrationForm;
