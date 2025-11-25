import {useState} from "react";
import withRoleAccess from "./withRoleAcess";
import '../styles/Logs.css'
import api from "../api/axiosConfig";
import {isUsernameValid} from "../utils/Utils";
import Sidebar from "./Sidebar";

const  Logs = () => {
    const [logs, setLogs] = useState([]);
    const [username, setUsername] = useState("");
    const [action, setAction] = useState("");

    function handleError(error) {
        window.alert(error);
        setUsername("");
        setAction("");
    }

    function isActionValid(action) {
        const regex = /^[a-zA-Z]*$/;
        return regex.test(action);
    }

    async function onSearchByUsername() {
        if(username !== "" && isUsernameValid(username)) {
            await api.get('api/logs/username/'+username).then((response) => {
                setLogs(response.data);
                setAction("");
                setUsername("");
            }).catch((error) => {
                console.log(error);
            })
        }
        else {
            handleError("Invalid username")
        }
    }

    async function onSearchByAction() {
        if(action !== "" && isActionValid(action)) {
            await api.get('api/logs/action/'+action).then((response) => {
                setLogs(response.data);
                setAction("")
                setUsername("")
            }).catch((error) => {
                console.log(error);
            })
        }
        else {
            handleError("Invalid action")
        }
    }

    // download all logs
    async function onDownloadAllLogs() {
        await api.get('api/logs/all').then((response) => {
            // convret recived data to list of strings
            let log_list = [];

            response.data.forEach((log) => {
                log_list.push(log.username + " " + log.action + " " + log.id.date);
            });

            // convert list of strings to string
            let log_string = "";
            log_list.forEach((log) => {
                log_string += log + "\n";
            });

            const element = document.createElement("a");
            const file = new Blob([log_string], {type: 'text/plain'});
            element.href = URL.createObjectURL(file);
            element.download = "logs.txt";
            document.body.appendChild(element); // Required in FireFox
            element.click();

            URL.revokeObjectURL(element.href);
        }).catch((error) => {
            console.log(error);
        })
    }

    return (
        <div className={"logs-container"}>
            <Sidebar/>
            <h1>Logs</h1>
            <div className={"search-container"}>
                <div className={"search-bar"}>
                    <input type="text"
                           value={username}
                           placeholder={"Username"}
                           onChange={(e) => setUsername(e.target.value)}
                    />
                    <button onClick={onSearchByUsername}>Search</button>
                </div>
                <div className={"search-bar"}>
                    <input
                        type="text"
                        value={action}
                        placeholder={"Action"}
                        onChange={(e) => setAction(e.target.value)}/>
                    <button onClick={onSearchByAction}>Search</button>
                </div>
                <div>
                    <button onClick={onDownloadAllLogs}>Download All Logs</button>
                </div>
            </div>
            {logs.length !==0 && (
                <>
                    <div className={"logs-table"}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Action</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map((log) => (
                                    <tr>
                                        <td>{log.username}</td>
                                        <td>{log.action}</td>
                                        <td>{log.id.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

        </div>
    );
}

export default withRoleAccess(Logs, "ROLE_LOGGER");