import React, { useState } from 'react';
import './Ballot.css';

export default function Ballot() {
    const [votes, setVotes] = useState({});

    const handleVoteChange = (id, value) => {
        setVotes({
            ...votes,
            [id]: value
        });
    };

    return (
        <div className="App">
            <h2>Senate Ballot Paper</h2>
            <p>You may vote in one of two ways</p>
            <h3>Either</h3>
            <p>Above the line</p>
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
            <p>Below the line</p>
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
        </div>
    );
}
