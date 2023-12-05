const jwt = require('jsonwebtoken');

/**
 * Middleware to authenticate a JWT token in the request.
 * This function extracts the token from the authorization header, verifies it,
 * and appends the decoded user information to the request object.
 * If the token is missing, invalid, or expired, it sends an appropriate HTTP response.
 *
 * @param {object} req - The request object from Express.js, containing headers and other request information.
 * @param {object} res - The response object from Express.js, used to send back responses to the client.
 * @param {function} next - Callback function to pass control to the next middleware in the stack.
 */

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).send('Access token is missing or invalid');
    }

    try {
        const decoded = jwt.verify(token, '3cV7y6UzqR8w0xG4pJ2lL5oN1aM8fI3j');
        req.userId = decoded.userId;
        req.userType = decoded.userType;
        next();
    } catch (error) {
        res.status(403).send('Invalid token');
    }
};

module.exports = authenticateToken;