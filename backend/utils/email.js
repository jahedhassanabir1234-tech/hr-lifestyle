const nodemailer = require("nodemailer");

const EMAIL_USER = process.env.EMAIL_USER || "jahedhassanabir1234@gmail.com";
const EMAIL_PASS = (process.env.EMAIL_PASS || "bhdpxlkkayhgpgby").replace(/\s/g, "");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

const sendOTP = async (email, otp) => {
  const mailOptions = {
    from: EMAIL_USER,
    to: email,
    subject: "HR-Lifestyle - Your Verification Code",
    html: `
      <div style="max-width: 400px; margin: 0 auto; padding: 30px; font-family: Arial, sans-serif; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="text-align: center; color: #222;">HR-Lifestyle</h2>
        <p style="text-align: center; color: #666; font-size: 14px;">Verify your email address</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #222;">${otp}</span>
        </div>
        <p style="text-align: center; color: #999; font-size: 12px;">This code expires in 5 minutes. Do not share it with anyone.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendOTP };
