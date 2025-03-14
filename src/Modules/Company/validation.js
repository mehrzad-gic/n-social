import * as yup from "yup";

const createCompanySchema = yup.object({
    name: yup.string().required("Name is required"),
    des: yup.string().required("Description is required"),
    revenue: yup.number().required("Revenue is required"),
    type: yup.string().required("Type is required"),
    sector: yup.number().required("Sector is required"),
    size: yup.number().required("Size is required"),
});

const updateCompanySchema = yup.object({
    name: yup.string().required("Name is required"),
    des: yup.string().required("Description is required"),
    revenue: yup.number().required("Revenue is required"),
    type: yup.string().required("Type is required"),
    sector: yup.number().required("Sector is required"),
    size: yup.number().required("Size is required"),
});

export {
    createCompanySchema,
    updateCompanySchema
}


