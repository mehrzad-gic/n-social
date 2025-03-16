import * as Yup from 'yup';

export const skillValidation = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    status: Yup.number().oneOf([0, 1]).required('Status is required'),
});

export { skillValidation };
