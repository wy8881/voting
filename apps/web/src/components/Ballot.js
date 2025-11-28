import React, {useContext, useEffect, useState} from 'react';
import '../styles/Ballot.css';
import {useNavigate} from "react-router-dom";
import {UserContext} from "../contexts/UserContext";
import api from "../api/axiosConfig";
import { FaCat, FaDog } from "react-icons/fa6";
import { GiEgyptianBird } from "react-icons/gi";
import { ClipLoader } from 'react-spinners';
import withRoleAccess from "./withRoleAcess";

const Ballot = () => {
    const [votes, setVotes] = useState({});
    const [parties, setParties] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const [receiveParties, setReceiveParties] = useState(false);
    const [receiveCandidates, setReceiveCandidates] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [clickOrder, setClickOrder] = useState({ above: [], below: [] });
    const navigate = useNavigate();
    const {user, setUser} = useContext(UserContext);

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
        async function fetchParties() {
            try {
                await api.get('api/user/allParties').then(resp => {
                    setParties(resp.data);
                })
            } catch (error) {
                console.log(error)
            }
        }
        fetchParties().then(() => setReceiveParties(true));
        fetchCandidates().then(() => setReceiveCandidates(true));
    }, []);


    function handleVoteChange (id, value) {
        const isAbove = id.startsWith('above');
        const orderKey = isAbove ? 'above' : 'below';
        const index = parseInt(id.replace(/^(above|below)/, ''), 10);
        
        if (value === '' || value === null || value === undefined) {
            setVotes(prev => {
                const newVotes = { ...prev };
                delete newVotes[id];
                return newVotes;
            });
            
            setClickOrder(prev => {
                const newOrder = prev[orderKey].filter(i => i !== index);
                return {
                    ...prev,
                    [orderKey]: newOrder
                };
            });
        } else {
            const numValue = parseInt(value, 10);
            
            setVotes(prev => {
                const newVotes = { ...prev };
                
                if (!isNaN(numValue)) {
                    Object.keys(prev).forEach(key => {
                        if (key !== id && key.startsWith(isAbove ? 'above' : 'below')) {
                            const existingValue = parseInt(prev[key], 10);
                            if (!isNaN(existingValue) && existingValue === numValue) {
                                delete newVotes[key];
                                const existingIndex = parseInt(key.replace(/^(above|below)/, ''), 10);
                                setClickOrder(prevOrder => ({
                                    ...prevOrder,
                                    [orderKey]: prevOrder[orderKey].filter(i => i !== existingIndex)
                                }));
                            }
                        }
                    });
                }
                
                newVotes[id] = value;
                return newVotes;
            });
            
            if (!clickOrder[orderKey].includes(index)) {
                setClickOrder(prev => ({
                    ...prev,
                    [orderKey]: [...prev[orderKey], index]
                }));
            }
        }
    }

    function handleCardClick(id, index) {
        const isAbove = id.startsWith('above');
        const orderKey = isAbove ? 'above' : 'below';
        const currentOrder = clickOrder[orderKey];
        
        if (currentOrder.includes(index)) {
            const newOrder = currentOrder.filter(i => i !== index);
            setClickOrder(prev => ({
                ...prev,
                [orderKey]: newOrder
            }));
            
            setVotes(prev => {
                const newVotes = { ...prev };
                delete newVotes[id];
                
                newOrder.forEach((idx, pos) => {
                    const voteId = isAbove ? `above${idx}` : `below${idx}`;
                    newVotes[voteId] = (pos + 1).toString();
                });
                
                return newVotes;
            });
        } else {
            const newOrder = [...currentOrder, index];
            setClickOrder(prev => ({
                ...prev,
                [orderKey]: newOrder
            }));
            
            const newValue = newOrder.length;
            setVotes(prev => ({
                ...prev,
                [id]: newValue.toString()
            }));
        }
    }

    function handleError(message) {
        window.alert(message);
        setIsSubmitting(false)
        setVotes({});
    }

    function handleClearAll() {
        if (window.confirm('Are you sure you want to clear all votes?')) {
            setVotes({});
            setClickOrder({ above: [], below: [] });
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        setIsSubmitting(true)
        if(checkCorrectMethod() && checkCorrectNumber()) {
            if (Object.keys(votes).some(key => key.includes('above'))) {
                const partiesPreferenceList = createPartiesPreferenceList(parties, votes);

                api.post('api/voter/vote', {
                    "voterName": user.username,
                    "preferences": partiesPreferenceList,
                    "type": "party"
                }).then(resp => {
                    window.alert(resp.data.message);
                    const newUser = {
                        username: user.username,
                        email: user.email,
                        role: user.role,
                        isVoted: true
                    }
                    setUser(newUser);
                    navigate('/dashboard');
                }).catch(error => {
                    handleError(error.response.data.message)
                })
            } else {
                const candidatesPreferenceList = createCandidatesPreferenceList(candidates, votes);
                api.post('api/voter/vote', {
                    "voterName": user.username,
                    "preferences": candidatesPreferenceList,
                    "type": "candidate"
                }).then(resp => {
                    window.alert(resp.data.message);
                    const newUser = {
                        username: user.username,
                        email: user.email,
                        role: user.role,
                        isVoted: true
                    }
                    setUser(newUser);
                    navigate('/dashboard');
                }).catch(error => {
                    handleError(error.response.data.message)
                })
            }
        }
    }

    function checkCorrectMethod() {
            let aboveCount = 0;
            let belowCount = 0;

            for(let key in votes) {
                if(key.startsWith('above') && votes[key]) {
                    aboveCount ++;
                }
                else if(key.startsWith('below') && votes[key]) {
                    belowCount ++;
                }
            }
            if(aboveCount > 0 && belowCount >0) {
                handleError("You can only vote above or below the line");
                return false;
            }
            return true;
    }

    function checkCorrectNumber() {
        if(Object.keys(votes).length === 0) {
            handleError("You have not voted for anyone");
            return false;
        }
        const voteValues = Object.values(votes).map(value => parseInt(value, 10));
        const isAboveLine = Object.keys(votes).some(key => key.includes('above'));
        const isBelowLine = Object.keys(votes).some(key => key.includes('below'));
        const isUnique = (arr) => {
            const uniqueNumbers = [...new Set(arr)];
            return uniqueNumbers.length === arr.length
        };

        const minVote = Math.min(...voteValues);
        const maxVote = Math.max(...voteValues);
        const isConsecutive = maxVote - minVote === voteValues.length - 1;

        if (isAboveLine){
            const partiesCount = parties.length;
            if(!(isUnique(voteValues) && minVote === 1 && voteValues.length === partiesCount && isConsecutive)) {
                handleError(`You have not voted correctly above the line. You need to number ${partiesCount} boxes from 1 to ${partiesCount}.`);
                return false;
            }

        }


        if (isBelowLine) {
            const candidatesCount = candidates.length;
            if(!(isUnique(voteValues) && minVote === 1 && voteValues.length === candidatesCount && isConsecutive)) {
                handleError(`You have not voted correctly below the line. You need to number ${candidatesCount} boxes from 1 to ${candidatesCount}.`);
                return false;
            }
        }
        return true;
    }


    function createCandidatesPreferenceList(candidates, votes) {
        const preferences = candidates.map((candidate, index) => {
            return { name: candidate.name, preference: votes[`below${index}`] };
        });

        const filteredPreferences = preferences.filter(p => p.preference);

        filteredPreferences.sort((a, b) => a.preference - b.preference);

        return filteredPreferences.map(p => p.name);
    }

    function createPartiesPreferenceList(Parties, votes) {
        const preferences = Parties.map((party, index) => {
            return { name: party.name, preference: votes[`above${index}`] };
        });
        const filteredPreferences = preferences.filter(p => p.preference);
        filteredPreferences.sort((a, b) => a.preference - b.preference);
        return filteredPreferences.map(p => p.name);
    }


    const hasAboveVotes = Object.keys(votes).some(key => key.startsWith('above') && votes[key] && votes[key] !== '');
    const hasBelowVotes = Object.keys(votes).some(key => key.startsWith('below') && votes[key] && votes[key] !== '');
    const hasVoted = user && (user.isVoted === true || user.isVoted === 'true');

    return (
        (receiveCandidates === false || receiveParties === false) ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <ClipLoader color="#2563EB" size={50} />
            </div>
        ) : hasVoted ? (
            <div className="Ballot">
                <div className="ballot-thanks-message">
                    <h1>Thank You!</h1>
                    <p className="ballot-description">You have successfully submitted your vote.</p>
                    <p className="ballot-description">Your participation is greatly appreciated.</p>
                    <p className="ballot-description">After the election is over, you can check the result <a href="/dashboard/voter_result">here</a>.</p>
                    <p className="ballot-description">You can now close this page now.</p>
                </div>
            </div>
        ) : (
            <>
                <div className="Ballot">
                    <h1>Senate Ballot</h1>
                    <div className="ballot-instructions">
                        <h3>How to Vote</h3>
                        <p className="ballot-description">You may vote in one of two ways:</p>
                        <ul className="ballot-instruction-list">
                            <li><strong>Above the line:</strong> Number all parties from 1 to {parties.length} in order of preference</li>
                            <li><strong>Below the line:</strong> Number all candidates from 1 to {candidates.length} in order of preference</li>
                        </ul>
                        <p className="ballot-description"><strong>Important:</strong> You can only vote above OR below the line, not both.</p>
                        <p className="ballot-description">You can vote by clicking the cards in order, or by typing numbers directly in the input fields.</p>
                    </div>
                    <h3>Either</h3>
                    <div className="parties-container">
                        {parties.map((party, index) => {
                            const voteId = `above${index}`;
                            const hasVote = votes[voteId] && votes[voteId] !== '';
                            const isDisabled = hasBelowVotes;
                            return (
                                <div 
                                    key={index} 
                                    className={`party-ballot ${hasVote ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
                                    onClick={() => !isDisabled && handleCardClick(voteId, index)}
                                    style={{ opacity: isDisabled ? 0.5 : 1, cursor: isDisabled ? 'not-allowed' : 'pointer' }}
                                >
                                    <input
                                        type="number"
                                        value={votes[voteId] || ''}
                                        min={"1"}
                                        onChange={(e) => handleVoteChange(voteId, e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                        onFocus={(e) => e.stopPropagation()}
                                        disabled={isDisabled}
                                    />
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        {party.name === 'Feline Progressive Party' && <FaCat />}
                                        {party.name === 'Canine Unity Party' && <FaDog />}
                                        {party.name === 'Avian Freedom Party' && <GiEgyptianBird />}
                                        {party.name}
                                    </label>
                                </div>
                            );
                        })}
                    </div>

                    <div className="ballot-divider"></div>

                    <h3>Or</h3>
                    <div className="candidates-container">
                        {candidates.map((candidate, index) => {
                            const voteId = `below${index}`;
                            const hasVote = votes[voteId] && votes[voteId] !== '';
                            const isDisabled = hasAboveVotes;
                            return (
                                <div 
                                    key={index} 
                                    className={`candidate-ballot ${hasVote ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
                                    onClick={() => !isDisabled && handleCardClick(voteId, index)}
                                    style={{ opacity: isDisabled ? 0.5 : 1, cursor: isDisabled ? 'not-allowed' : 'pointer' }}
                                >
                                    <input
                                        type="number"
                                        value={votes[voteId] || ''}
                                        min={"1"}
                                        onChange={(e) => handleVoteChange(voteId, e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                        onFocus={(e) => e.stopPropagation()}
                                        disabled={isDisabled}
                                    />
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        {candidate.party === 'Feline Progressive Party' && <FaCat />}
                                        {candidate.party === 'Canine Unity Party' && <FaDog />}
                                        {candidate.party === 'Avian Freedom Party' && <GiEgyptianBird />}
                                        {candidate.name}
                                    </label>
                                </div>
                            );
                        })}
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
                        <button
                            className="button ballot-button"
                            type="submit"
                            onClick={handleSubmit}
                            disabled={isSubmitting || user.isVoted.toString() === 'true'}
                        >
                            {user.isVoted.toString() === 'true' ? "You have already voted" :
                            isSubmitting ? "Submitting..." : "Submit"}
                        </button>
                        <button
                            className="button ballot-button ballot-clear-button"
                            type="button"
                            onClick={handleClearAll}
                            disabled={isSubmitting || Object.keys(votes).length === 0}
                        >
                            Clear All
                        </button>
                    </div>
                </div>
            </>
        )
    );
}

export default withRoleAccess(Ballot, "ROLE_VOTER");
