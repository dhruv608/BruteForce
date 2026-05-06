/**
 * Email Utility - Email sending functionality
 * Provides email sending capabilities with nodemailer
 * Handles OTP email delivery with professional HTML templates
 */

import nodemailer from 'nodemailer';
import { ApiError } from './ApiError';

/**
 * Create and configure email transporter
 * @returns Configured nodemailer transporter
 * @throws ApiError if email configuration is missing
 */
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new ApiError(500, "Email configuration is missing", [], "EMAIL_CONFIG_MISSING");
  }
  
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

/**
 * Send OTP email with professional HTML template
 * @param email - Recipient email address
 * @param otp - One-time password to send
 * @param userName - Optional user name for personalization
 * @throws ApiError if email sending fails
 */
export const sendOTPEmail = async (email: string, otp: string, userName?: string): Promise<void> => {
  try {
    const transporter = createTransporter();
    
    const year = new Date().getFullYear();
    const mailOptions = {
      from: `"BruteForce" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your BruteForce password reset code',
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>BruteForce password reset</title>
  <style>
    /* Light defaults — overridden when the email client is in dark mode */
    body, .bf-bg          { background:#f4f5f7 !important; }
    .bf-card              { background:#ffffff !important; border:1px solid #e5e7eb !important; box-shadow:0 6px 24px rgba(15,23,42,0.06) !important; }
    .bf-h1, .bf-otp       { color:#0f172a !important; }
    .bf-text              { color:#475569 !important; }
    .bf-muted             { color:#94a3b8 !important; }
    .bf-divider           { border-color:#eef2f6 !important; }
    .bf-otp-box           { background:#f8fafc !important; border:1px solid #e5e7eb !important; }
    .bf-otp-label         { color:#64748b !important; }
    .bf-logo-text         { color:#0f172a !important; }
    .bf-warning           { background:#fff5f5 !important; border:1px solid #fee2e2 !important; }
    .bf-warning-text      { color:#dc2626 !important; }

    @media (prefers-color-scheme: dark) {
      body, .bf-bg        { background:#050505 !important; }
      .bf-card            { background:#0a0a0a !important; border:1px solid #1f1f1f !important; box-shadow:0 20px 50px rgba(0,0,0,0.5) !important; }
      .bf-h1, .bf-otp     { color:#ffffff !important; }
      .bf-text            { color:#9b9b9b !important; }
      .bf-muted           { color:#555 !important; }
      .bf-divider         { border-color:#1a1a1a !important; }
      .bf-otp-box         { background:#161616 !important; border:1px solid #262626 !important; }
      .bf-otp-label       { color:#666 !important; }
      .bf-logo-text       { color:#ffffff !important; }
      .bf-warning         { background:rgba(255,90,90,0.06) !important; border:1px solid rgba(255,90,90,0.18) !important; }
      .bf-warning-text    { color:#ff7a7a !important; }
    }
  </style>
</head>
<body class="bf-bg" style="margin:0; padding:0; background:#f4f5f7; font-family:'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">

  <!-- Hidden preheader (preview text in inbox) -->
  <div style="display:none; max-height:0; overflow:hidden; opacity:0; mso-hide:all;">
    Your one-time code: ${otp}. Valid for 10 minutes.
  </div>

  <table role="presentation" class="bf-bg" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f4f5f7;">
    <tr>
      <td align="center" style="padding:40px 16px;">

        <table role="presentation" class="bf-card" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:480px; background:#ffffff; border:1px solid #e5e7eb; border-radius:20px; box-shadow:0 6px 24px rgba(15,23,42,0.06);">
          <tr>
            <td style="padding:36px 36px 24px 36px;">

              <!-- Brand: text wordmark — works in every email client -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="center" style="padding-bottom:28px;">
                    <span class="bf-logo-text" style="font-size:26px; font-weight:800; letter-spacing:-0.5px; color:#0f172a; font-family:'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                      Brute<span style="color:#84cc16;">Force</span>
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Heading -->
              <h1 class="bf-h1" style="color:#0f172a; font-size:22px; font-weight:700; margin:0 0 8px 0; text-align:center; letter-spacing:-0.3px;">
                Reset your password
              </h1>
              <p class="bf-text" style="color:#475569; font-size:14px; line-height:1.55; margin:0 0 28px 0; text-align:center;">
                Hi <span style="color:#84cc16; font-weight:600;">${userName || 'there'}</span> - use the one-time code below to continue.
              </p>

              <!-- OTP block -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom:24px;">
                <tr>
                  <td class="bf-otp-box" style="background:#f8fafc; border:1px solid #e5e7eb; border-radius:14px; padding:24px; text-align:center;">
                    <div class="bf-otp-label" style="color:#64748b; font-size:11px; font-weight:700; letter-spacing:2px; text-transform:uppercase; margin-bottom:14px;">
                      One-time code
                    </div>
                    <div class="bf-otp" style="font-family:'Courier New', Courier, monospace; font-size:34px; font-weight:800; color:#0f172a; letter-spacing:8px; text-align:center;">
                      ${otp}
                    </div>
                    <div class="bf-otp-label" style="color:#64748b; font-size:12px; margin-top:14px;">
                      Expires in <span style="color:#84cc16; font-weight:600;">10 minutes</span>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Security notice -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td class="bf-warning" style="background:#fff5f5; border:1px solid #fee2e2; border-radius:10px; padding:12px 14px;">
                    <p class="bf-warning-text" style="color:#dc2626; font-size:12px; line-height:1.5; margin:0; text-align:center;">
                      Never share this code with anyone!
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="bf-divider" style="padding:20px 36px 32px 36px; border-top:1px solid #eef2f6; text-align:center;">
              <p class="bf-text" style="color:#475569; font-size:12px; line-height:1.5; margin:0 0 6px 0;">
                Didn't request this? You can safely ignore this email.
              </p>
              <p class="bf-muted" style="color:#94a3b8; font-size:11px; margin:0;">
                Sent by BruteForce · &copy; ${year}
              </p>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>`,
    };

    await transporter.sendMail(mailOptions);
    // Email sent successfully
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to send OTP email";
    throw new ApiError(500, `Email sending failed: ${errorMessage}`, [], "EMAIL_SEND_ERROR");
  }
};

