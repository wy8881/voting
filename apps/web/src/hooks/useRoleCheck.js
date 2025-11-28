import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';

export function useRoleCheck() {
    const { user } = useContext(UserContext);

    const hasRole = (role) => {
        return user?.role === role;
    };

    const hasAnyRole = (roles) => {
        return user && roles.includes(user.role);
    };

    const isAdmin = () => {
        return hasRole('ROLE_ADMIN');
    };

    const isVoter = () => {
        return hasRole('ROLE_VOTER');
    };

    const isDelegate = () => {
        return hasRole('ROLE_DELEGATE');
    };

    const isLogger = () => {
        return hasRole('ROLE_LOGGER');
    };

    const isAuthenticated = () => {
        return user !== null && user !== undefined;
    };

    return {
        user,
        hasRole,
        hasAnyRole,
        isAdmin,
        isVoter,
        isDelegate,
        isLogger,
        isAuthenticated,
    };
}

