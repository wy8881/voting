
export function isUsernameValid(username) {
    const regex = /^[A-Za-z0-9]+$/;
    return regex.test(username);
}

export function isNameValid(input) {
    // This regex pattern matches strings that contain only spaces,
    // uppercase letters, and lowercase letters
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
        console.log(sessionStorage.getItem('Bearer'))
        api.defaults.headers.common['Authorization'] = sessionStorage.getItem('Bearer');
    }
}
