import "../styles/DelegatePage.css"
import Sidebar from "./Sidebar";
import {Link} from "react-router-dom";
export default function Parties() {
    return (
        <div className="delegate-container">
            <Sidebar />
            <h1>Parties</h1>
            <div className="button-container">
                <Link to={"/dashboard/parties/create"}>
                    <button className="button" style={{marginRight:'50px'}}> Create New </button>
                </Link>
                <Link to={"/dashboard/parties/manage"}>
                    <button className="button" > Manage All </button>
                </Link>
            </div>
        </div>
    );
}