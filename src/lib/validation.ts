// Email validation using regex
export const validateEmail = (email: string): { isValid: boolean; message: string } => {
  if (!email.trim()) {
    return { isValid: false, message: "Email is required" }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { isValid: false, message: "Please enter a valid email address" }
  }

  return { isValid: true, message: "" }
}

// Password validation with requirements
export const validatePassword = (
  password: string,
): {
  isValid: boolean
  message: string
  requirements: {
    minLength: boolean
    hasUpperCase: boolean
    hasLowerCase: boolean
    hasNumbers: boolean
    hasSpecialChar: boolean
  }
} => {
  if (!password) {
    return {
      isValid: false,
      message: "Password is required",
      requirements: {
        minLength: false,
        hasUpperCase: false,
        hasLowerCase: false,
        hasNumbers: false,
        hasSpecialChar: false,
      },
    }
  }

  const minLength = password.length >= 8
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  const isValid = minLength && hasUpperCase && hasLowerCase && hasNumbers

  return {
    isValid,
    message: isValid ? "" : "Password must be at least 8 characters with uppercase, lowercase, and numbers",
    requirements: {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
    },
  }
}

// Password confirmation validation
export const validatePasswordConfirmation = (
  password: string,
  confirmPassword: string,
): { isValid: boolean; message: string } => {
  if (!confirmPassword) {
    return { isValid: false, message: "Please confirm your password" }
  }

  if (password !== confirmPassword) {
    return { isValid: false, message: "Passwords do not match" }
  }

  return { isValid: true, message: "" }
}

// Name validation
export const validateName = (name: string, fieldName: string): { isValid: boolean; message: string } => {
  if (!name.trim()) {
    return { isValid: false, message: `${fieldName} is required` }
  }

  return { isValid: true, message: "" }
}

// OTP validation
export const validateOtp = (otp: string): { isValid: boolean; message: string } => {
  const cleanValue = otp.replace(/\D/g, "")

  if (cleanValue.length === 0) {
    return { isValid: false, message: "Verification code is required" }
  }

  if (cleanValue.length !== 6) {
    return { isValid: false, message: "Verification code must be 6 digits" }
  }

  return { isValid: true, message: "" }
}

// Form validation for registration
export const validateRegistrationForm = (formData: {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
}): Record<string, string> => {
  const errors: Record<string, string> = {}

  const firstNameValidation = validateName(formData.firstName, "First name")
  if (!firstNameValidation.isValid) errors.firstName = firstNameValidation.message

  const lastNameValidation = validateName(formData.lastName, "Last name")
  if (!lastNameValidation.isValid) errors.lastName = lastNameValidation.message

  const emailValidation = validateEmail(formData.email)
  if (!emailValidation.isValid) errors.email = emailValidation.message

  const passwordValidation = validatePassword(formData.password)
  if (!passwordValidation.isValid) errors.password = passwordValidation.message

  const confirmPasswordValidation = validatePasswordConfirmation(formData.password, formData.confirmPassword)
  if (!confirmPasswordValidation.isValid) errors.confirmPassword = confirmPasswordValidation.message

  return errors
}

// Form validation for login
export const validateLoginForm = (formData: {
  email: string
  password: string
}): Record<string, string> => {
  const errors: Record<string, string> = {}

  const emailValidation = validateEmail(formData.email)
  if (!emailValidation.isValid) errors.email = emailValidation.message

  if (!formData.password) errors.password = "Password is required"

  return errors
}

// Form validation for forgot password
export const validateForgotPasswordForm = (email: string): Record<string, string> => {
  const errors: Record<string, string> = {}

  const emailValidation = validateEmail(email)
  if (!emailValidation.isValid) errors.email = emailValidation.message

  return errors
}

// Form validation for reset password
export const validateResetPasswordForm = (formData: {
  password: string
  confirmPassword: string
}): Record<string, string> => {
  const errors: Record<string, string> = {}

  const passwordValidation = validatePassword(formData.password)
  if (!passwordValidation.isValid) errors.password = passwordValidation.message

  const confirmPasswordValidation = validatePasswordConfirmation(formData.password, formData.confirmPassword)
  if (!confirmPasswordValidation.isValid) errors.confirmPassword = confirmPasswordValidation.message

  return errors
}
