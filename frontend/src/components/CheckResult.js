import withRoleAccess from "./withRoleAcess";
import {useEffect, useState} from "react";
import api from "../api/axiosConfig";
import '../styles/DelegatePage.css';
import Sidebar from "./Sidebar";
const CheckResult = () => {
    const [results, setResults] = useState([]);
    const [received, setReceived] = useState(false);
    useEffect(() => {
        async function fetchResult() {
            try {
                await api.get('api/voter/result').then(resp => {
                    setResults(resp.data.sort((a, b) =>{
                        if(a.totalVotes === b.totalVotes) {
                            return a.candidateName.localeCompare(b.candidateName);
                        }
                        return b.totalVotes - a.totalVotes
                    }  ));
                    setReceived(true);
                })
            } catch (error) {
                console.log(error)
            }
        }
      fetchResult();
    }, [])

    return (
        <div className="delegate-container">
            <Sidebar />
            <h1>Check Result</h1>
            {!received ? (
                <div>Loading...</div>
            ) : (
                <>
                    {results && results.length > 0 && results.map(result => (
                        <div className={'delegate-row'}>
                            <div>Name: {result.candidateName}</div>
                            <div>Votes: {result.totalVotes}</div>
                        </div>
                    ))}
                    {results && results.length === 0 && (
                        <div>No result</div>
                    )}
                </>
            )}
        </div>
    );


}

export default withRoleAccess(CheckResult, "ROLE_VOTER");