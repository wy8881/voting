import '../styles/Register.css'
import {isNameValid} from "../utils/Utils";
import {useState, useEffect} from "react";
import api from "../api/axiosConfig";
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
import { ClipLoader } from 'react-spinners';
import withRoleAccess from "./withRoleAcess";
const CreateNewCandidate = ()  => {
    const [name, setName] = useState("");
    const [party, setParty] = useState("");
    const [rank, setRank] = useState("");
    const [parties, setParties] = useState([]);
    const [loadingParties, setLoadingParties] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchParties();
    }, []);

    const fetchParties = async () => {
        try {
            setLoadingParties(true);
            const resp = await api.get('api/user/allParties');
            setParties(resp.data || []);
        } catch (error) {
            console.error('Error fetching parties:', error);
            const message = error.response?.data?.message || 'Failed to load parties';
            toast.error(message);
        } finally {
            setLoadingParties(false);
        }
    };
    function handleMsg(message, isError = false) {
        if (isError) {
            toast.error(message);
        } else {
            toast.success(message);
        }
        setName("");
        setParty("")
        setRank("")
    }
    async function handleSubmit(e) {
        e.preventDefault();
        setIsSubmitting(true)
        if(name === "") {
            handleMsg("Candidate name cannot be empty", true)
            setIsSubmitting(false);
            return;
        }
        if(party === "") {
            handleMsg("The candidate must be associated with a party", true)
            setIsSubmitting(false);
            return;
        }
        if (!isNameValid(name)) {
            handleMsg("Candidate name can only contain alphabets and space", true)
            setIsSubmitting(false);
            return;
        }
        try {
            await api.post('api/delegate/createCandidate', {
                "name": name,
                "party": party,
                "rank": rank
            }).then(resp => {
                handleMsg(resp.data.message, false)
            })
        } catch (error) {
            console.log(error)
            if(error.response && error.response.status === 400) {
                handleMsg(error.response.data.message, true)
            } else {
                handleMsg("Failed to create candidate", true)
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
                <h1> Create New Candidate </h1>
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
                        {loadingParties ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <ClipLoader color="#2563EB" size={20} />
                            </div>
                        ) : (
                            <select
                                className={"input-field"}
                                id={"partyName"}
                                value={party}
                                onChange={(e) => setParty(e.target.value)}
                                required
                            >
                                <option value="">Select a party</option>
                                {parties.map((p) => (
                                    <option key={p.name} value={p.name}>
                                        {p.name}
                                    </option>
                                ))}
                            </select>
                        )}
                        <span className={"helper-text"}>Select a party from the list</span>
                    </div>
                    <div className={"input-container"}>
                        <label className={"input-label"} htmlFor={"partyName"}>Rank</label>
                        <input
                            style={{width: '100px'}}
                            className={"input-field"}
                            id={"rank"}
                            type={"number"}
                            min={1}
                            max={2}
                            placeholder={"rank"}
                            value={rank}
                            maxLength={1}
                            onChange={(e) => setRank(e.target.value)}
                        />
                        <span className={"helper-text"}>Only 1 or 2 for the rank. 2 with higher preference</span>
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

export default withRoleAccess(CreateNewCandidate, 'ROLE_DELEGATE');