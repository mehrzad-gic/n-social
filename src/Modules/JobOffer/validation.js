import * as yup from 'yup';

const jobOfferValidation = yup.object({
    name: yup.string().max(100).required(),
    type: yup.number().oneOf([0,1]).required(),
    number: yup.number().required(),
    level: yup.number().oneOf([0,1,2,3]).required(),
    des: yup.string().max(1000).required(),
    company_id: yup.number().required(),
    category_id: yup.number().required(),
    salary_id: yup.number().required(),
});

export default jobOfferValidation;

