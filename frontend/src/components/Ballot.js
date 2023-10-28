import React, { useState } from 'react';
import './Ballot.css';

export default function Ballot() {
    const [votes, setVotes] = useState({});

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
        if(checkCorrecrtMethod() && checkCorrectNumber()) {
            console.log("submitted");
        }
    }

    function checkCorrecrtMethod() {
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
        // if(!voteValues.every(Number.isInteger)){
        //     handleError("You can only vote with integers");
        //     return false;
        // }
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
            if(!(isUnique(voteValues) && minVote === 1 && voteValues.length >= 6 && isConsecutive)) {
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

    function checkValid() {


    }


    return (
        <div className="Ballot">
            <h2>Senate Ballot Paper</h2>
            <p>You may vote in one of two ways</p>
            <h3>Either</h3>
            <div className="above-line">
                {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="party">
                        <input
                            type="number"
                            value={votes[`above${index}`] || ''}
                            onChange={(e) => handleVoteChange(`above${index}`, e.target.value)}
                        />
                        <label>Party</label>
                    </div>
                ))}
            </div>

            <h3>Or</h3>
            <div className="below-line">
                {Array.from({ length: 12 }).map((_, index) => (
                    <div key={index} className="candidate">
                        <input
                            type="number"
                            value={votes[`below${index}`] || ''}
                            onChange={(e) => handleVoteChange(`below${index}`, e.target.value)}
                        />
                        <label>Surname</label>
                        <label>Given Names</label>
                    </div>
                ))}
            </div>
            <button className="submit-button" type="submit" onClick={handleSubmit}>Submit</button>
        </div>
    );
}
