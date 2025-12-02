import "../styles/DelegatePage.css"
import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import api from '../api/axiosConfig';
import '../styles/AdminManagement.css';
import { FaCat, FaDog } from "react-icons/fa6";
import { GiEgyptianBird } from "react-icons/gi";
import { ClipLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import { confirm } from '../utils/confirmDialog';
import withRoleAccess from "./withRoleAcess";

const Candidates = () => {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCandidates = async () => {
        try {
            setLoading(true);
            const resp = await api.get('api/user/allCandidates');
            setCandidates(resp.data || []);
        } catch (error) {
            console.error('Error fetching candidates:', error);
            toast.error('Failed to load candidates');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCandidates();
    }, []);

    const handleDeleteCandidate = async (candidateName) => {
        const confirmed = await confirm({
            title: 'Delete Candidate',
            message: `Are you sure you want to delete candidate "${candidateName}"?`,
            confirmText: 'Delete',
            variant: 'danger'
        });
        
        if (!confirmed) return;
        
        try {
            await api.delete(`api/delegate/candidates/${candidateName}`);
            toast.success('Candidate deleted successfully!');
            fetchCandidates();
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to delete candidate';
            toast.error(message);
        }
    };

    return (
        <div className="delegate-container">
            <div className="admin-management-header">
                <h1>Candidates</h1>
                <Link to={"/dashboard/candidates/create"}>
                    <button className="button admin-create-button"> Create New Candidate </button>
                </Link>
            </div>
            
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                    <ClipLoader color="#2563EB" size={40} />
                </div>
            ) : (
                <div className="accounts-section">
                    <h2>All Candidates ({candidates.length})</h2>
                    {candidates.length === 0 ? (
                        <p className="no-accounts">No candidates found</p>
                    ) : (
                        <div className="accounts-list">
                            {candidates.map(candidate => (
                                <div key={candidate.name} className="account-item">
                                    <div className="account-info">
                                        <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            {candidate.party === 'Feline Progressive Party' && <FaCat />}
                                            {candidate.party === 'Canine Unity Party' && <FaDog />}
                                            {candidate.party === 'Avian Freedom Party' && <GiEgyptianBird />}
                                            {candidate.name}
                                        </div>
                                        <div style={{ fontSize: '0.85rem' }}>{candidate.party}</div>
                                    </div>
                                    <button
                                        className="button button-secondary admin-delete-button"
                                        onClick={() => handleDeleteCandidate(candidate.name)}
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

export default withRoleAccess(Candidates, "ROLE_DELEGATE");