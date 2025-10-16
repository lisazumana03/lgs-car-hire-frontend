import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as supportService from '../../../services/support.service';

// SupportForm - create a new support ticket with subject, description and the current user's id
export default function SupportForm({ user: propUser }) {
	const navigate = useNavigate();
	const [user, setUser] = useState(propUser || null);
	const [form, setForm] = useState({ subject: '', description: '' });
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState(null);

	// Try to locate the logged-in user from multiple places if not provided as prop
	useEffect(() => {
		if (propUser) return;
		try {
			// Common patterns: localStorage 'user' key, window global, or an injected __USER__
			const fromStorage = (() => {
				try {
					const raw = localStorage.getItem('user');
					return raw ? JSON.parse(raw) : null;
				} catch (e) {
					return null;
				}
			})();
			if (fromStorage) {
				setUser(fromStorage);
				return;
			}
			if (window && window.__USER__) {
				setUser(window.__USER__);
				return;
			}
		} catch (e) {
			// ignore
		}
	}, [propUser]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((f) => ({ ...f, [name]: value }));
	};

	const getUserId = () => {
		if (!user) return null;
		return user.userId || user.id || user.userID || null;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		const userId = getUserId();
		if (!userId) {
			setError('Unable to determine current user. Please login first.');
			return;
		}

		const payload = {
			subject: form.subject,
			description: form.description,
			user: { userId },
		};

		try {
			setSubmitting(true);
			await supportService.create(payload);
			// redirect to support list after success
			navigate('/support-list');
		} catch (err) {
			setError(err?.response?.data?.message || err.message || 'Failed to create ticket.');
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div style={{ maxWidth: 720, margin: '1.5rem auto', padding: 20, background: 'linear-gradient(180deg,#0f172a, #001)', borderRadius: 8 }}>
			<h2 style={{ color: '#FBBF24', marginBottom: '1rem' }}>Create Support Ticket</h2>

			{user && (getUserId() || user.fullName || user.name) ? (
				<label style={{ display: 'block', color: '#FBBF24', fontWeight: '600', marginBottom: '0.75rem' }}>
					User ID: <span style={{ color: '#F1F5F9', fontWeight: '500' }}>{getUserId() || 'N/A'}</span>
					{user.fullName || user.name ? (
						<span style={{ marginLeft: 12 }}><span style={{ color: '#FBBF24', fontWeight: '600' }}>Name:</span> <span style={{ color: '#F1F5F9' }}>{user.fullName || user.name}</span></span>
					) : null}
				</label>
			) : (
				<div style={{ marginBottom: '0.5rem', color: '#f87171' }}>Not logged in or user not available</div>
			)}

			<form onSubmit={handleSubmit}>
				<label htmlFor="subject" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#FBBF24' }}>Subject *</label>
				<input id="subject" name="subject" value={form.subject} onChange={handleChange} required
					style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #334155', background: '#0b1220', color: '#e2e8f0', marginBottom: '1rem' }} />

				<label htmlFor="description" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#FBBF24' }}>Description *</label>
				<textarea id="description" name="description" value={form.description} onChange={handleChange} required rows={6}
					style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #334155', background: '#0b1220', color: '#e2e8f0', marginBottom: '1rem' }} />

				{error && <div style={{ color: '#f87171', marginBottom: '0.75rem' }}>{error}</div>}

				<div style={{ display: 'flex', gap: 12 }}>
					<button type="submit" disabled={submitting}
						style={{ background: '#06b6d4', color: '#042', padding: '8px 16px', borderRadius: 6, border: 'none', cursor: submitting ? 'not-allowed' : 'pointer' }}>
						{submitting ? 'Submitting...' : 'Submit Ticket'}
					</button>

					<button type="button" onClick={() => navigate('/support-list')}
						style={{ background: 'transparent', color: '#F1F5F9', padding: '8px 16px', borderRadius: 6, border: '1px solid #334155', cursor: 'pointer' }}>
						Cancel
					</button>
				</div>
			</form>
		</div>
	);
}

