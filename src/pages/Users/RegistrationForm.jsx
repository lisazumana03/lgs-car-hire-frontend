import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../../services/userService.js';
import './index.css';

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
    const [loading, setLoading] = useState(false);
    const [agreeToTerms, setAgreeToTerms] = useState(false);

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

        if (!agreeToTerms) {
            setMessage('Please agree to the terms and conditions');
            return;
        }

        if (formData.password.length < 6) {
            setMessage('Password must be at least 6 characters long');
            return;
        }

        setMessage('');
        setLoading(true);

        try {
            const userData = {
                name: formData.name,
                email: formData.email,
                idNumber: formData.idNumber,
                dateOfBirth: formData.dateOfBirth,
                phoneNumber: formData.phoneNumber,
                password: formData.password,
                licenseNumber: formData.licenseNumber,
                role: 'CUSTOMER' // Explicitly set role as CUSTOMER for new registrations
            };

            const response = await userService.register(userData);

            setMessage('Account created successfully! Redirecting to login...');
            console.log('Registration successful:', response);

            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (error) {
            console.error('Registration error:', error);

            if (error.error) {
                setMessage(`Registration failed: ${error.error}`);
            } else if (error.message) {
                setMessage(`Registration failed: ${error.message}`);
            } else {
                setMessage('Registration failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLoginClick = (e) => {
        e.preventDefault();
        navigate('/login');
    };

    return (
        <form onSubmit={handleSubmit} className="form">
            <h1>Create Account</h1>
            <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '20px', textAlign: 'center' }}>
                Join LG'S CAR HIRE to start booking your dream car
            </p>

            <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                    type="text"
                    placeholder="Enter your full name"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    autoComplete="name"
                />

                <label htmlFor="email">Email Address *</label>
                <input
                    type="email"
                    placeholder="Enter your email address"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    autoComplete="email"
                />

                <label htmlFor="idNumber">Identification Number *</label>
                <input
                    type="text"
                    placeholder="Enter your ID number"
                    id="idNumber"
                    name="idNumber"
                    value={formData.idNumber}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    pattern="[0-9]{13}"
                    title="Please enter a valid 13-digit ID number"
                />

                <label htmlFor="dateOfBirth">Date of Birth *</label>
                <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    max={new Date().toISOString().split('T')[0]} // Can't be future date
                />

                <label htmlFor="phoneNumber">Phone Number *</label>
                <input
                    type="tel"
                    placeholder="Enter your phone number"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    pattern="[0-9]{10}"
                    title="Please enter a valid 10-digit phone number"
                    autoComplete="tel"
                />

                <label htmlFor="licenseNumber">Driver's License Number *</label>
                <input
                    type="text"
                    placeholder="Enter your driver's license number"
                    id="licenseNumber"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    required
                    disabled={loading}
                />

                <label htmlFor="password">Password *</label>
                <input
                    type="password"
                    placeholder="Create a password (min 6 characters)"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    minLength="6"
                    autoComplete="new-password"
                />

                <label htmlFor="confirmPassword">Confirm Password *</label>
                <input
                    type="password"
                    placeholder="Re-enter your password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    minLength="6"
                    autoComplete="new-password"
                />

                <label htmlFor="terms" style={{ marginTop: '20px' }}>
                    <input
                        type="checkbox"
                        id="terms"
                        name="terms"
                        checked={agreeToTerms}
                        onChange={(e) => setAgreeToTerms(e.target.checked)}
                        disabled={loading}
                    />
                    I agree to the terms and conditions *
                </label>

                <button
                    type="submit"
                    className="submit-btn"
                    disabled={loading || !agreeToTerms}
                >
                    {loading ? 'Creating Account...' : 'Create Account'}
                </button>

                {message && (
                    <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
                        {message}
                    </div>
                )}

                <div className="form-footer" style={{ marginTop: '20px' }}>
                    <span>Already have an account? </span>
                    <a
                        href="/login"
                        className="login-link"
                        onClick={handleLoginClick}
                    >
                        Login here
                    </a>
                </div>
            </div>
        </form>
    );
}

export default RegistrationForm;