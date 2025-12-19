const nodemailer = require("nodemailer");

// create transporter if EMAIL_USER and EMAIL_PASS are provided in env
let transporter = null;
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        }
    });
}

async function sendEmail(to, subject, text){
    // If transporter not configured, skip sending and log
    if (!transporter) {
        console.warn("sendEmail: transporter not configured, skipping send to", to);
        return;
    }

    try{
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text
        });
    }
    catch(e){
        // don't throw to avoid failing main flow; log error
        console.error("sendEmail error:", e && e.message ? e.message : e);
    }
}

module.exports = sendEmail;