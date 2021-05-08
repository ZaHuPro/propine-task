import _colors from 'colors';

const errorLogger = (message) => {
  console.log(_colors.red(message));
  process.exit(0)
};

export const validateDate = (input) => {
  if (isNaN(input) || !(new Date(input) instanceof Date)) {
    return errorLogger("option '-d, --date <seconds>' value for argument 'seconds' is not a valid integer of seconds");
  }
  return Number(input);
};

export const validateToken = (input) => {
  if (!typeof input === 'string' || !(input instanceof String)) {
    return errorLogger("option '-t, --token <symbol>' value for argument 'symbol' is not a valid string of token symbol");
  }
  return input.toUpperCase();
};

