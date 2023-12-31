import '../styles/Register.css'
import { isNameValid} from "../utils/Utils";
import {useContext,  useState} from "react";
import api from "../api/axiosConfig";
import Sidebar from "./Sidebar";
import {useNavigate} from "react-router-dom";
import {UserContext} from "../contexts/UserContext";
import withRoleAccess from "./withRoleAcess";
const CreateNewParty = () => {
    const [partyName, setPartyName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const {user} = useContext(UserContext);

    function handleMsg(message) {
        window.alert(message);
        setPartyName("");
    }
    async function handleSubmit(e) {
        e.preventDefault();
        setIsSubmitting(true)
        if(partyName === "") {
            handleMsg("Party Name cannot be empty")
            return;
        }
        if (!isNameValid(partyName)) {
            handleMsg("Party Name can only contain alphabets")
            return;
        }
        try {
            await api.post('api/delegate/createParty', {
                "name": partyName
            }).then(resp => {
                handleMsg(resp.data.message)
            })
        } catch (error) {
            if(error.response.status === 400) {
                handleMsg(error.response.data.message)
            }
        }
        finally {
            setIsSubmitting(false)
        }

    }

    async function handleTest(e) {
        e.preventDefault();
        try {
            await api.get('api/delegate/test')
        } catch (error) {
            console.log(error)
        }
    }

    async function handleTest2(e) {
        e.preventDefault();
        try {
            await api.post('api/auth/test')
        } catch (error) {
            console.log(error)
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