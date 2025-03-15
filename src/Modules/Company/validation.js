import * as yup from "yup";

const createCompanySchema = yup.object({
    name: yup.string().required("Name is required"),
    des: yup.string().required("Description is required"),
    revenue: yup.number().required("Revenue is required"),
    type: yup.string().required("Type is required"),
    sector: yup.number().required("Sector is required"),
    size: yup.number().required("Size is required"),
    status: yup.number().oneOf([0,1]).required("Status is required"),
    address: yup.string().max(100).required("Address is required"),
    phone: yup.string().max(12).required("Phone is required"),
    email: yup.string().email("Email is invalid").required("Email is required"),
    website: yup.string().url("Website is invalid").required("Website is required"),
});

const updateCompanySchema = yup.object({
    name: yup.string().required("Name is required"),
    des: yup.string().required("Description is required"),
    revenue: yup.number().required("Revenue is required"),
    type: yup.string().required("Type is required"),
    sector: yup.number().required("Sector is required"),
    size: yup.number().required("Size is required"),
    status: yup.number().oneOf([0,1]).required("Status is required"),
    address: yup.string().max(100).required("Address is required"),
    phone: yup.string().max(12).required("Phone is required"),
    email: yup.string().email("Email is invalid").required("Email is required"),
    website: yup.string().url("Website is invalid").required("Website is required"),
});

export {
    createCompanySchema,
    updateCompanySchema
}


