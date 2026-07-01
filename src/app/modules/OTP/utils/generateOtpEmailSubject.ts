import OtpEmailPurpose from "../interfaces/otpEmailPurpose";

function generateOtpEmailSubject(purpose: OtpEmailPurpose): string {
  switch (purpose) {
    // OTP_TYPE mapping purposes
    case OtpEmailPurpose.ACCOUNT_REGISTER:
      return "Register your account with this code";
    case OtpEmailPurpose.SIGN_UP:
      return "Complete your sign up with this code";
    case OtpEmailPurpose.SIGN_IN:
      return "Sign in to your account with this code";

    case OtpEmailPurpose.SETUP_2FA:
      return "Confirm your 2FA setup with this code";
    case OtpEmailPurpose.LOGIN_2FA:
      return "Your 2FA login code";
    case OtpEmailPurpose.PASSWORDLESS_LOGIN:
      return "Your passwordless login code";

    case OtpEmailPurpose.PASSWORD_FORGET:
      return "Recover your password with this code";
    case OtpEmailPurpose.PASSWORD_RESET:
      return "Reset your password with this code";
    case OtpEmailPurpose.PASSWORD_CHANGE:
      return "Confirm your password change with this code";

    case OtpEmailPurpose.EMAIL_VERIFY:
      return "Verify your email address with this code";
    case OtpEmailPurpose.PHONE_VERIFY:
      return "Verify your phone number with this code";
    case OtpEmailPurpose.DEVICE_VERIFY:
      return "Confirm this device with this code";

    case OtpEmailPurpose.SECURITY_SETTINGS:
      return "Confirm your security change with this code";
    case OtpEmailPurpose.DEACTIVATE_ACCOUNT:
      return "Confirm account deactivation with this code";
    case OtpEmailPurpose.REACTIVATE_ACCOUNT:
      return "Confirm account reactivation with this code";
    case OtpEmailPurpose.DELETE_ACCOUNT:
      return "Confirm account deletion with this code";

    case OtpEmailPurpose.TRANSACTION:
      return "Confirm your transaction with this code";

    case OtpEmailPurpose.API_SECURITY:
      return "Confirm API access with this code";
    case OtpEmailPurpose.ADMIN_ACTIONS:
      return "Confirm this admin action with this code";
    default:
      return "Your one-time verification code";
  }
}

export default generateOtpEmailSubject;