/**
 * Send confirmation email after a successful password reset.
 * Notifies the user their password was changed — security best practice
 * so the legitimate owner can detect/revoke unauthorized resets.
 */
export const sendPasswordChangedEmail = async (email: string, userName?: string): Promise<void> => {
  try {
    const transporter = createTransporter();
    const year = new Date().getFullYear();
    const changedAt = new Date().toLocaleString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true,
      timeZone: 'Asia/Kolkata',
    });

    const mailOptions = {
      from: `"BruteForce" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your BruteForce password was changed',
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>BruteForce password changed</title>
  <style>
    body, .bf-bg          { background:#f4f5f7 !important; }
    .bf-card              { background:#ffffff !important; border:1px solid #e5e7eb !important; box-shadow:0 6px 24px rgba(15,23,42,0.06) !important; }
    .bf-h1                { color:#0f172a !important; }
    .bf-text              { color:#475569 !important; }
    .bf-muted             { color:#94a3b8 !important; }
    .bf-divider           { border-color:#eef2f6 !important; }
    .bf-info-box          { background:#f8fafc !important; border:1px solid #e5e7eb !important; }
    .bf-info-label        { color:#64748b !important; }
    .bf-info-value        { color:#0f172a !important; }
    .bf-logo-text         { color:#0f172a !important; }
    .bf-warning           { background:#fff5f5 !important; border:1px solid #fee2e2 !important; }
    .bf-warning-text      { color:#dc2626 !important; }

    @media (prefers-color-scheme: dark) {
      body, .bf-bg        { background:#050505 !important; }
      .bf-card            { background:#0a0a0a !important; border:1px solid #1f1f1f !important; box-shadow:0 20px 50px rgba(0,0,0,0.5) !important; }
      .bf-h1              { color:#ffffff !important; }
      .bf-text            { color:#9b9b9b !important; }
      .bf-muted           { color:#555 !important; }
      .bf-divider         { border-color:#1a1a1a !important; }
      .bf-info-box        { background:#161616 !important; border:1px solid #262626 !important; }
      .bf-info-label      { color:#666 !important; }
      .bf-info-value      { color:#ffffff !important; }
      .bf-logo-text       { color:#ffffff !important; }
      .bf-warning         { background:rgba(255,90,90,0.06) !important; border:1px solid rgba(255,90,90,0.18) !important; }
      .bf-warning-text    { color:#ff7a7a !important; }
    }
  </style>
</head>
<body class="bf-bg" style="margin:0; padding:0; background:#f4f5f7; font-family:'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">

  <div style="display:none; max-height:0; overflow:hidden; opacity:0; mso-hide:all;">
    Your BruteForce password was just changed. If this wasn't you, take action immediately.
  </div>

  <table role="presentation" class="bf-bg" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f4f5f7;">
    <tr>
      <td align="center" style="padding:40px 16px;">

        <table role="presentation" class="bf-card" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:480px; background:#ffffff; border:1px solid #e5e7eb; border-radius:20px; box-shadow:0 6px 24px rgba(15,23,42,0.06);">
          <tr>
            <td style="padding:36px 36px 24px 36px;">

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="center" style="padding-bottom:28px;">
                    <span class="bf-logo-text" style="font-size:26px; font-weight:800; letter-spacing:-0.5px; color:#0f172a; font-family:'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                      Brute<span style="color:#84cc16;">Force</span>
                    </span>
                  </td>
                </tr>
              </table>

              <h1 class="bf-h1" style="color:#0f172a; font-size:22px; font-weight:700; margin:0 0 8px 0; text-align:center; letter-spacing:-0.3px;">
                Your password was changed
              </h1>
              <p class="bf-text" style="color:#475569; font-size:14px; line-height:1.55; margin:0 0 28px 0; text-align:center;">
                Hi <span style="color:#84cc16; font-weight:600;">${userName || 'there'}</span> — your BruteForce account password was just updated.
              </p>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom:24px;">
                <tr>
                  <td class="bf-info-box" style="background:#f8fafc; border:1px solid #e5e7eb; border-radius:14px; padding:20px;">
                    <div class="bf-info-label" style="color:#64748b; font-size:11px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; margin-bottom:8px;">
                      Changed on
                    </div>
                    <div class="bf-info-value" style="color:#0f172a; font-size:15px; font-weight:600;">
                      ${changedAt} (IST)
                    </div>
                  </td>
                </tr>
              </table>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td class="bf-warning" style="background:#fff5f5; border:1px solid #fee2e2; border-radius:10px; padding:14px;">
                    <p class="bf-warning-text" style="color:#dc2626; font-size:13px; line-height:1.5; margin:0; text-align:center; font-weight:500;">
                      Didn't change your password? Reset it again immediately and contact support.
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <tr>
            <td class="bf-divider" style="padding:20px 36px 32px 36px; border-top:1px solid #eef2f6; text-align:center;">
              <p class="bf-text" style="color:#475569; font-size:12px; line-height:1.5; margin:0 0 6px 0;">
                If you made this change, you can ignore this email.
              </p>
              <p class="bf-muted" style="color:#94a3b8; font-size:11px; margin:0;">
                Sent by BruteForce · &copy; ${year}
              </p>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error: unknown) {
    // Don't throw — password reset already succeeded; the email is just a notification.
    const errorMessage = error instanceof Error ? error.message : 'Failed to send password-changed email';
    console.error('[EMAIL] Password-changed email failed:', errorMessage);
  }
};