import * as Joi from 'joi';

export const projectProValidation = Joi.object({
    name: Joi.string().max(220).required(),
    des: Joi.string().max(455).required(),
    color: Joi.string().max(220).required(),
    status: Joi.number().onOf([0,1]).required(),
    price: Joi.number().required()
});

