import '../styles/Register.css'
import {checkAccess, isNameValid} from "../utils/Utils";
import {useContext, useEffect, useState} from "react";
import api from "../api/axiosConfig";
import Sidebar from "./Sidebar";
import {UserContext} from "../contexts/UserContext";
import {useNavigate} from "react-router-dom";
import withRoleAccess from "./withRoleAcess";
const CreateNewCandidate = ()  => {
    const [name, setName] = useState("");
    const [party, setParty] = useState("");
    const {user, reloadUser} = useContext(UserContext);
    const {navigate} = useNavigate();
    function handleMsg(message) {
        window.alert(message);
        setName("");
        setParty("")
    }
    async function handleSubmit(e) {
        e.preventDefault();
        if(name === "") {
            handleMsg("Candidate name cannot be empty")
            return;
        }
        if(party === "") {
            handleMsg("The candidate must be associated with a party")
            return;
        }
        if (!isNameValid(name)) {
            handleMsg("Candidate name can only contain alphabets and space")
            return;
        }
        try {
            await api.post('api/delegate/createCandidate', {
                "name": name,
                "party": party
            }).then(resp => {
                handleMsg(resp.data.message)
            })
        } catch (error) {
            if(error.response.status === 400) {
                handleMsg(error.response.data.message)
            }
        }

    }


    return (
        <div className={"container"}>
            <Sidebar/>
            <div className={"register-container"}>
                <h1> Create New Party </h1>
                <form onSubmit={handleSubmit}>
                    <div className={"input-container"}>
                        <label className={"input-label"} htmlFor={"partyName"}>Name</label>
                        <input
                            className={"input-field"}
                            id={"candidateName"}
                            type={"candidateName"}
                            placeholder={"candidate name"}
                            value={name}
                            maxLength={50}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <span className={"helper-text"}>Only alphabets and space for candidate's name</span>
                    </div>
                    <div className={"input-container"}>
                        <label className={"input-label"} htmlFor={"partyName"}>Party</label>
                        <input
                            className={"input-field"}
                            id={"partyName"}
                            type={"partyName"}
                            placeholder={"party name"}
                            value={party}
                            maxLength={50}
                            onChange={(e) => setParty(e.target.value)}
                        />
                        <span className={"helper-text"}>Only alphabets and space for party name</span>
                    </div>
                    <button className={"register-button"} type={"submit"}>Create</button>
                </form>
            </div>
        </div>
    );
}

export default withRoleAccess(CreateNewCandidate, ['ROLE_DELEGATE']);