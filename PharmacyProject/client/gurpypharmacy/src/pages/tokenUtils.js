export const decodeToken = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(atob(base64));
        return payload; // or return payload.userId directly, based on your preference
    } catch (error) {
        console.error("Error decoding token: ", error);
        return null;
    }
};

export function getToken() {
    return localStorage.getItem('userToken');
}