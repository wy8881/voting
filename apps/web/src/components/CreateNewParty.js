import '../styles/Register.css'
import { isNameValid} from "../utils/Utils";
import {useState} from "react";
import api from "../api/axiosConfig";
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
import withRoleAccess from "./withRoleAcess";
const CreateNewParty = () => {
    const [partyName, setPartyName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    function handleMsg(message, isError = false) {
        if (isError) {
            toast.error(message);
        } else {
            toast.success(message);
        }
        setPartyName("");
    }
    async function handleSubmit(e) {
        e.preventDefault();
        setIsSubmitting(true)
        if(partyName === "") {
            handleMsg("Party Name cannot be empty", true)
            setIsSubmitting(false);
            return;
        }
        if (!isNameValid(partyName)) {
            handleMsg("Party Name can only contain alphabets", true)
            setIsSubmitting(false);
            return;
        }
        try {
            await api.post('api/delegate/createParty', {
                "name": partyName
            }).then(resp => {
                handleMsg(resp.data.message, false)
            })
        } catch (error) {
            if(error.response && error.response.status === 400) {
                handleMsg(error.response.data.message, true)
            } else {
                handleMsg("Failed to create party", true)
            }
        }
        finally {
            setIsSubmitting(false)
        }

    }

    return (
        <div className={"container"}>
            <Toaster position="top-center" />
            <div className={"register-container"}>
                <h1> Create New Party </h1>
                <form onSubmit={handleSubmit}>
                    <div className={"input-container"}>
                        <label className={"input-label"} htmlFor={"partyName"}>Name</label>
                        <input
                            className={"input-field"}
                            id={"partyName"}
                            type={"partyName"}
                            placeholder={"party name"}
                            value={partyName}
                            maxLength={50}
                            onChange={(e) => setPartyName(e.target.value)}
                        />
                        <span className={"helper-text"}>Only alphabets and space for party name</span>
                    </div>
                    <button
                        className={"register-button"}
                        type={"submit"}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Creating...' : 'Create'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default withRoleAccess(CreateNewParty, "ROLE_DELEGATE");