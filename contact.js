const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

router.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: email,
      to: process.env.EMAIL_USER,
      subject: `Contact Us Form Submission from ${name}`,
      text: message,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Your message has been sent successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message. Please try again later.' });
  }
});

module.exports = router;
