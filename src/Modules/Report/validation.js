import * as yup from "yup";

export const createReportSchema = yup.object().shape({
    name: yup.string().required(),
    status: yup.number().required(),
    rate: yup.number().required(),
});

export const updateReportSchema = yup.object().shape({
    name: yup.string().required(),
    status: yup.number().required(),
    rate: yup.number().required(),
});

export{
    createReportSchema,
    updateReportSchema
}