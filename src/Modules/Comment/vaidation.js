import * as yup from "yup";

export const createCommentSchema = yup.object().shape({
    text:yup.string().required('Text is required'),
})


