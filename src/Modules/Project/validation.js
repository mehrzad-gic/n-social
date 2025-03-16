import * as Yup from 'yup';

export const projectValidation = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    des: Yup.string().max(200).required('Description is required'),
    text: Yup.string().max(1000).required('Description is required'),
    // tasks: Yup.number().required('Tasks are required'),
    // tasks_completed: Yup.number().required('Tasks completed are required'),
    // tasks_pending: Yup.number().required('Tasks pending are required'),
    category_id: Yup.number().required('Category is required'),
    company_id: Yup.number().required('Company is required'),
    min: Yup.number().required('Minimum is required'),
    max: Yup.number().required('Maximum is required'),
    type: Yup.number().oneOf([0, 1]).required('Type is required'),
    salary_id: Yup.number().required('Salary is required'),
});

