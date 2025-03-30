import joi from 'joi';

const userValidation = joi.object({
    name: joi.string().min(3).max(30).required(),
    title: joi.string().max(40).optional(), // Title can be up to 100 characters long, but optional
    github: joi.string().min(10).max(35).optional(),
    bio: joi.string().max(160).optional(), // Bio can be up to 160 characters long
    birthday: joi.date().optional(), // Birthday should be in YYYY-MM-DD format, but can be optional
    user_name: joi.string().alphanum().min(3).max(30).required(), // Username must be alphanumeric and between 3-30 characters
    img: joi.string().optional(), // Image should be a valid URI, but can be optional
    img_bg: joi.string().optional(), // Background image should be a valid URI, but can be optional
    x: joi.string().max(30).optional(), // Twitter handle can be up to 15 characters long
});


export {userValidation}