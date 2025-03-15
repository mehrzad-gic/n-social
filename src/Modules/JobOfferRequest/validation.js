import * as Joi from 'joi';

const jobOfferRequestValidation = Joi.object({
    salary:Joi.number().required(),
    des:Joi.string().min(3).max(500).required(),
    
});

export default jobOfferRequestValidation;

