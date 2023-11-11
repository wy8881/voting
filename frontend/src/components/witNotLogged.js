import {Navigate} from "react-router-dom";
import {useContext} from "react";
import {UserContext} from "../contexts/UserContext";

export default function withNoLogged(WrappedComponent) {
    return function(props) {
        const { user, loading } = useContext(UserContext);
        if(loading) {
            return <div style={{display:'flex', justifyContent:'center'}}><h1>Loading...</h1></div>
        }
        if(!user) {
            return <WrappedComponent {...props} />;
        }
        else {
            return <Navigate to="/dashboard" replace />;
        }
    }
}