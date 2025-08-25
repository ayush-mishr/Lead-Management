

 let BASE_URL = process.env.REACT_APP_BASE_URL;
// If the environment variable is not set, use a default value
if (!BASE_URL) {
  console.warn("REACT_APP_BASE_URL is not set, using default value.");
}
// If the BASE_URL is not set, you can set a default value here
if (!BASE_URL) {
  BASE_URL = "http://localhost:4000/api/v1"; // Default value
}
// AUTH ENDPOINTS
export const endpoints = {
  SENDOTP_API: BASE_URL + "/auth/sendotp",
  SIGNUP_API: BASE_URL + "/auth/signup",
  LOGIN_API: BASE_URL + "/auth/login",
  RESETPASSTOKEN_API: BASE_URL + "/auth/reset-password-token",
  RESETPASSWORD_API: BASE_URL + "/auth/reset-password",
  VERIFYOTP_API: BASE_URL + "/auth/verify-otp",
  VERIFYEMAIL_API: BASE_URL + "/auth/verify-email",
}


// PROFILE ENDPOINTS
export const profileEndpoints = {
  GET_USER_DETAILS_API: BASE_URL + "/profile/getUserDetails",
  
}





// SETTINGS PAGE API
export const settingsEndpoints = {
  UPDATE_DISPLAY_PICTURE_API: BASE_URL + "/profile/updateDisplayPicture",
  UPDATE_PROFILE_API: BASE_URL + "/profile/updateProfile",
  CHANGE_PASSWORD_API: BASE_URL + "/auth/changepassword",
  DELETE_PROFILE_API: BASE_URL + "/profile/deleteProfile",
}
