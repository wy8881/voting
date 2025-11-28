import {Navigate} from "react-router-dom";
import {useContext} from "react";
import {UserContext} from "../contexts/UserContext";
import { ClipLoader } from 'react-spinners';

export default function withNoLogged(WrappedComponent) {
    return function(props) {
        const { user, loading } = useContext(UserContext);
        if(loading) {
            return <div style={{display:'flex', justifyContent:'center', alignItems:'center', minHeight:'50vh'}}>
                <ClipLoader color="#2563EB" size={50} />
            </div>
        }
        if(!user) {
            return <WrappedComponent {...props} />;
        }
        else {
            return <Navigate to="/dashboard" replace />;
        }
    }
}