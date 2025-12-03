import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axiosConfig';
import { ClipLoader } from 'react-spinners';
import { UserContext } from '../contexts/UserContext';
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
import { confirm } from '../utils/confirmDialog';
import '../styles/AdminManagement.css';
import withRoleAccess from './withRoleAcess';

const AdminManagement = () => {
    const { user } = useContext(UserContext);
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'ROLE_DELEGATE'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isResetting, setIsResetting] = useState(false);

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        try {
            setLoading(true);
            const response = await api.get('api/admin/accounts');
            setAccounts(response.data);
        } catch (error) {
            console.error('Error fetching accounts:', error);
            toast.error('Failed to load accounts');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAccount = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await api.post('api/admin/accounts', formData);
            const data = response.data;
            if (data.remainingQuota !== undefined) {
                toast.success(`${data.message} Remaining accounts slots: ${data.remainingQuota}`);
            } else {
                toast.success(data.message || 'Account created successfully!');
            }
            setFormData({
                username: '',
                email: '',
                password: '',
                role: 'ROLE_DELEGATE'
            });
            setShowCreateForm(false);
            fetchAccounts();
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to create account';
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteAccount = async (username) => {
        const confirmed = await confirm({
            title: 'Delete Account',
            message: `Are you sure you want to delete account "${username}"?`,
            confirmText: 'Delete',
            variant: 'danger'
        });
        
        if (!confirmed) return;
        
        try {
            await api.delete(`api/admin/accounts/${username}`);
            toast.success('Account deleted successfully!');
            fetchAccounts();
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to delete account';
            toast.error(message);
        }
    };

    const handleResetDatabase = async () => {
        const confirmed = await confirm({
            title: 'Reset Database',
            message: '⚠️ WARNING: This will delete all non-preset parties, candidates, and votes. Are you sure you want to reset the database?',
            confirmText: 'Reset Database',
            variant: 'danger'
        });
        
        if (!confirmed) return;
        
        setIsResetting(true);
        try {
            await api.post('api/admin/resetDatabase');
            toast.success('Database reset completed successfully!');
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to reset database';
            toast.error(message);
        } finally {
            setIsResetting(false);
        }
    };

    const isDemoAdmin = user && user.isDemoAccount === true;

    const delegates = accounts.filter(account => account.role === 'ROLE_DELEGATE');
    const loggers = accounts.filter(account => account.role === 'ROLE_LOGGER');

    return (
        <div className="admin-management-container">
            <Toaster position="top-center" />
            <div className="admin-management-header">
                <h1>Manage Accounts</h1>
                <div className="button-container">
                    {!isDemoAdmin && (
                        <button 
                            className="button admin-reset-button" 
                            onClick={handleResetDatabase}
                            disabled={isResetting}
                            style={{ backgroundColor: '#dc3545', color: 'white' }}
                        >
                            {isResetting ? 'Resetting...' : 'Reset Database'}
                        </button>
                    )}
                    <button 
                        className="button admin-create-button" 
                        onClick={() => setShowCreateForm(!showCreateForm)}
                    >
                        {showCreateForm ? 'Cancel' : 'Create New Account'}
                    </button>
                </div>
            </div>

            {showCreateForm && (
                <div className="admin-create-form">
                    <h2>Create New Account</h2>
                    <form onSubmit={handleCreateAccount}>
                        <div className="input-container">
                            <label className="input-label" htmlFor="username">Username</label>
                            <input
                                className="input-field"
                                id="username"
                                type="text"
                                value={formData.username}
                                maxLength={20}
                                onChange={(e) => setFormData({...formData, username: e.target.value})}
                                required
                            />
                        </div>
                        <div className="input-container">
                            <label className="input-label" htmlFor="email">Email</label>
                            <input
                                className="input-field"
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                required
                            />
                        </div>
                        <div className="input-container">
                            <label className="input-label" htmlFor="password">Password</label>
                            <input
                                className="input-field"
                                id="password"
                                type="password"
                                value={formData.password}
                                maxLength={40}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                required
                            />
                        </div>
                        <div className="input-container">
                            <label className="input-label" htmlFor="role">Role</label>
                            <select
                                className="input-field"
                                id="role"
                                value={formData.role}
                                onChange={(e) => setFormData({...formData, role: e.target.value})}
                                required
                            >
                                <option value="ROLE_DELEGATE">Delegate</option>
                                <option value="ROLE_LOGGER">Logger</option>
                            </select>
                        </div>
                        <button 
                            className="button admin-create-button" 
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Creating...' : 'Create Account'}
                        </button>
                    </form>
                </div>
            )}

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                    <ClipLoader color="#2563EB" size={40} />
                </div>
            ) : (
                <>
                    <div className="accounts-section">
                        <h2>Delegates ({delegates.length})</h2>
                        {delegates.length === 0 ? (
                            <p className="no-accounts">No delegate accounts found</p>
                        ) : (
                            <div className="accounts-list">
                                {delegates.map(account => (
                                    <div key={account.username} className="account-item">
                                        <div className="account-info">
                                            <div className="account-username">{account.username}</div>
                                            <div className="account-email">{account.email}</div>
                                        </div>
                                        <button
                                            className="button button-secondary admin-delete-button"
                                            onClick={() => handleDeleteAccount(account.username)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="accounts-section">
                        <h2>Loggers ({loggers.length})</h2>
                        {loggers.length === 0 ? (
                            <p className="no-accounts">No logger accounts found</p>
                        ) : (
                            <div className="accounts-list">
                                {loggers.map(account => (
                                    <div key={account.username} className="account-item">
                                        <div className="account-info">
                                            <div className="account-username">{account.username}</div>
                                            <div className="account-email">{account.email}</div>
                                        </div>
                                        <button
                                            className="button button-secondary admin-delete-button"
                                            onClick={() => handleDeleteAccount(account.username)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default withRoleAccess(AdminManagement, 'ROLE_ADMIN');

