import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendMail({ to, subject, html }) {
    const msg = {
        to: to,
        from: process.env.SENDGRID_FROM_ADDRESS,
        subject: subject,
        text: html.replace(/<[^>]+>/g, ''),
        html: html,
    };

    sgMail
    .send(msg)
    .then(() => {
      return 200;
    })
    .catch((error) => {
        console.error(error);
        return 400;
    });

    return 200;
}