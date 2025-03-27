import * as Yup from "yup";

const FaqCategorySchema = Yup.object({
    name: Yup.string().required(),
    des: Yup.string().required(),
    status: Yup.number().oneOf([0,1]).required()
});


export { FaqCategorySchema };
