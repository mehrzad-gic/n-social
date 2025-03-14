import * as Joi from "joi";

const FaqCategorySchema = Joi.object({
    name: Joi.string().required(),
    des: Joi.string().required(),
    status: Joi.number().oneOf([0,1]).required()
});


export { FaqCategorySchema };
