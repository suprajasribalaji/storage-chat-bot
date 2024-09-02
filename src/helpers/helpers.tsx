import { emailPattern, passwordPattern } from "../utils/regexPattern";

export const getEmailValidationRules = () => [
  { required: true, message: 'Please input your email!' },
  { pattern: emailPattern, message: 'Please enter a valid email address!' },
];

export const getPasswordValidationRules = () => [
  { required: true, message: 'Please input your password!' },
  { pattern: passwordPattern, message: 'Password must be min 8 and max 16 valid characters! Includes at least one uppercase letter, one lowercase letter, one digit, and one special character' },
];
