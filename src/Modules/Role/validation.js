import joi from 'joi';
// TypeError: Joi.string is not a function
const roleSchema = joi.object({
    name:joi.string().required("Name is required"),
    status:joi.number().valid(0, 1).required("Status is required"),
});

export {roleSchema};
