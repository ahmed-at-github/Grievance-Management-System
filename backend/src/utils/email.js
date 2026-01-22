import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API);

async function sendMail(email, password) {
    await resend.emails.send({
        from: 'Grivence System Password <ComplaintSystem@resend.dev>',
        to: ['jadid.muntasir2002@gmail.com'],
        subject: 'password',
        html: `<p>Your Password for email ${email} is <strong>${password}</strong></p>`,
    });
}

export { sendMail };
