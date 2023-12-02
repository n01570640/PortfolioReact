const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).send('Access token is missing or invalid');
    }

    try {
        const decoded = jwt.verify(token, '3cV7y6UzqR8w0xG4pJ2lL5oN1aM8fI3j');
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(403).send('Invalid token');
    }
};

module.exports = authenticateToken;