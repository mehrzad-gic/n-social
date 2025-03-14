import * as yup from "yup";

const CompanyMemberSchema = yup.object({
    company_id: yup.number().required("Company ID is required"),
    title: yup.string().required("Title is required"),
    des: yup.string().required("Description is required"),
    status: yup.number().oneOf([0,1]).required("Status is required"),
});



export {
    CompanyMemberSchema
}


