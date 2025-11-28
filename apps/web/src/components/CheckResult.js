import withRoleAccess from "./withRoleAcess";
import {useEffect, useState} from "react";
import api from "../api/axiosConfig";
import { FaCat, FaDog } from "react-icons/fa6";
import { GiEgyptianBird } from "react-icons/gi";
import { ClipLoader } from 'react-spinners';
import '../styles/DelegatePage.css';
const CheckResult = () => {
    const [results, setResults] = useState([]);
    const [received, setReceived] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFirst, setIsFirst] = useState(false);
    const [candidates, setCandidates] = useState([]);
    const [lastCalculatedAt, setLastCalculatedAt] = useState(null);

    useEffect(() => {
        async function fetchCandidates() {
            try {
                await api.get('api/user/allCandidates').then(resp => {
                    setCandidates(resp.data);
                })
            } catch (error) {
                console.log(error)
            }
        }
        fetchCandidates();
    }, []);

    function getCandidateParty(candidateName) {
        const candidate = candidates.find(c => c.name === candidateName);
        return candidate ? candidate.party : null;
    }

    function renderIcon(party) {
        if (party === 'Feline Progressive Party') {
            return <FaCat />;
        } else if (party === 'Canine Unity Party') {
            return <FaDog />;
        } else if (party === 'Avian Freedom Party') {
            return <GiEgyptianBird />;
        }
        return null;
    }

    async function handleRecound() {
        setIsSubmitting(true)
        try {
            await api.get('api/delegate/result').then(resp => {
                console.log(resp.data);
                const responseData = resp.data;
                const candidateTotalVotes = responseData.candidateTotalVotes || [];
                const sortedResults = candidateTotalVotes.sort((a, b) => {
                    if (a.totalVotes === b.totalVotes) {
                        return a.candidateName.localeCompare(b.candidateName);
                    }
                    return b.totalVotes - a.totalVotes;
                });
                setResults(sortedResults);
                setLastCalculatedAt(responseData.lastCalculatedAt);
                setIsFirst(true);
                setReceived(true);
                setIsSubmitting(false);
            })
        } catch (error) {
            console.log(error);
            setIsSubmitting(false);
        }
    }

    return (
        <div className="delegate-container">
            <h1>Election Results</h1>
            {isFirst && (
            <>
                {!received ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                        <ClipLoader color="#2563EB" size={40} />
                    </div>
                ) : (
                    <div className="results-card">
                        {lastCalculatedAt && (
                            <div style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#64748B' }}>
                                Last calculated: {new Date(lastCalculatedAt).toLocaleString()}
                            </div>
                        )}
                        {results && results.length > 0 ? (
                            <div className="results-list">
                                {results.map((result, index) => {
                                    const party = getCandidateParty(result.candidateName);
                                    return (
                                        <div key={index} className={'delegate-row'}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                {renderIcon(party)}
                                                {result.candidateName}
                                            </div>
                                            <div>Votes: {result.totalVotes}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="no-results">No results available</div>
                        )}
                    </div>
                )}
            </>)}

            <button
                className={"button admin-create-button"}
                onClick={handleRecound}
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Recounting...' : 'Recount'}
            </button>
        </div>
    );


}

export default withRoleAccess(CheckResult, "ROLE_DELEGATE");