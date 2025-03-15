import * as Joi from 'joi';


const permissionSchema = Joi.object({
    name:Joi.string().max(255).required(),
    des:Joi.string().max(255).required(),
    status:Joi.number().oneOf([0,1]).required()
});

export {permissionSchema};

