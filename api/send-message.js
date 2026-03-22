const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, subject, message } = req.body;

  // Validate required fields
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  // Map subject values to readable labels
  const subjectLabels = {
    booking: 'Studio Booking',
    collaboration: 'Collaboration',
    licensing: 'Music Licensing',
    scoring: 'Film / Media Scoring',
    general: 'General Inquiry',
  };

  const subjectLine = subjectLabels[subject] || 'General Inquiry';

  try {
    await resend.emails.send({
      from: 'Storyarche Studios <contact@storyarche.com>',
      to: 'michael@storyarche.com',
      replyTo: email,
      subject: `New Contact: ${subjectLine} — ${name}`,
      html: `
        <h2>New message from storyarche.com</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(subjectLine)}</p>
        <hr>
        <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Resend error:', error);
    return res.status(500).json({ error: 'Failed to send message. Please try again.' });
  }
};

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
