const nodemailer = require("nodemailer");

const COMMIT_MSG = `New Blog ${process.env.COMMIT_MSG} out now!!` || " New Blog out now !!"
const SITE_URL = "https://neteenkk.github.io"
const POST_URL = `${SITE_URL}/posts/${process.env.COMMIT_MSG}.md`

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: "nitinkumar21038@gmail.com",
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});


(async () => {
    try {
        const info = await transporter.sendMail({
            from: '"nitin"<nitinkumar21038@gmail.com>',
            to: "neteenkk@gmail.com, neerajkumar30may@gmail.com, nitishkumarmay30@gmail.com",
            subject: COMMIT_MSG,
            html: `<b>Checkout new Blog published at ${POST_URL}</b>`,
        });
        console.log("debug sent: %s", info);
    } catch (error) {
        console.log(error);
    }

})();