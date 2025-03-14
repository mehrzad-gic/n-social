import * as Joi from "joi";

const createEmailSchema = Joi.object({
    name: Joi.string().required(),
    file: Joi.string().required(),
    body: Joi.string().required(),
    status: Joi.number().oneOf([0,1]).required()
});


export { createEmailSchema };
