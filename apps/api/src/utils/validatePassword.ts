export function validatePassword(password: string) {
  // password must be at least 8 characters
  // password must be at max 30 characters
  // password must contain at least one uppercase letter
  // password must contain at least one lowercase letter
  // password must contain at least one number
  // password must contain at least one special character

  const re =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()-=_+{};':"\\|,.<>?]).{8,30}$/;
  return re.test(password);
}
