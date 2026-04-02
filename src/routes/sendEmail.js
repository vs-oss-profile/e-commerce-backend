const nodemailer = require("nodemailer");

async function sendMail() {
  // Create transporter
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "anon99078@gmail.com",
      pass: "uvfntwfthaezdfba", // NOT your real password
    },
  });

  // Email options
  let mailOptions = {
    from: '"Your Name" <anon99078@gmail.com>',
    to: "anon99078@gmail.com",
    subject: "Hello from Nodemailer",
    text: "This is a test email",
    html: "<b>This is a test email</b>",
  };

  // Send email
  let info = await transporter.sendMail(mailOptions);

  console.log("Message sent:", info.messageId);
}

async function sendEmail(req, res, next) {
  sendMail().catch(console.error);
  res.json({
    success: true,
    message: "Email sent",
  });
}

module.exports = sendEmail;
