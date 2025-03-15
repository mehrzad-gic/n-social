import * as yup from 'yup';

export const planSchema = yup.object().shape({
    name: yup.string().required(),
    description: yup.string().max(255).required(),
    price: yup.number().required(),
    request: yup.number().required(),
});

export {planSchema};