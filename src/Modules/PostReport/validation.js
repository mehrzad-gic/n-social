import * as yup from "yup";

export const postReportValidation = yup.object({
    report_id: yup.number().required(),
});

export { postReportValidation };
