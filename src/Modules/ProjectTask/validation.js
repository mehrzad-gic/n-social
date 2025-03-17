import * as yup from 'yup';

export const projectTaskValidation = yup.object().shape({
    name: yup.string().required('Name is required'),
    time: yup.number().required('Time is required'),
    des: yup.string().max(1000).required('Description is required'),
    parent_id: yup.number(),
});
