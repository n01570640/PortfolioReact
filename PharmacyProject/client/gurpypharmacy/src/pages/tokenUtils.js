/**
 * decodeToken: Decodes a JWT token to extract its payload.
 * 
 * @param {string} token - The JWT token to be decoded.
 * @returns The decoded payload of the token or null if decoding fails.
 */
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

/**
 * getToken: Retrieves the user token from localStorage.
 * 
 * @returns The user token stored in localStorage.
 */
export function getToken() {
    return localStorage.getItem('userToken');
}