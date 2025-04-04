import User from "../User/UserModel.js";
import ResetPassword from "../ResetPassword/ResetPasswordModel.js";
import { checkExistByField, makeOTP, verifyHashPassword, generateRandomPassword, makeHashPassword, makeSlug } from "../../Helpers/Helper.js";
import { sendMail } from "../../Helpers/NodeMailer.js";
import createHttpError from "http-errors";
import OTP from "../Otp/OtpModel.js";
import jwt from 'jsonwebtoken';
import { registerSchema, loginSchema, resetPasswordSchema, confirmResetPasswordSchema } from './validation.js';
import { checkUser } from "../../Middlewares/Auth.js";


function jwtToken(user, expire = '30s') {

    const userDTO = {
        id:user.id,
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

    const token = jwt.sign(userDTO, process.env.SECRET_KEY, { expiresIn: expire });

    return { token, userDTO };
}


async function register(req, res, next) {

    try {

        await registerSchema.validate(req.body);

        const existingUser = await checkExistByField('email', req.body.email, 'users');
        if (existingUser) throw new createHttpError.Conflict('User Already Exists');

        const { name, email, password } = req.body;
        const hash_password = await makeHashPassword(password);
        const slug = await makeSlug(name, 'users');
        console.log(slug);

        const user = await User.create({ name, slug, email, password: hash_password });

        res.status(201).json({ data: user, message: 'User Registered Successfully', success: true });

    } catch (e) {
        next(e);
    }
    
}


async function login(req, res, next) {

    try {

        await loginSchema.validate(req.body);

        const { email, password } = req.body;
        const user = await checkExistByField('email', email, 'users');
        if (!user) throw new createHttpError.NotFound("User Not Found");

        if (!await verifyHashPassword(user.password, password)) throw new createHttpError.Forbidden("Invalid Password");

        // check otp time
        const otp_record = await OTP.findOne({ where: { user_id: user.id } });
        if (otp_record && otp_record.expires_in > Date.now()) throw new createHttpError.BadRequest('An OTP code has already been sent to your email');  

        // send otp code
        const new_otp_record = await OTP.create({
            code: makeOTP().code,
            expires_in: makeOTP().expire,
            user_id: user.id,
            email: user.email
        });

        if(otp_record) await otp_record.destroy();
        
        const subject = 'Your OTP Code';
        const text = `Your OTP code is: ${new_otp_record.code}. It will expire in 2 minutes.`;
        await sendMail(user.email, subject, text);

        return res.status(200).json({ success: true, message: 'OTP sent successfully  and please check your email and verify your account' });

    } catch (e) {
        next(e);
    }

}

async function sendOTP(req, res, next) {

    try {

        const { email } = req.body;
        const user = await checkExistByField('email', email, 'users');
        if (!user) throw new createHttpError.NotFound('404 - User not found');

        const otpRecord = await OTP.findOne({ where: { user_id: user.id } });
        const now = new Date().getTime();

        if (otpRecord && otpRecord.expires_in > now) throw new createHttpError.BadRequest('An OTP code has already been sent to your email');

        const {code,expire} = makeOTP();
        await OTP.create({ code: code, expires_in: expire, user_id: user.id ,email:user.email });

        if(otpRecord) await otpRecord.destroy();
        const subject = 'Your OTP Code';
        const text = `Your OTP code is: ${code}. It will expire in 2 minutes.`;

        await sendMail(user.email, subject, text);

        res.status(200).json({ success: true, message: 'OTP sent successfully' });

    } catch (e) {
        next(e);
    }
}

async function checkOTP(req, res, next) {

    try {

        const { code, email } = req.body;
        const otpRecord = await OTP.findOne({ where: { code, email } });
        if (!otpRecord) throw new createHttpError.NotFound('OTP not found');

        const now = new Date().getTime();
        if (otpRecord.expires_in < now) throw new createHttpError.Forbidden('OTP has expired');

        const user = await User.findByPk(otpRecord.user_id);
        user.email_verified_at = now;

        await user.save();

        const jwtTokenResult = jwtToken(user);
        const token = jwtTokenResult.token;
        const userDTO = jwtTokenResult.userDTO;
        const data = { token: token, user: userDTO };

        res.status(200).json({ success: true, token, user: userDTO, message: 'User is now active and logged in' });

    } catch (e) {
        next(e);
    }
}

async function resetPassword(req, res, next) {

    try {
        
        await resetPasswordSchema.validate(req.body);

        const { email } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) throw new createHttpError.NotFound("User Not Found");

        const existingResetRecord = await ResetPassword.findOne({ where: { email } });
        if (existingResetRecord && existingResetRecord.expires_in > Date.now()) {
            throw new createHttpError.Forbidden("A password reset token has already been sent to your email");
        }

        const resetToken = generateRandomPassword(); // You can use a more secure token generation method
        const expiresIn = Date.now() + 2 * 60 * 1000; // Token expires in 2 minutes

        await ResetPassword.create({
            email: user.email,
            token: resetToken,
            expires_in: expiresIn,
            user_id: user.id
        });

        const subject = 'Password Reset Request';
        const text = `You requested a password reset. Use the following token to reset your password: ${resetToken}. This token will expire in 2 minutes.`;

        await sendMail(user.email, subject, text);

        res.status(200).json({ success: true, message: 'Password reset token sent successfully. Please check your email.' });
    } catch (e) {
        next(e);
    }
}

