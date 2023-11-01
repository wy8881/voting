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