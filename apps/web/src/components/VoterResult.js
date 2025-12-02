import withRoleAccess from "./withRoleAcess";
import {useEffect, useState} from "react";
import api from "../api/axiosConfig";
import { FaCat, FaDog } from "react-icons/fa6";
import { GiEgyptianBird } from "react-icons/gi";
import { ClipLoader } from 'react-spinners';
import '../styles/DelegatePage.css';

const VoterResult = () => {
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [candidates, setCandidates] = useState([]);
    const [lastCalculatedAt, setLastCalculatedAt] = useState(null);
    const [error, setError] = useState(null);
    const [electionStopped, setElectionStopped] = useState(false);

    useEffect(() => {
        checkElectionStatus();
    }, []);

    async function checkElectionStatus() {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.get('api/user/electionStatus');
            const isStopped = !response.data?.electionStarted;
            setElectionStopped(isStopped);
            
            if (isStopped) {
                await fetchCandidates();
                await fetchResults();
            } else {
                setIsLoading(false);
            }
        } catch (error) {
            console.log('Failed to check election status:', error);
            setError('Failed to check election status. Please try again later.');
            setIsLoading(false);
        }
    }

        async function fetchCandidates() {
            try {
                await api.get('api/user/allCandidates').then(resp => {
                    setCandidates(resp.data);
                })
            } catch (error) {
                console.log(error)
            }
        }

    async function fetchResults() {
        setIsLoading(true);
        setError(null);
        try {
            await api.get('api/user/electionResult').then(resp => {
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
            })
        } catch (error) {
            console.log(error);
            if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError('Failed to fetch election results. Please try again later.');
            }
        } finally {
            setIsLoading(false);
        }
    }

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

    return (
        <div className="delegate-container">
            <h1>Election Results</h1>
            {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                    <ClipLoader color="#2563EB" size={40} />
                </div>
            ) : !electionStopped ? (
                <div style={{ 
                    textAlign: 'center', 
                    padding: '2rem', 
                    color: '#64748B',
                    fontSize: '1.1rem',
                    marginTop: '1rem'
                }}>
                    The result is only shown after the election stops.
                </div>
            ) : error ? (
                <div className="error-message" style={{ color: '#dc2626', marginTop: '1rem' }}>
                    {error}
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
        </div>
    );
}

export default withRoleAccess(VoterResult, "ROLE_VOTER");

