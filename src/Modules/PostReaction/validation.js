import * as Yup from "yup";

const schema = Yup.object().shape({
    type : Yup.number().oneOf([1,2,3,4,5,6,7,8,9,10]).required('type is Required'),
});

export {schema};