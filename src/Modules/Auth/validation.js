import * as yup from 'yup';

const registerSchema = yup.object().shape({
    name: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().required(),
    password_confirmation: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required()
});

const loginSchema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required()
});

const resetPasswordSchema = yup.object().shape({
    email: yup.string().email().required()
});

export {
    registerSchema,
    loginSchema,
    resetPasswordSchema
};