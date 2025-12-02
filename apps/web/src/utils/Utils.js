
export function isUsernameValid(username) {
    const regex = /^[A-Za-z0-9]+$/;
    return regex.test(username);
}

export function isNameValid(input) {
    const regex = /^[a-zA-Z\s]*$/;
    return regex.test(input);
}

export function isPasswordValid(password) {
    const regex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&#])(?=\S+$).{8,}$/;
    return regex.test(password);
}

export function isEmailValid(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return regex.test(email);
}

export function setToken(resp, api,msg) {

    if(resp.data.token) {
        sessionStorage.setItem("Bearer", resp.data.token);
        api.defaults.headers.common['Authorization'] = sessionStorage.getItem("Bearer");
    }    else {
        throw new Error(msg)
    }

}

export function reloadToken(api){
    if(sessionStorage.getItem('Bearer')) {
        api.defaults.headers.common['Authorization'] = sessionStorage.getItem('Bearer');
    }
}

export function decodeJwtToken(token) {
    try {
        if (!token) return null;
        
        const tokenWithoutBearer = token.startsWith('Bearer ') ? token.substring(7) : token;
        const parts = tokenWithoutBearer.split('.');
        
        if (parts.length !== 3) {
            console.error('Invalid JWT token format');
            return null;
        }
        
        const payload = parts[1];
        let base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
        
        while (base64.length % 4) {
            base64 += '=';
        }
        
        const decodedPayload = JSON.parse(atob(base64));
        
        return {
            username: decodedPayload.sub,
            role: decodedPayload.role,
            issuedAt: decodedPayload.iat,
            expiration: decodedPayload.exp
        };
    } catch (error) {
        console.error('Error decoding JWT token:', error);
        return null;
    }
}

export function getRoleFromToken() {
    const token = sessionStorage.getItem('Bearer');
    if (!token) return null;
    
    const decoded = decodeJwtToken(token);
    return decoded ? decoded.role : null;
}

export function getUsernameFromToken() {
    const token = sessionStorage.getItem('Bearer');
    if (!token) return null;
    
    const decoded = decodeJwtToken(token);
    return decoded ? decoded.username : null;
}
