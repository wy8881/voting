import {useEffect, useState} from "react";
import api from '../api/axiosConfig';
import { ClipLoader } from 'react-spinners';
import '../styles/DelegatePage.css';
import withRoleAccess from "./withRoleAcess";

const ManageCandidates = () => {
    const [candidates, setCandidates] = useState([]);
    const [received, setReceived] = useState(false);

    useEffect(() => {
        async function fetchCandidates() {
            try {
                await api.get('api/user/allCandidates').then(resp => {
                    setCandidates(resp.data);
                    setReceived(true)
                })
            } catch (error) {
                console.log(error)
            }
        }
        fetchCandidates();
    },[]);


    return (
        <div className="delegate-container">
            <h1>Manage Candidates</h1>
            {!received ?(
                <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                    <ClipLoader color="#2563EB" size={40} />
                </div>
            ) : (
                <>
                    {candidates && candidates.length > 0 && candidates.map(candidate => (
                        <div className={'delegate-row'}>
                            <div>Name: {candidate.name}</div>
                            <div>Party: {candidate.party}</div>
                        </div>
                    ))}
                    {candidates && candidates.length === 0 && (
                        <div>No candidates</div>
                    )}
                </>
            )}
        </div>
    );
}

export default withRoleAccess(ManageCandidates, "ROLE_DELEGATE");