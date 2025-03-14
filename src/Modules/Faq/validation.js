import * as Joi from "joi";

const FaqSchema = Joi.object({
    name: Joi.string().required(),
    answer: Joi.string().required(),
    category_id: Joi.number().required(),
    status: Joi.number().oneOf([0,1]).required()
});


export { FaqSchema };

