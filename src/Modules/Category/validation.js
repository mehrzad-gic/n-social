import * as yup from "yup";

const createCategorySchema = yup.object({
    name:yup.string().required("Name is required"),
    icon:yup.string().required("Icon is required"),
    status:yup.number().oneOf([0,1]).required("Status is required"),
})

const updateCategorySchema = yup.object({
    name:yup.string().required("Name is required"),
    icon:yup.string().required("Icon is required"),
    status:yup.number().oneOf([0,1]).required("Status is required"),
})

export {
    createCategorySchema,
    updateCategorySchema
}




