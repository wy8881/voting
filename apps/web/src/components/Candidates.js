import "../styles/DelegatePage.css"
import Sidebar from "./Sidebar";
import {Link} from "react-router-dom";
import withRoleAccess from "./withRoleAcess";
const Candidates = () =>{
    return (
        <div className="delegate-container">
            <Sidebar />
            <h1>Candidates</h1>
            <div className="button-container">
                <Link to={"/dashboard/candidates/create"}>
                    <button className="button" style={{marginRight:'50px'}}> Create New </button>
                </Link>
                <Link to={"/dashboard/candidates/manage"}>
                    <button className="button" > Manage All </button>
                </Link>
            </div>
        </div>
    );
}

export default withRoleAccess(Candidates, "ROLE_DELEGATE");