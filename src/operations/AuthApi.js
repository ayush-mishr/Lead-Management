import { toast } from "react-hot-toast"
import { setSignupData, setLoading, setToken } from "../slices/auth"
import { setUser } from "../slices/profile"
import { apiConnector } from "../operations/ApiConnector"
import { endpoints } from "../operations/Api";
import VerifyEmail from "../pages/VerifyMail";
import { useDispatch, useSelector } from "react-redux";

const {
  SENDOTP_API,
  SIGNUP_API,
  LOGIN_API,
  RESETPASSTOKEN_API,
  RESETPASSWORD_API,
} = endpoints

export function sendOtp(email, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
   
    try {
      const response = await apiConnector("POST", SENDOTP_API, {
        email,
        checkUserPresent: true, // This is to be used in case of signup
      })
      console.log("SENDOTP API RESPONSE............", response);

      console.log(response.data.success)

      if (!response.data.success) {
        // Log the full response for debugging
        console.error("SENDOTP API ERROR RESPONSE:", response.data);
        throw new Error(response.data.message)
      }

      toast.success("OTP Sent Successfully")
      
      // Use setTimeout to ensure navigation happens after current render cycle
      setTimeout(() => {
        navigate("/verify-email");
      }, 100);
      
    } catch (error) {
      // Log the error object for more details
      console.error("SENDOTP API ERROR............", error)
      
      toast.error(error?.message || "Could Not Send OTP")
    } finally {
      dispatch(setLoading(false))
      toast.dismiss(toastId)
    }
  }
}

export function signUp(
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  accountType,
  otp,
  navigate
) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    
    try {
      const response = await apiConnector("POST", SIGNUP_API, {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        accountType,
        otp,
      })

      console.log("SIGNUP API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      
      // Set user data and token after successful signup
      if (response.data.token) {
        dispatch(setToken(response.data.token));
      }
      
      if (response.data.user) {
        dispatch(setUser(response.data.user));
      } else {
        // If user data not in response, set from signup data
        dispatch(setUser({
          firstName,
          lastName,
          email,
          accountType
        }));
      }
      
      // Clear signup data since registration is complete
      dispatch(setSignupData(null));
      
      toast.success("Signup Successful");
      
      // Use setTimeout to ensure navigation happens after state updates
      setTimeout(() => {
        navigate("/dashboard");
      }, 100);
      
    } catch (error) {
      console.log("SIGNUP API ERROR............", error)
      toast.error("Signup Failed")

      // Use setTimeout for error navigation too
      setTimeout(() => {
        navigate("/signup");
      }, 100);
    } finally {
      dispatch(setLoading(false))
      toast.dismiss(toastId)
    }
  }
}

export function login(email, password, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    
    console.log("emial hai bhai", email, password);
    try {
      const response = await apiConnector("POST", LOGIN_API, {
        email,
        password,
      })
    
      console.log("LOGIN API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }
    
      toast.success("Login Successful")
     
      dispatch(setToken(response.data.token))
      const userImage = response.data?.user?.image
        ? response.data.user.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`
      dispatch(setUser({ ...response.data.user, image: userImage }))
      
      // Clear any existing signup data
      dispatch(setSignupData(null));
      
      // Use setTimeout to ensure navigation happens after state updates
      setTimeout(() => {
        navigate("/dashboard");
      }, 100);
      
    } catch (error) {
      console.log("LOGIN API ERROR............", error)
      toast.error("Login Failed")
         
    } finally {
      dispatch(setLoading(false))
      toast.dismiss(toastId)
    }
  }
}

export function getPasswordResetToken(email, setEmailSent) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", RESETPASSTOKEN_API, {
        email,
      })

      console.log("RESETPASSTOKEN RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success("Reset Email Sent")
      setEmailSent(true)
    } catch (error) {
      console.log("RESETPASSTOKEN ERROR............", error)
      toast.error("Failed To Send Reset Email")
    }
    toast.dismiss(toastId)
    dispatch(setLoading(false))
  }
}

export function resetPassword(password, confirmPassword, token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", RESETPASSWORD_API, {
        password,
        confirmPassword,
        token,
      })

      console.log("RESETPASSWORD RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success("Password Reset Successfully")
      navigate("/login")
    } catch (error) {
      console.log("RESETPASSWORD ERROR............", error)
      toast.error("Failed To Reset Password")
    }
    toast.dismiss(toastId)
    dispatch(setLoading(false))
  }
}

export function logout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null))
    dispatch(setUser(null))
    
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    toast.success("Logged Out")
    navigate("/")
  }
}
