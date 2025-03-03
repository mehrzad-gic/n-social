import createHttpError from 'http-errors';
import User from '../Modules/User/UserModel.js'; // Adjust the path as necessary

async function verifyEmail(req, res, next) {

    try {

        const user = await User.findByPk(req.user.id);

        if (!user) return next(new createHttpError.NotFound('User not found.'));
        
        if (!user.email_verified_at) return next(new createHttpError.Forbidden('Email not verified.'));

        next();

    } catch (error) {
        
        next(error);
    }
}

export default verifyEmail;