import { MailService } from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY environment variable must be set");
}

if (!process.env.SENDGRID_FROM_EMAIL) {
  throw new Error("SENDGRID_FROM_EMAIL environment variable must be set");
}

const mailService = new MailService();
mailService.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendMagicLinkEmail(
  email: string,
  token: string,
  origin: string
): Promise<boolean> {
  const magicLink = `${origin}/auth/verify?token=${token}`;

  try {
    await mailService.send({
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: "Your Magic Login Link",
      text: `Click this link to login: ${magicLink}`,
      html: `
        <div>
          <h1>Welcome back!</h1>
          <p>Click the button below to login to your account:</p>
          <a href="${magicLink}" style="display: inline-block; padding: 12px 24px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px;">
            Login to Your Account
          </a>
          <p style="margin-top: 24px; color: #666;">
            If you didn't request this login link, you can safely ignore this email.
          </p>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}
