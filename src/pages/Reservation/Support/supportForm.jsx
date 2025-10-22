import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as supportService from '../../../services/supportService';

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
    <div className="form" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'linear-gradient(120deg, #232526 0%, #414345 100%)' }}>
      <div style={{ width: '100%', maxWidth: '480px', background: 'rgba(30, 41, 59, 0.98)', borderRadius: '18px', boxShadow: '0 8px 32px rgba(0,0,0,0.25)', padding: '2.5rem', marginTop: '2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', color: '#fff', marginBottom: '2rem', letterSpacing: '1px' }}>Create Support Ticket</h2>

        {user && (getUserId() || user.fullName || user.name) ? (
          <div style={{ marginBottom: '1rem', color: '#F1F5F9', textAlign: 'center' }}>
            <div style={{ color: '#FBBF24', fontWeight: 600 }}>User ID: <span style={{ color: '#F1F5F9', fontWeight: 500 }}>{getUserId() || 'N/A'}</span></div>
            {user.fullName || user.name ? (
              <div style={{ marginTop: 6 }}><span style={{ color: '#FBBF24', fontWeight: 600 }}>Name:</span> <span style={{ color: '#F1F5F9' }}>{user.fullName || user.name}</span></div>
            ) : null}
          </div>
        ) : (
          <div style={{ marginBottom: '0.5rem', color: '#f87171', textAlign: 'center' }}>Not logged in or user not available</div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="subject" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#FBBF24' }}>Subject *</label>
            <input id="subject" name="subject" value={form.subject} onChange={handleChange} required
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #64748B', background: '#334155', color: '#F1F5F9', fontSize: '1rem', outline: 'none' }} />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="description" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#FBBF24' }}>Description *</label>
            <textarea id="description" name="description" value={form.description} onChange={handleChange} required rows={6}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #64748B', background: '#334155', color: '#F1F5F9', fontSize: '1rem', outline: 'none' }} />
          </div>

          {error && <div style={{ color: '#f87171', marginBottom: '0.75rem', textAlign: 'center' }}>{error}</div>}

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
            <button type="submit" disabled={submitting} style={{ background: 'linear-gradient(90deg, #F87171 0%, #FBBF24 100%)', color: '#fff', padding: '0.75rem 2rem', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', border: 'none', boxShadow: '0 2px 8px rgba(248,113,113,0.15)', cursor: submitting ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}>
              {submitting ? 'Submitting...' : 'Submit'}
            </button>

            <button type="button" onClick={() => navigate('/support-list')} style={{ background: 'linear-gradient(90deg, #64748B 0%, #334155 100%)', color: '#fff', padding: '0.75rem 2rem', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', border: 'none', boxShadow: '0 2px 8px rgba(100,116,139,0.15)', cursor: 'pointer', transition: 'background 0.2s' }}>
              Cancel
            </button>

            <button type="button" style={{ background: 'linear-gradient(90deg, #3B82F6 0%, #06B6D4 100%)', color: '#fff', padding: '0.75rem 2rem', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', border: 'none', boxShadow: '0 2px 8px rgba(59,130,246,0.15)', cursor: 'pointer', transition: 'background 0.2s' }} onClick={() => navigate(-1)}>
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

