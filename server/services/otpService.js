const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use other services or SMTP settings
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

exports.sendOtpEmail = async (email, otp) => {
  // Mock email sending - just log to console
  console.log('='.repeat(50));
  console.log('📧 MOCK EMAIL SENDING');
  console.log('='.repeat(50));
  console.log(`To: ${email}`);
  console.log(`Subject: Your OTP for Login`);
  console.log(`OTP: ${otp}`);
  console.log(`This OTP is valid for 5 minutes.`);
  console.log('='.repeat(50));
  
  // In production, uncomment below to actually send emails:
  /*
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP for Login',
    html: `<p>Your One-Time Password (OTP) for login is: <strong>${otp}</strong></p><p>This OTP is valid for 5 minutes.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('OTP email sent successfully to ', email);
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Error sending OTP email');
  }
  */
};
