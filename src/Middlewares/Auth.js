import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';

function auth(req, res, next) {

    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded; // Attach the decoded user information to the request object
        next();
    } catch (ex) {
        next(new createHttpError.Unauthorized('Invalid token.'));
    }
    
}

export default auth;