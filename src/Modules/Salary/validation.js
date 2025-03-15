import * as yup from 'yup';

const salaryValidation = yup.object({
    salary: yup.number().required(),
    status: yup.number().oneOf([0,1]).required(),
    type: yup.number().oneOf([0,1]).required(),
});

export default salaryValidation;
