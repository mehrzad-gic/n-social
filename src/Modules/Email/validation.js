import * as Joi from "joi";

const createEmailSchema = Joi.object({
    name: Joi.string().required(),
    file: Joi.string().required(),
    body: Joi.string().required()
});


export { createEmailSchema };
