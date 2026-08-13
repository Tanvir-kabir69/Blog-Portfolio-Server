enum OtpEmailPurpose {
  // OTP_TYPE mapping (email purpose)
  SIGN_UP = "sign up",
  SIGN_IN = "sign in",

  SETUP_2FA = "2FA setup",
  LOGIN_2FA = "2FA login",
  PASSWORDLESS_LOGIN = "passwordless login",
  SETUP_PASSWORDLESS_LOGIN = "setup passwordless login",

  PASSWORD_FORGET = "password recovery",
  PASSWORD_RESET = "password reset",
  PASSWORD_CHANGE = "password change",

  EMAIL_VERIFY = "email verification code",
  PHONE_VERIFY = "phone verification",
  DEVICE_VERIFY = "device verification",

  DEACTIVATE_ACCOUNT = "account deactivation",
  REACTIVATE_ACCOUNT = "account reactivation",
  DELETE_ACCOUNT = "account deletion",
  
  TRANSACTION = "transaction",
  
  SECURITY_SETTINGS = "security settings",
  API_SECURITY = "API security",
  ADMIN_ACTIONS = "admin actions",
  OTHER = "other",
}

export default OtpEmailPurpose;
