import * as yup from "yup";

export const createCompanySchema = yup.object().shape({
    name: yup.string().required(),
    des: yup.string().required(),
    img: yup.mixed().required(),
    img_bg: yup.mixed().required(),
    revenue: yup.number().required(),
    type: yup.string().required(),
    sector: yup.number().required(),
    size: yup.number().required(),
});

export const updateCompanySchema = yup.object().shape({
    name: yup.string().required(),
    des: yup.string().required(),
    img: yup.mixed(),
    img_bg: yup.mixed(),
    revenue: yup.number().required(),
    type: yup.string().required(),
    sector: yup.number().required(),
    size: yup.number().required(),
});


