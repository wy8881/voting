import {Navigate} from "react-router-dom";
import {useContext} from "react";
import {UserContext} from "../contexts/UserContext";
import { ClipLoader } from 'react-spinners';

export default function withRoleAccess(WrappedComponent, role) {
    return function(props) {
        const { user, loading } = useContext(UserContext);
        if(loading) {
            return <div style={{display:'flex', justifyContent:'center', alignItems:'center', minHeight:'50vh'}}>
                <ClipLoader color="#2563EB" size={50} />
            </div>
        }
        if(!user) {
            console.log('no user')
            return (<Navigate to="/login" replace />);
        }
        else if ((user && user.role === role) || (role === 'ROLE_USER' && user.role.startsWith('ROLE_'))) {
            return <WrappedComponent {...props} />;
        } else {
            return <Navigate to="/dashboard" replace />;
        }
    }
}

