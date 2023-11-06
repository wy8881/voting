import {Navigate} from "react-router-dom";
import {useContext} from "react";
import {UserContext} from "../contexts/UserContext";

export default function withRoleAccess(WrappedComponent, role) {
    return function(props) {
        const { user } = useContext(UserContext);
        if(!user && !localStorage.getItem("user")) return (<Navigate to="/login" replace />);
        else if (user && user.role === role) {
            return <WrappedComponent {...props} />;
        } else {
            return <Navigate to="/dashboard" replace />;
        }
    }
}

