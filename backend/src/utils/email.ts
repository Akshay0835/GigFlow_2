import nodemailer from 'nodemailer';

export const sendEmail = async (options: { to: string; subject: string; text: string; html?: string }) => {
  // If user provided real SMTP credentials in .env, use them to send REAL emails!
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"GigFlow Admin" <${process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html || options.text,
    });

    console.log(`\n📧 REAL Email sent to ${options.to}\n`);
    return;
  }

  // FALLBACK: Generate test SMTP service account from ethereal.email
  const testAccount = await nodemailer.createTestAccount();

  // Create a transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  // Send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"GigFlow Admin" <admin@gigflow.com>',
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html || options.text,
  });

  console.log(`\n========================================================`);
  console.log(`📧 MOCK EMAIL SENT TO ${options.to}`);
  console.log(`🔗 VIEW YOUR CODE HERE: ${nodemailer.getTestMessageUrl(info)}`);
  console.log(`========================================================\n`);
};
