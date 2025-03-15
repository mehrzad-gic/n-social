import * as Joi from 'joi';

const roleSchema = Joi.object({
    name:Joi.string().max(255).required(),
    status:Joi.number().oneOf([0,1]).required()
});

export {roleSchema};
