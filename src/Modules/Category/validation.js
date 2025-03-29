import joi from "joi";

const createCategorySchema = joi.object({
    name:joi.string().required("Name is required"),
    icon:joi.string().required("Icon is required"),
    status:joi.number().valid(0, 1).required("Status is required"),
})

const updateCategorySchema = joi.object({
    name:joi.string().required("Name is required"),
    icon:joi.string().required("Icon is required"),
    status:joi.number().valid(0, 1).required("Status is required"),
})

export {
    createCategorySchema,
    updateCategorySchema
}




