import {useContext, useEffect, useState} from "react";
import api from '../api/axiosConfig';
import {UserContext} from "../contexts/UserContext";
import {useNavigate} from "react-router-dom";
import Sidebar from "./Sidebar";
import '../styles/DelegatePage.css';
import {checkAccess} from "../utils/Utils";
import withRoleAccess from "./withRoleAcess";
import candidates from "./Candidates";

const ManageParties = () =>{
    const [parties, setParties] = useState([]);
    const [received, setReceived] = useState(false);

    useEffect(() => {
        async function fetchParties() {
            try {
                setReceived(false)
                await api.get('api/user/allParties').then(resp => {
                    setParties(resp.data);
                    console.log(resp.data)
                    setReceived(true)
                })
            } catch (error) {
                console.log(error)
            }
        }
        fetchParties();
    },[]);


    return (
        <div className="delegate-container">
            <Sidebar />
            <h1>Manage Parties</h1>
            {!received ?(
                <div>Loading...</div>
            ) : (
                <>
                    {parties && parties.length > 0 && parties.map(party => (
                        <div className={'delegate-row'}>
                            <div>Name: {party.name}</div>
                            {party.candidates && party.candidates.length > 0 ? <div>Candidates: {party.candidates.join(', ')}</div> : <div>No Candidates</div>}
                        </div>
                    ))}
                    {parties && parties.length === 0 && (
                        <div>No parties</div>
                    )}
                </>
            )}
        </div>
    );
}

export default withRoleAccess(ManageParties, "ROLE_DELEGATE");