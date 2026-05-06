import prisma from '@/lib/server/config/prisma';
import { generateOTP, saveOTP, validateOTP } from '@/lib/server/utils/otp.util';
import { sendOTPEmail, sendPasswordChangedEmail } from '@/lib/server/utils/email.util';
import { validateEmail } from '@/lib/server/utils/emailValidation.util';
import { validatePasswordForAuth } from '@/lib/server/utils/passwordValidator.util';
import { hashPassword, comparePassword } from '@/lib/server/utils/password.util';
import { ApiError } from '@/lib/server/utils/ApiError';

export const sendPasswordResetOTP = async (email: string) => {
  if (!email) {
    throw new ApiError(400, 'Email is required');
  }

  // Validate email domain — domain rejection is fine to surface; it reveals
  // nothing about specific users (anyone could check the domain via DNS).
  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) {
    throw new ApiError(400, emailValidation.error);
  }

  // Same response for both registered and non-existent users — prevents
  // attackers from enumerating valid student/admin emails.
  const genericResponse = {
    message: 'If this email is registered, a verification code has been sent.',
  };

  // Check if user exists (student or admin)
  let user = await prisma.student.findUnique({ where: { email } });
  if (!user) {
    user = await prisma.admin.findUnique({ where: { email } });
  }

  // Silently succeed for non-existent users — no DB write, no email, no OTP.
  // Small delay so timing can't distinguish registered vs unregistered email.
  if (!user) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return genericResponse;
  }

  // Generate, save, and email OTP
  const otp = generateOTP();
  await saveOTP(email, otp);
  await sendOTPEmail(email, otp, user.name);

  // OTP is NEVER returned in the response — caller must retrieve it from email.
  return genericResponse;
};

export const verifyOTP = async (email: string, otp: string) => {
  if (!email || !otp) {
    throw new ApiError(400, 'Email and OTP are required');
  }

  // Validate email domain
  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) {
    throw new ApiError(400, emailValidation.error);
  }

  // Verify OTP
  console.log(`Attempting to validate OTP: ${otp} for email: ${email}`);
  const isValidOTP = await validateOTP(email, otp);
  console.log(`OTP validation result: ${isValidOTP}`);

  if (!isValidOTP) {
    throw new ApiError(400, 'Invalid or expired OTP');
  }

  return {
    message: 'OTP verified successfully',
    valid: true
  };
};

export const resetPassword = async (email: string, otp: string, newPassword: string) => {
  if (!email || !otp || !newPassword) {
    throw new ApiError(400, 'Email, OTP, and new password are required');
  }

  // Validate email domain
  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) {
    throw new ApiError(400, emailValidation.error);
  }

  // Validate password strength
  validatePasswordForAuth(newPassword);

  // Verify OTP
  console.log(`Attempting to validate OTP: ${otp} for email: ${email}`);
  const isValidOTP = await validateOTP(email, otp);
  console.log(`OTP validation result: ${isValidOTP}`);

  if (!isValidOTP) {
    throw new ApiError(400, 'Invalid or expired OTP');
  }

  // Mark OTP as used
  await prisma.passwordResetOTP.updateMany({
    where: {
      email,
      is_used: false
    },
    data: { is_used: true }
  });

  // Find user
  let user = null;
  user = await prisma.student.findUnique({ where: { email } });

  let userType = '';
  if (user) {
    userType = 'student';
  } else {
    user = await prisma.admin.findUnique({ where: { email } });
    if (user) {
      userType = 'admin';
    }
  }

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  // Check if new password is same as current password
  if (user.password_hash) {
    const isSamePassword = await comparePassword(newPassword, user.password_hash);
    if (isSamePassword) {
      throw new ApiError(400, 'New password cannot be the same as your current password');
    }
  }

  // Hash new password
  const password_hash = await hashPassword(newPassword);

  // Update password based on user type
  if (userType === 'student') {
    await prisma.student.update({
      where: { email },
      data: { password_hash }
    });
  } else {
    await prisma.admin.update({
      where: { email },
      data: { password_hash }
    });
  }

  // Send confirmation email (non-blocking — failure doesn't affect the password reset itself)
  await sendPasswordChangedEmail(email, user.name);

  return {
    message: 'Password reset successful. You can now login with your new password.'
  };
};
