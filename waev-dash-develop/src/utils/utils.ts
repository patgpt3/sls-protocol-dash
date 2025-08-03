export const noop = (): void => {};

export const validateEmail = (mail: string): boolean => {
  // return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
  return /^\w+([.+-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(mail);
};

// Validates a password given that:
// • The password length must be greater than or equal to 8
// • The password must contain one or more uppercase characters
// • The password must contain one or more lowercase characters
// • The password must contain one or more numeric values
// • The password must contain one or more special characters
export const validatePassword = (password: string) => {
  return /(?=^.{8,}$)(?=.*\d)(?=.*[!@#$%^&*]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(password);
};

export const validateHasUpper = (password: string) => {
  return /(?=.*[A-Z]).*$/.test(password);
};

export const validateHasLower = (password: string) => {
  return /(?=.*[a-z]).*$/.test(password);
};

export const validateHasNumeric = (password: string) => {
  return /(?=.*\d).*$/.test(password);
};
export const validateHasSpecial = (password: string) => {
  return /(?=.*[!@#$%^&*]+)(?![.\n]).*$/.test(password);
};

export const dataURItoBlob = (dataURI: any) => {
  // convert base64/URLEncoded data component to raw binary data held in a string
  let byteString = null;
  if (dataURI.split(',')[0].indexOf('base64') >= 0) {
    byteString = atob(dataURI.split(',')[1]);
  } else {
    byteString = unescape(dataURI.split(',')[1]);
  }

  // separate out the mime component
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  // write the bytes of the string to a typed array
  const ia = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ia], { type: mimeString });
};

// Takes a list of Objects and deconstructs them, adding them recursively to a new object.
export const flatten = (dicts: (Object | undefined)[]): Object => {
  return Object.assign({}, ...dicts);
};

// Pads a number with 0's until it is the desired length
export const padWithZeros = (num: number, length: number): string => {
  let str = '' + num;
  while (str.length < length) {
    str = '0' + str;
  }
  return str;
};

// Gives True/False x amount of the time.
export const randBool = (percent = 0.5): Boolean => {
  return Math.random() < percent;
};

// Strips/Changes special characters
export const replaceSpecialCharacters = (item: string, r?: string) => {
  return item?.length > 0 ? item.replace(/[^a-zA-Z0-9]/g, r || '') : item;
};

export function capitalize(item: string): string {
  return item.charAt(0).toUpperCase() + item.slice(1);
}
