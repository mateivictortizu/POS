export default function logout() {
    //TODO add callback to BE to move to blacklist the token
    localStorage.removeItem("token");
    window.location.reload();
}