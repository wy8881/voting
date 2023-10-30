export function isUsernameValid(username) {
    const regex = /^[A-Za-z0-9]+$/;
    return regex.test(username);
}