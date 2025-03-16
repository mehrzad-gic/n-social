import * as yup from 'yup';

export const projectRequestSchema = yup.object().shape({
    des: yup.string().required('description is required'),
    time: yup.string().required('time is required'),
    budget: yup.number().required('budget is required'),
});


