import "../styles/DelegatePage.css"
import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import api from '../api/axiosConfig';
import '../styles/AdminManagement.css';
import withRoleAccess from "./withRoleAcess";

const Parties = () => {
    const [parties, setParties] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchParties = async () => {
        try {
            setLoading(true);
            const resp = await api.get('api/user/allParties');
            setParties(resp.data || []);
        } catch (error) {
            console.error('Error fetching parties:', error);
            window.alert('Failed to load parties');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchParties();
    }, []);

    const handleDeleteParty = async (partyName) => {
        if (!window.confirm(`Are you sure you want to delete party "${partyName}"? This will also delete all candidates in this party.`)) {
            return;
        }
        try {
            await api.delete(`api/delegate/parties/${partyName}`);
            window.alert('Party deleted successfully!');
            fetchParties();
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to delete party';
            window.alert(message);
        }
    };

    return (
        <div className="delegate-container">
            <div className="admin-management-header">
                <h1>Parties</h1>
                <Link to={"/dashboard/parties/create"}>
                    <button className="button register-button admin-create-button"> Create New Party </button>
                </Link>
            </div>
            
            {loading ? (
                <div className="loading">Loading parties...</div>
            ) : (
                <div className="accounts-section">
                    <h2>All Parties ({parties.length})</h2>
                    {parties.length === 0 ? (
                        <p className="no-accounts">No parties found</p>
                    ) : (
                        <div className="accounts-list">
                            {parties.map(party => (
                                <div key={party.name} className="account-item">
                                    <div className="account-info">
                                        <div style={{ fontWeight: 'bold' }}>{party.name}</div>
                                        {party.candidates && party.candidates.length > 0 ? (
                                            <div style={{ fontSize: '0.85rem' }}>{party.candidates.join(', ')}</div>
                                        ) : (
                                            <div style={{ fontSize: '0.85rem' }}>No Candidates</div>
                                        )}
                                    </div>
                                    <button
                                        className="button button-secondary admin-delete-button"
                                        onClick={() => handleDeleteParty(party.name)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default withRoleAccess(Parties, "ROLE_DELEGATE");