const nodemailer = require("nodemailer");

const path = require('path')

const handlebars = require('handlebars')

const { verify } = require("jsonwebtoken");

const { readHTMLFile } = require("./common");


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "bhavinradadiya444@gmail.com",
    pass: "vkeffhnbawbpcdef",
  },
});

//  All otp in Email
const sendEmail = async (recipient, template, data ,) => {
  try {
    readHTMLFile(path.join(__dirname, `../email_templates/${template.template}.html`), async function (error, html) {
      try {
          const compiledTemplate = handlebars.compile(html);
          const htmlToSend = compiledTemplate(data);
          const subject = template.subject;
          const to = recipient;
          const mailOptions = {
            from: "bhavinradadiya444@gmail.com",
            to: to,
            subject: subject,
            html: htmlToSend,
          };
          await transporter.sendMail(mailOptions)
       } catch (error) {
        console.error("Error sending email:", error);
       }
  })
    console.log(`Email sent successfully to ${recipient}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
transporter.verify(function (error, success) {
  if (error) {
    console.error("SMTP connection error:", error);
  } else {
    console.log("SMTP Connection has been established successfully.");
  }
});

module.exports = { sendEmail };