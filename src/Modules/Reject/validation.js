import * as yup from 'yup';

const rejectValidation = yup.object({
    name: yup.string().required(),
    status: yup.number().oneOf([0,1]).required(),
    type: yup.number().oneOf([0,1,2]).required(),
});

export default rejectValidation;
