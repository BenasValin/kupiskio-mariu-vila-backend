import nodemailer from "nodemailer";

export default function sendEmail(to, subject, text, html) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: "beniauskiukas@gmail.com",
      pass: "pbgi yyxu xpko ftji",
    },
  });

  // async..await is not allowed in global scope, must use a wrapper
  async function main() {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: "beniauskiukas@gmail.com", // sender address
      to: to, // list of receivers
      subject: subject, // Subject line
      text: text, // plain text body
      html: "<b>Hello world?</b>", // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
  }

  main().catch(console.error);
}
