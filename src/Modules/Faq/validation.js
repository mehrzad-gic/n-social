import Joi from 'joi';

// Define the schema
const FaqSchema = Joi.object({
    name: Joi.string().required(),
    answer: Joi.string().required(),
    category_id: Joi.number().required(),
    status: Joi.number().valid(0, 1).required()
});

export { FaqSchema };