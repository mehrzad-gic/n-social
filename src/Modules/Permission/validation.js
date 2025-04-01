import joi from 'joi';


const permissionSchema = joi.object({
    name:joi.string().max(55).min(3).required("Name is required"),
    des:joi.string().max(255).min(3).required("Description is required"),   
    status:joi.number().valid(0, 1).required("Status is required"),
}); 

export {permissionSchema};

