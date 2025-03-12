import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { jwtToken } from '../Modules/Auth/Auth.Controller.js';



// Middleware to authenticate the user
// 1. Check if the authorization header exists
// 2. Extract the token from the header
// 3. Verify the token
// 4. If the token is valid, extract user data
// 5. Attach user data to the request object
// 6. If the token is expired, generate a new token and attach it to the request object
// 7. Continue to the next middleware or route handler
// 8. Handle errors if any and pass them to the error handling middleware
function auth(req, res, next) {
    try {
        // Check if authorization header exists
        if (!req.headers.authorization) {
            return next(createHttpError.Unauthorized('Authorization header missing'));
        }

        // Extract token from header
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return next(createHttpError.Unauthorized('Token missing'));
        }

        // Verify the token
        jwt.verify(token, process.env.SECRET_KEY, (err, verified) => {

            if (err) {
            
                if (err.name === 'TokenExpiredError') {

                    const expiredAt = new Date(err.expiredAt).getTime();
                    const now = new Date().getTime();
                    const refreshPeriod = 20 * 24 * 60 * 60 * 1000; // 20 days in milliseconds

                    // Check if the token is within the refresh period
                    if (now - expiredAt > refreshPeriod) {
                        return next(createHttpError.Forbidden('Token Expired'));
                    }

                    // Decode the expired token to get user data
                    const decoded = jwt.decode(token);
                    if (!decoded) {
                        return next(createHttpError.Unauthorized('Invalid Token'));
                    }

                    // Generate a new token
                    const refreshed_jwt = jwtToken(decoded, '10s');
                    const newToken = refreshed_jwt.token;
                    const userDTO = refreshed_jwt.userDTO;

                    // Attach the new token and user data to the request
                    req.session.user = userDTO;
                    req.session.token = newToken;

                    return next();

                } else {
                    return next(createHttpError.Unauthorized('Invalid Token'));
                }
            }

            // If the token is valid, extract user data
            if (!verified) {
                return next(createHttpError.Unauthorized('Invalid Token'));
            }

            const userDTO = {
                id: verified.id,
                name: verified.name,
                title: verified.title,
                bio: verified.bio,
                post_count: verified.post_count,
                email: verified.email,
                slug: verified.slug,
                img: verified.img,
                follower_count: verified.follower_count,
                following_count: verified.following_count,
                task_done: verified.task_done,
                project_done: verified.project_done,
                img_bg: verified.img_bg
            };

            // Attach user data to the request
            req.session.user = userDTO;

            // Continue to the next middleware or route handler
            next();
        });

    } catch (error) {

        next(error);
    }
}

export default auth;