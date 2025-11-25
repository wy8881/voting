import {useContext, useEffect, useState} from "react";
import api from '../api/axiosConfig';
import {UserContext} from "../contexts/UserContext";
import {useNavigate} from "react-router-dom";
import Sidebar from "./Sidebar";
import '../styles/DelegatePage.css';
import withRoleAccess from "./withRoleAcess";

const ManageCandidates = () => {
    const [candidates, setCandidates] = useState([]);
    const [received, setReceived] = useState(false);
    const navigate = useNavigate();
    const {user} = useContext(UserContext);

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
            <Sidebar />
            <h1>Manage Candidates</h1>
            {!received ?(
                <div>Loading...</div>
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