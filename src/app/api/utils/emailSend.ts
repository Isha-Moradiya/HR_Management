import transporter from "../config/nodemailer";
import ejs from "ejs";
import path from "path";

const DEFAULT_FROM = `"HR Manager" <${process.env.EMAIL_USER}>`

export const sendOtpToEmail = async (email: string, otp: string, username: string) => {
  try {
    // Check if email credentials are configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log("⚠️ Email credentials not configured, skipping email send");
      return;
    }

    const templatePath = path.resolve(
      process.cwd(),
      "templates",
      "otp-email.ejs"
    );

    const html = await ejs.renderFile(templatePath, { otp, username });

    const mailOptions = {
      from: DEFAULT_FROM,
      to: email,
      subject: `${username}, here's your OTP to verify your email address`,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", info.response);
  } catch (err) {
    console.error("❌ Failed to send OTP email:", err);
  }
};

export const sendResetPasswordLink = async (
  email: string,
  resetLink: string,
  username: string
) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log("⚠️ Email credentials not configured, skipping email send");
      return;
    }

    const templatePath = path.resolve(
      process.cwd(),
      "templates",
      "reset-password.ejs"
    );

    const html = await ejs.renderFile(templatePath, { username, resetLink });

    const mailOptions = {
      from: DEFAULT_FROM,
      to: email,
      subject: `${username}, reset your password`,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Reset password email sent successfully:", info.response);
    return info;
  } catch (err) {
    console.error("❌ Failed to send reset password email:", err);
    throw err;
  }
};

export const sendInviteEmail = async (
  email: string,
  inviteLink: string,
  role: string,
  customMessage?: string
) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log("⚠️ Email credentials not configured, skipping email send");
      return;
    }

    const templatePath = path.resolve(
      process.cwd(),
      "templates",
      "invite-user.ejs"
    );

    const html = await ejs.renderFile(templatePath, {
      inviteLink,
      role,
      customMessage,
    });

    const mailOptions = {
      from: DEFAULT_FROM,
      to: email,
      subject: `You're invited to join the HR system as ${role}`,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Invite email sent successfully:", info.response);
    return info;
  } catch (err) {
    console.error("❌ Failed to send invite email:", err);
    throw err;
  }
};

export const sendEmail = async ({ to, subject, html }: { to: string; subject: string; html: string }) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
  });

  return true;
}