async function confirmResetPassword(req, res, next) {
    
    try {
    
        const { email, token, password, password_confirmation } = req.body;

        await confirmResetPasswordSchema.validate(req.body);

        const resetRecord = await ResetPassword.findOne({where: {token: token , email: email}});
        if (!resetRecord) throw new createHttpError.NotFound("Invalid or expired reset token");


        const now = Date.now();
        if (resetRecord.expires_in < now) throw new createHttpError.Forbidden("Reset token has expired");

        const user = await User.findByPk(resetRecord.user_id);
        user.password = await makeHashPassword(password);

        await user.save();
        await resetRecord.destroy(); // Remove the used reset token

        const subject = 'Password Reset Successful';
        const text = 'Your password has been reset successfully.';

        await sendMail(user.email, subject, text);

        res.status(200).json({ success: true, message: 'Password reset successfully. You can now log in with your new password.' });
   
    } catch (e) {
        next(e);
    }
}

function verify_token(req, res, next) {

    try {
        
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.decode(token);

        jwt.verify(token, process.env.SECRET_KEY, async (err, verified) => {
            
            if(!await checkUser(verified,next)) next(createHttpError.NotFound('user not found')) 
            
            if (err) {

                if (err.name === 'TokenExpiredError') {

                    const expiredAt = new Date(err.expiredAt).getTime();
                    const now = new Date().getTime();
                    const refreshPeriod = 20 * 24 * 60 * 60 * 1000; // 20 days in milliseconds

                    if (now - expiredAt > refreshPeriod) return next(createHttpError.Forbidden('Token Expired'));

                    const refreshed_jwt = jwtToken(decoded, '10s');
                    const newToken = refreshed_jwt.token;
                    const userDTO = refreshed_jwt.userDTO;
                    console.log('New token:', newToken);
                    const data = { token: newToken, user: userDTO };

                    return res.status(200).json({
                        message: 'Token Has Refreshed',
                        data,
                        success: true
                    });

                } else {
                    return next(createHttpError.Unauthorized('Invalid Token'));
                }
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
 
            res.status(200).json({
                message: 'Token is valid',
                data: { user: userDTO },
                success: true
            });

        });

    } catch (error) {

        next(error);
    }

}


export {
    register,
    login,
    checkOTP,
    sendOTP,
    resetPassword,
    confirmResetPassword,
    verify_token,
    jwtToken
};