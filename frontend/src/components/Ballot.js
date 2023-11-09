import React, {useContext, useEffect, useState} from 'react';
import '../styles/Ballot.css';
import Sidebar from "./Sidebar";
import {useNavigate} from "react-router-dom";
import {UserContext} from "../contexts/UserContext";
import api from "../api/axiosConfig";
import withRoleAccess from "./withRoleAcess";

const Ballot = () => {
    const [votes, setVotes] = useState({});
    const [parties, setParties] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const [receiveParties, setReceiveParties] = useState(false);
    const [receiveCandidates, setReceiveCandidates] = useState(false);
    const navigate = useNavigate();
    const {user} = useContext(UserContext);

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
        setVotes({
            ...votes,
            [id]: value
        });
    }

    function handleError(message) {
        window.alert(message);
        setVotes({});
    }

    function handleSubmit(e) {
        e.preventDefault();
        if(checkCorrectMethod() && checkCorrectNumber()) {
            console.log("submitted");
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
            if(!(isUnique(voteValues) && minVote === 1 && voteValues.length >= 6&& isConsecutive)) {
                handleError("You have not voted correctly above the line. You need to number at least six boxes from 1 to 6.");
                return false;
        }

        }


        if (isBelowLine) {
            if(!(isUnique(voteValues) && minVote === 1 && voteValues.length >= 12 && isConsecutive)) {
                handleError("You have not voted correctly below the line. You need to number at least twelve boxes from 1 to 12.");
                return false;
            }
        }
        return true;
    }



    return (
        (receiveCandidates === false || receiveParties === false) ? (
            <h1>Loading...</h1>
        ) : (
            <>
                <div className="Ballot">
                    <Sidebar />
                    <h1>Senate Ballot</h1>
                    <p>You may vote in one of two ways</p>
                    <h3>Either</h3>
                    <div className="line-container">
                        {parties.map((party, index) => (
                            <div key={index} className="party">
                                <input
                                    type="number"
                                    value={votes[`above${index}`] || ''}
                                    onChange={(e) => handleVoteChange(`above${index}`, e.target.value)}
                                />
                                <label>{party.name}</label>
                            </div>
                        ))}
                    </div>

                    <h3>Or</h3>
                    <div className="line-container">
                        {candidates.map((candidate, index) => (
                            <div key={index} className="candidate">
                                <input
                                    type="number"
                                    value={votes[`below${index}`] || ''}
                                    onChange={(e) => handleVoteChange(`below${index}`, e.target.value)}
                                />
                                <label>{candidate.name}</label>
                            </div>
                        ))}
                    </div>
                    <button className="submit-button" type="submit" onClick={handleSubmit}>Submit</button>
                </div>
            </>
        )
    );
}

export default withRoleAccess(Ballot, "ROLE_VOTER");
