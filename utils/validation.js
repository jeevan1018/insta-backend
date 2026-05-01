/**
 * Email validation regex
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Password validation - minimum 8 chars, 1 uppercase, 1 lowercase, 1 number
 */
export const isValidPassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Name validation - minimum 2 characters
 */
export const isValidName = (name) => {
  return name && name.trim().length >= 2;
};

/**
 * Validate register request
 */
export const validateRegisterRequest = (name, email, password, confirmPassword) => {
  const errors = {};

  if (!name || !name.trim()) {
    errors.name = "Name is required";
  } else if (!isValidName(name)) {
    errors.name = "Name must be at least 2 characters long";
  }

  if (!email || !email.trim()) {
    errors.email = "Email is required";
  } else if (!isValidEmail(email)) {
    errors.email = "Invalid email format";
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (!isValidPassword(password)) {
    errors.password = "Password must be at least 8 characters with uppercase, lowercase, number, and special character";
  }

  if (!confirmPassword) {
    errors.confirmPassword = "Please confirm your password";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate login request
 */
export const validateLoginRequest = (email, password) => {
  const errors = {};

  if (!email || !email.trim()) {
    errors.email = "Email is required";
  } else if (!isValidEmail(email)) {
    errors.email = "Invalid email format";
  }

  if (!password) {
    errors.password = "Password is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
