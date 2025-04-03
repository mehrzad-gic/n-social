import joi from 'joi';

const userValidation = joi.object({
  name: joi.string().min(3).max(30).required(),
  title: joi.string().max(40).optional(), // Title can be up to 100 characters long, but optional
  github: joi.string().min(10).max(35).allow(''),
  bio: joi.string().max(160).optional(), // Bio can be up to 160 characters long
  birthday: joi.date().optional(), // Birthday should be in YYYY-MM-DD format, but can be optional
  // optional slug
  slug: joi.string().optional().regex(/^[a-z0-9-]+$/).messages({
    'string.base': 'Slug must be a string',
    'string.empty': 'Slug cannot be empty',
    'string.pattern.base': 'Slug can only contain lowercase letters, numbers, and hyphens',
  }),    
  img: joi.optional(), // Image should be a valid URI, but can be optional
  img_bg: joi.optional(), // Background image should be a valid URI, but can be optional
  x: joi.optional(), // Twitter handle can be up to 15 characters long
  roles: joi.array().optional().items(joi.number()),
  status: joi.number().valid(0, 1).required(),
});


export const updateInfoValidation = joi.object({
  name: joi.string().min(3).max(30).required(),
  title: joi.string().max(40).optional(), // Title can be up to 100 characters long, but optional
  github: joi.string().min(10).max(35).allow(''),
  slug: joi.string().required().regex(/^[a-zA-Z0-9-]+$/).messages({
    'string.base': 'Slug must be a string',
    'string.empty': 'Slug cannot be empty',
    'string.pattern.base': 'Slug can only contain lowercase letters, numbers, and hyphens',
  }),
  bio: joi.string().max(160).optional(), // Bio can be up to 160 characters long
  birthday: joi.date().optional(), // Birthday should be in YYYY-MM-DD format, but can be optional
  img: joi.optional(), // Image should be a valid URI, but can be optional
  img_bg: joi.optional(), // Background image should be a valid URI, but can be optional
  x: joi.optional(), // Twitter handle can be up to 15 characters long
});


export {userValidation}