import * as yup from "yup";

const createGroupSchema = yup.object({
    name:yup.string().required("Name is required"),
    des:yup.string().required("Description is required"),
    status:yup.number().oneOf([0,1]).required("Status is required"),
})

const updateGroupSchema = yup.object({
    name:yup.string().required("Name is required"),
    des:yup.string().required("Description is required"),
    status:yup.number().oneOf([0,1]).required("Status is required"),
})


export {
    createGroupSchema,
    updateGroupSchema
}


