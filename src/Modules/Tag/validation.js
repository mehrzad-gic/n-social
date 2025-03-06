import * as yup from 'yup';

export const tagCreateSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  status: yup.number().required('Status is required').oneOf([0, 1], 'Status must be 0 or 1'),
});

export const tagUpdateSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  status: yup.number().required('Status is required').oneOf([0, 1], 'Status must be 0 or 1'),
});


