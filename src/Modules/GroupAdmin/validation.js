import * as yup from "yup";

const groupAdminSchema = yup.object({
    user_id:yup.number().required("User ID is required"),
    type:yup.number().oneOf([0,1,2]).required("Type is required"),
    status:yup.number().oneOf([0,1]).required("Status is required"),
    group_id:yup.number().required("Group ID is required"),
})


export {
    groupAdminSchema
}



