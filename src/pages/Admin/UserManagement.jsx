import React, { useState, useEffect } from 'react';
import { adminApi } from '../../scripts/adminApi';
import './AdminManagement.css';

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingUser, setEditingUser] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [message, setMessage] = useState('');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        role: 'CUSTOMER',
        idNumber: '',
        dateOfBirth: ''
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const usersData = await adminApi.getAllUsers();
            setUsers(usersData);
        } catch (error) {
            setMessage('Error fetching users: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
        setFormData({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            phoneNumber: user.phoneNumber || '',
            role: user.role || 'CUSTOMER',
            idNumber: user.idNumber?.toString() || '',
            dateOfBirth: user.dateOfBirth || ''
        });
        setShowForm(true);
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            // Prepare the data for update using the DTO structure
            const updateData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                role: formData.role,
                idNumber: formData.idNumber ? parseInt(formData.idNumber) : null,
                dateOfBirth: formData.dateOfBirth || null
            };

            console.log('Updating user with data:', updateData);

            await adminApi.updateUser(editingUser.userId, updateData);
            setMessage('User updated successfully!');
            setShowForm(false);
            setEditingUser(null);
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phoneNumber: '',
                role: 'CUSTOMER',
                idNumber: '',
                dateOfBirth: ''
            });
            fetchUsers();
        } catch (error) {
            console.error('Update error:', error);
            setMessage('Error updating user: ' + error.message);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            try {
                console.log('Deleting user ID:', userId);
                await adminApi.deleteUser(userId);
                setMessage('User deleted successfully');
                fetchUsers();
            } catch (error) {
                console.error('Delete error:', error);
                setMessage('Error deleting user: ' + error.message);
            }
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingUser(null);
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            role: 'CUSTOMER',
            idNumber: '',
            dateOfBirth: ''
        });
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-ZA');
    };

    if (loading) {
        return <div className="loading">Loading users...</div>;
    }

    return (
        <div className="admin-management">
            <div className="admin-header">
                <h1>User Management</h1>
                <p>Manage system users and permissions</p>
            </div>

            {message && (
                <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
                    {message}
                </div>
            )}

            <div className="management-content">
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Role</th>
                            <th>ID Number</th>
                            <th>Date of Birth</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map(user => (
                            <tr key={user.userId}>
                                <td>{user.userId}</td>
                                <td>{user.firstName} {user.lastName}</td>
                                <td>{user.email}</td>
                                <td>{user.phoneNumber}</td>
                                <td>
                                    <span className={`role-badge role-${user.role?.toLowerCase()}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td>{user.idNumber}</td>
                                <td>{formatDate(user.dateOfBirth)}</td>
                                <td className="actions">
                                    <button
                                        onClick={() => handleEditUser(user)}
                                        className="btn-edit"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteUser(user.userId)}
                                        className="btn-delete"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit User Modal */}
            {showForm && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Edit User - {editingUser?.firstName} {editingUser?.lastName}</h3>
                        <form onSubmit={handleUpdateUser}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>First Name *</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Last Name *</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Phone Number *</label>
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>ID Number</label>
                                    <input
                                        type="text"
                                        name="idNumber"
                                        value={formData.idNumber}
                                        onChange={handleInputChange}
                                        placeholder="e.g., 1234567890123"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Date of Birth</label>
                                    <input
                                        type="date"
                                        name="dateOfBirth"
                                        value={formData.dateOfBirth}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Role *</label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="CUSTOMER">Customer</option>
                                    <option value="CAR_OWNER">Car Owner</option>
                                    <option value="ADMIN">Admin</option>
                                </select>
                            </div>

                            <div className="modal-actions">
                                <button type="button" onClick={handleCancel} className="btn-cancel">
                                    Cancel
                                </button>
                                <button type="submit" className="btn-save">
                                    Update User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserManagement;