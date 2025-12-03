import {useState} from "react";
import withRoleAccess from "./withRoleAcess";
import '../styles/Logs.css'
import api from "../api/axiosConfig";
import {isUsernameValid} from "../utils/Utils";
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';

const  Logs = () => {
    const [logs, setLogs] = useState([]);
    const [username, setUsername] = useState("");
    const [action, setAction] = useState("");

    function handleError(error) {
        toast.error(error);
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
                const data = response.data;
                if (data.logs !== undefined) {
                    // Response is LogsWithQuotaResponse
                    setLogs(data.logs);
                    setAction("");
                    setUsername("");
                    if (data.remainingQuota !== undefined) {
                        toast.success(`Logs retrieved successfully. Remaining quota: ${data.remainingQuota}`);
                    } else {
                        toast.success('Logs retrieved successfully');
                    }
                } else if (Array.isArray(data)) {
                    // Response is array of logs (non-demo logger)
                    setLogs(data);
                    setAction("");
                    setUsername("");
                    if (data.length > 0) {
                        toast.success('Logs retrieved successfully');
                    }
                } else {
                    handleError('Invalid response format');
                }
            }).catch((error) => {
                const message = error.response?.data?.message || 'Failed to retrieve logs';
                handleError(message);
            })
        }
        else {
            handleError("Invalid username")
        }
    }

    async function onSearchByAction() {
        if(action !== "" && isActionValid(action)) {
            await api.get('api/logs/action/'+action).then((response) => {
                const data = response.data;
                if (data.logs !== undefined) {
                    // Response is LogsWithQuotaResponse
                    setLogs(data.logs);
                    setAction("")
                    setUsername("")
                    if (data.remainingQuota !== undefined) {
                        toast.success(`Logs retrieved successfully. Remaining quota: ${data.remainingQuota}`);
                    } else {
                        toast.success('Logs retrieved successfully');
                    }
                } else if (Array.isArray(data)) {
                    // Response is array of logs (non-demo logger)
                    setLogs(data);
                    setAction("")
                    setUsername("")
                    if (data.length > 0) {
                        toast.success('Logs retrieved successfully');
                    }
                } else {
                    handleError('Invalid response format');
                }
            }).catch((error) => {
                const message = error.response?.data?.message || 'Failed to retrieve logs';
                handleError(message);
            })
        }
        else {
            handleError("Invalid action")
        }
    }

    async function onDownloadAllLogs() {
        await api.get('api/logs/all').then((response) => {
            const data = response.data;
            let logsArray = [];
            
            if (data.logs !== undefined) {
                logsArray = data.logs;
            } else if (Array.isArray(data)) {
                logsArray = data;
            } else {
                handleError('Invalid response format');
                return;
            }
            
            let log_list = [];
            logsArray.forEach((log) => {
                log_list.push(log.username + " " + log.action + " " + log.id.date);
            });

            let log_string = "";
            log_list.forEach((log) => {
                log_string += log + "\n";
            });

            const element = document.createElement("a");
            const file = new Blob([log_string], {type: 'text/plain'});
            element.href = URL.createObjectURL(file);
            element.download = "logs.txt";
            document.body.appendChild(element);
            element.click();

            URL.revokeObjectURL(element.href);
            document.body.removeChild(element);
            
            if (data.remainingQuota !== undefined) {
                toast.success(`Logs downloaded successfully. Remaining quota: ${data.remainingQuota}`);
            } else {
                toast.success('Logs downloaded successfully');
            }
        }).catch((error) => {
            const message = error.response?.data?.message || 'Failed to download logs';
            handleError(message);
        })
    }

    return (
        <div className={"logs-container"}>
            <Toaster position="top-center" />
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