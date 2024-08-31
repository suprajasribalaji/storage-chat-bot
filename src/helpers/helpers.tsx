export const getEmailValidationRules = () => {
  return [
      { required: true, message: 'Please input your email!' },
      { pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: 'Please enter a valid email address!' },
  ];
};

export const getPasswordValidationRules = () => {
  return [
      { required: true, message: 'Please input your password!' },
      { pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/, message: 'Password must be min 8 and max 16 valid characters! Includes at least one uppercase letter, one lowercase letter, one digit, and one special character' },
  ];
};

export const getPhoneNumberValidationRules = () => {
  return [
    { required: true, message: 'Please input your phone number!' },
    { pattern: /^([0-9]{10})$/, message: 'Phone number must be 10 digits! Eg: 9876543210' },
  ];
}
