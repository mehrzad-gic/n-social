import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { jwtToken } from '../Modules/Auth/Auth.Controller.js';
import User from '../Modules/User/UserModel.js';
import { UserNotFoundInToken, TokenExpired, InvalidToken, TokenNotFound, TokenNotValid, AuthorizationHeaderMissing, TokenMissing } from '../Common/Messages.js';

export const checkUser = async (userDTO) => {
    try{
        const user = await User.findByPk(userDTO.id);        
        if(!user) return false;
        return { user, status: true }
    } catch(err){   
        return { status: false }
    }
}

function auth(req, res, next) {
    try {
        // Check if authorization header exists
        if (!req.headers?.authorization) return next(createHttpError.Unauthorized(AuthorizationHeaderMissing));

        // Extract token from header
        const token = req.headers.authorization.split(' ')[1];
        if (!token) return next(createHttpError.Unauthorized(TokenMissing));

        // Verify the token
        jwt.verify(token, process.env.SECRET_KEY, async (err, verified) => {

            if (err) {
                if (err.name === 'TokenExpiredError') {
                    // Decode the expired token to get user data
                    const decoded = jwt.decode(token);
                    
                    if (!decoded) return next(createHttpError.Unauthorized(InvalidToken));

                    // Check if user exists
                    const { user, status } = await checkUser(decoded);
                    if (!status) return next(createHttpError.NotFound(UserNotFoundInToken));

                    const expiredAt = new Date(err.expiredAt).getTime();
                    const now = new Date().getTime();
                    const refreshPeriod = 20 * 24 * 60 * 60 * 1000; // 20 days in milliseconds

                    // Check if the token is within the refresh period
                    if (now - expiredAt > refreshPeriod) return next(createHttpError.Forbidden(TokenExpired));

                    // Generate new token
                    const refreshed_jwt = jwtToken(user, '30s');
                    const newToken = refreshed_jwt.token;

                    // Create userDTO
                    const userDTO = {
                        id: user.id,
                        name: user.name,
                        title: user.title,
                        bio: user.bio,
                        post_count: user.post_count,
                        email: user.email,
                        slug: user.slug,
                        img: user.img,
                        follower_count: user.follower_count,
                        following_count: user.following_count,
                        task_done: user.task_done,
                        project_done: user.project_done,
                        img_bg: user.img_bg,
                        birthday: user.birthday,
                        github: user.github,
                        x: user.x
                    };

                    // Attach the new token and user data to the request
                    req.session.user = userDTO;
                    req.session.token = newToken;

                    return next();

                } else {
                    return next(createHttpError.Unauthorized(InvalidToken));
                }
            }

            // If the token is valid, extract user data
            if (!verified) return next(createHttpError.Unauthorized(InvalidToken));

            // Check if user exists
            const { user, status } = await checkUser(verified);
            if (!status) return next(createHttpError.NotFound(UserNotFoundInToken));

            // Create userDTO
            const userDTO = {
                id: user.id,
                name: user.name,
                title: user.title,
                bio: user.bio,
                post_count: user.post_count,
                email: user.email,
                slug: user.slug,
                img: user.img,
                follower_count: user.follower_count,
                following_count: user.following_count,
                task_done: user.task_done,
                project_done: user.project_done,
                img_bg: user.img_bg,
                birthday: user.birthday,
                github: user.github,
                x: user.x
            };

            // Attach user data to the request
            req.session.user = userDTO;

            next();
        });
    } catch (error) {
        next(error);
    }
}

export default auth; 