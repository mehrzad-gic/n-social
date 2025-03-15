import * as yup from 'yup';

const groupRequestValidation = yup.object({
    reject_reason: yup.string().max(255).optional(),
    message: yup.string().max(455).optional(),
});

export default groupRequestValidation;

