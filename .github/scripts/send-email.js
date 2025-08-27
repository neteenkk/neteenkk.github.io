const nodemailer = require("nodemailer");
const COMMIT_MSG = process.env.COMMIT_MSG || " New Blog Published"
const transporter = nodemailer.createTransport({
  host: "smtp.example.com",
  port: 587,
  secure: false,
  auth: {
    user: "neteenk@gmail.com",
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});


(async () => {
    try {
        const info = await transporter.sendMail({
            from: '"Team" <neteenkk@gmail.com>',
            to: "nitinkumar21038@gmail.com",
            subject: COMMIT_MSG,
            html: `<b>Checkout new Blog published ${COMMIT_MSG}</b>`,
        });
        console.log("debug sent: %s", info);
    } catch (error) {
        console.log(error);
    }

})();