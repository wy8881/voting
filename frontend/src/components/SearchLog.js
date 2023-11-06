import {useContext, useEffect, useState} from "react";
import {checkAccess} from "../utils/Utils";
import {UserContext} from "../contexts/UserContext";
import {useNavigate} from "react-router-dom";
import withRoleAccess from "./withRoleAcess";

const SearchLog = () => {
    const[logs, setLogs] = useState([]);
    const[received, setReceived] = useState(false);
    const [username, setUsername] = useState('');
    const [action, setAction] = useState('');
    const {user} = useContext(UserContext);
    const {navigate} = useNavigate();


    function handleUsernameSearch() {
        console.log(username);
    }

    function handleActionSearch() {
        console.log(action);
    }

    return (
        <div>
            <div>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Search by username"
                />
                <button onClick={handleUsernameSearch}>Search</button>
            </div>

            <div>
                <input
                    type="text"
                    value={action}
                    onChange={(e) => setAction(e.target.value)}
                    placeholder="Search by action"
                />
                <button onClick={handleActionSearch}>Search</button>
            </div>
        </div>
    );
};

export default withRoleAccess(SearchLog, "ROLE_LOGGER");
