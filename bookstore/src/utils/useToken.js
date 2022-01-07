import jwt_decode from "jwt-decode";

export default function check_expired() {
    var isExpired = false;
    const token = localStorage.getItem('token');
    var decodedToken = jwt_decode(token, { complete: true });
    var dateNow = new Date();
    if (decodedToken.exp * 1000 < dateNow.getTime()) {
        isExpired = true;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
    return isExpired;
}
