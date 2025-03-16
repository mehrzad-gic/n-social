import * as yup from "yup";


const categoryPriceSchema = yup.object().shape({
    name: yup.string().required(),
    min: yup.number().required(),
    max: yup.number().required(),
    status: yup.number().oneOf([0,1]).required(),
    category_id: yup.number().required()
});


export { categoryPriceSchema };

