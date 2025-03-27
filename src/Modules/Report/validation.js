import * as yup from "yup";

export const schema = yup.object().shape({
    name: yup.string().required(),
    status: yup.number().required(),
    rate: yup.number().required(),
});

