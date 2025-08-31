import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../../services/userService.js';
import './index.css';

/*
Imtiyaaz Waggie 219374759
 */

function LoginForm({ onLogin }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        try {
            const response = await userService.login(formData.email, formData.password);

            console.log('Login response:', response);

            if (response.user) {
                setMessage('Login successful! Redirecting...');

                const userData = {
                    ...response.user,
                    role: response.role
                };

                const isCustomer = response.role === 'CUSTOMER' || response.role === 'customer';
                const isAdmin = response.role === 'ADMIN' || response.role === 'admin';

                console.log('User role:', response.role, 'Is Customer:', isCustomer, 'Is Admin:', isAdmin);

                onLogin(userData);

                setTimeout(() => {
                    if (isAdmin) {
                        navigate('/admin');
                    } else if (isCustomer) {
                        navigate('/');
                    } else {
                        navigate('/');
                    }
                }, 1000);
            } else {
                setMessage('Login failed: Invalid response from server');
            }
        } catch (error) {
            console.error('Login error:', error);
            if (error.error) {
                setMessage(`Login failed: ${error.error}`);
            } else if (error.message) {
                setMessage(`Login failed: ${error.message}`);
            } else {
                setMessage('Login failed: Please check your credentials and try again');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterClick = (e) => {
        e.preventDefault();
        navigate('/register');
    };

    return (
        <form onSubmit={handleSubmit} className="form">
            <h1>Login to LG'S CAR HIRE</h1>
            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    placeholder="Enter your email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    autoComplete="email"
                />

                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    placeholder="Enter your password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    autoComplete="current-password"
                />

                <button
                    type="submit"
                    className="login-btn"
                    disabled={loading}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>

                {message && (
                    <div className={`message ${message.includes('successful') ? 'success' : 'error'}`}>
                        {message}
                    </div>
                )}

                <div className="form-footer">
                    <label htmlFor="remember">
                        <input
                            type="checkbox"
                            id="remember"
                            name="remember"
                            disabled={loading}
                        />
                        Remember me
                    </label>
                    <a
                        href="/register"
                        className="forgot-password"
                        onClick={handleRegisterClick}
                    >
                        Create Account
                    </a>
                </div>
            </div>
        </form>
    );
}

export default LoginForm;