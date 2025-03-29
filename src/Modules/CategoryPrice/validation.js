import joi from "joi";


const categoryPriceSchema = joi.object({
    name: joi.string().required(),
    min: joi.number().required(),
    max: joi.number().required(),
    status: joi.number().valid(0, 1).required(),
});


export { categoryPriceSchema };

