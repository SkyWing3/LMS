export async function sendEmailNotification(
  to: string,
  subject: string,
  text: string,
  html?: string
) {
  const emailServiceUrl = process.env.EMAIL_SERVICE_URL || 'http://localhost:3001';
  
  try {
    const response = await fetch(`${emailServiceUrl}/email/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to, subject, text, html }),
    });

    if (!response.ok) {
      console.error('Failed to send email:', await response.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error communicating with email service:', error);
    return false;
  }
}
