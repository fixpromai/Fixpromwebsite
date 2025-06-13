const nodemailer = require('nodemailer');

const sendVerificationEmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'fixpromtest@gmail.com',
        pass: 'zmvq pqkt dchn sgyy'
      }
    });

    const mailOptions = {
      from: '"FixProm" <fixpromtest@gmail.com>',
      to: email,
      subject: 'FixProm Email Verification',
      html: `
        <p>Hi,</p>
        <p>Your OTP is: <strong>${otp}</strong></p>
        <p>This OTP is valid for 10 minutes.</p>
        <br>
        <p style="font-size: 12px; color: gray;">If you did not request this, please ignore this email.</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP email successfully sent to: ${email}`);
  } catch (error) {
    console.error(`❌ Failed to send OTP email to ${email}:`, error.message);
    throw error; // Let the route handler decide how to proceed
  }
};

module.exports = sendVerificationEmail;
