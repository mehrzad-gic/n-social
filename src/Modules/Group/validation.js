import Joi from "joi";

const createGroupSchema = Joi.object({
    name:Joi.string().required("Name is required"),
    des:Joi.string().required("Description is required"),
    status:Joi.number().valid(0,1).required("Status is required"),
    img:Joi.string().required("Image is required"),
    type:Joi.number().valid(0,1).required("Type is required"),
})

const updateGroupSchema = Joi.object({
    name:Joi.string().required("Name is required"),
    des:Joi.string().required("Description is required"),
    status:Joi.number().valid(0,1).required("Status is required"),
    img:Joi.string().optional(),
    type:Joi.number().valid(0,1).required("Type is required"),
})


export {
    createGroupSchema,
    updateGroupSchema
}


