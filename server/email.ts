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
    console.log(`Sending magic link email to ${email} with token ${token}`);
    await mailService.send({
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL!,
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
    console.log('Magic link email sent successfully');
    return true;
  } catch (error) {
    console.error('SendGrid magic link email error:', error);
    return false;
  }
}

export async function sendPasswordResetEmail(
  email: string,
  token: string,
  origin: string
): Promise<boolean> {
  const resetLink = `${origin}/verify?token=${token}&type=reset-password`;

  try {
    console.log(`Sending password reset email to ${email} with token ${token}`);
    await mailService.send({
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL!,
      subject: "Reset Your Password",
      text: `Click this link to reset your password: ${resetLink}. This link will expire in 1 hour.`,
      html: `
        <div>
          <h1>Password Reset Request</h1>
          <p>You requested to reset your password. Click the button below to set a new password:</p>
          <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px;">
            Reset Your Password
          </a>
          <p style="margin-top: 24px; color: #666;">
            This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.
          </p>
        </div>
      `,
    });
    console.log('Password reset email sent successfully');
    return true;
  } catch (error) {
    console.error('SendGrid password reset email error:', {
      error,
      email,
      fromEmail: process.env.SENDGRID_FROM_EMAIL,
      apiKeyExists: !!process.env.SENDGRID_API_KEY
    });
    return false;
  }
}