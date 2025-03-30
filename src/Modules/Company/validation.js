import Joi from "joi";

const createCompanySchema = Joi.object({
    name: Joi.string().required().messages({
        'string.empty': 'Name is required',
        'any.required': 'Name is required'
    }),
    des: Joi.string().required().messages({
        'string.empty': 'Description is required',
        'any.required': 'Description is required'
    }),
    revenue: Joi.number().required().messages({
        'number.base': 'Revenue is required',
        'any.required': 'Revenue is required'
    }),
    type: Joi.string().required().messages({
        'string.empty': 'Type is required',
        'any.required': 'Type is required'
    }),
    sector: Joi.number().required().messages({
        'number.base': 'Sector is required',
        'any.required': 'Sector is required'
    }),
    size: Joi.number().required().messages({
        'number.base': 'Size is required',
        'any.required': 'Size is required'
    }),
    status: Joi.number().valid(0, 1).required().messages({
        'number.base': 'Status is required',
        'any.only': 'Status must be either 0 or 1',
        'any.required': 'Status is required'
    }),
    address: Joi.string().max(100).required().messages({
        'string.empty': 'Address is required',
        'string.max': 'Address must be 100 characters or less',
        'any.required': 'Address is required'
    }),
    phone: Joi.string().max(12).required().messages({
        'string.empty': 'Phone is required',
        'string.max': 'Phone must be 12 characters or less',
        'any.required': 'Phone is required'
    }),
    email: Joi.string().email({ tlds: { allow: false } }).required().messages({
        'string.empty': 'Email is required',
        'string.email': 'Email is invalid',
        'any.required': 'Email is required'
    }),
    website: Joi.string().uri().required().messages({
        'string.empty': 'Website is required',
        'string.uri': 'Website is invalid',
        'any.required': 'Website is required'
    }),
    img_bg: Joi.required().messages({
        'string.uri': 'Background image must be a valid URL'
    }),
    img: Joi.required().messages({
        'string.uri': 'Image must be a valid URL'
    })
});

const updateCompanySchema = Joi.object({
    name: Joi.string().required().messages({
        'string.empty': 'Name is required',
        'any.required': 'Name is required'
    }),
    des: Joi.string().required().messages({
        'string.empty': 'Description is required',
        'any.required': 'Description is required'
    }),
    revenue: Joi.number().required().messages({
        'number.base': 'Revenue is required',
        'any.required': 'Revenue is required'
    }),
    type: Joi.string().required().messages({
        'string.empty': 'Type is required',
        'any.required': 'Type is required'
    }),
    sector: Joi.number().required().messages({
        'number.base': 'Sector is required',
        'any.required': 'Sector is required'
    }),
    size: Joi.number().required().messages({
        'number.base': 'Size is required',
        'any.required': 'Size is required'
    }),
    status: Joi.number().valid(0, 1).required().messages({
        'number.base': 'Status is required',
        'any.only': 'Status must be either 0 or 1',
        'any.required': 'Status is required'
    }),
    address: Joi.string().max(100).required().messages({
        'string.empty': 'Address is required',
        'string.max': 'Address must be 100 characters or less',
        'any.required': 'Address is required'
    }),
    phone: Joi.string().max(12).required().messages({
        'string.empty': 'Phone is required',
        'string.max': 'Phone must be 12 characters or less',
        'any.required': 'Phone is required'
    }),
    email: Joi.string().email({ tlds: { allow: false } }).required().messages({
        'string.empty': 'Email is required',
        'string.email': 'Email is invalid',
        'any.required': 'Email is required'
    }),
    website: Joi.string().uri().required().messages({
        'string.empty': 'Website is required',
        'string.uri': 'Website is invalid',
        'any.required': 'Website is required'
    }),
    img_bg: Joi.optional().messages(),
    img: Joi.optional().messages()
});

export {
    createCompanySchema,
    updateCompanySchema
};