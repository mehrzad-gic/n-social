import { sendMail } from '../Helpers/NodeMailer';

export default async (job) => {
  const { to, subject, text } = job.data;
  await sendMail({to, subject, text });
  console.log(`Email sent to ${to}`);
};
