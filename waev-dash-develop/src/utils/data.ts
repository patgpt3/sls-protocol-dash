// import { isSampleMode } from 'utils';

export const isDev = process.env.NODE_ENV === 'development';
export const isProd = process.env.NODE_ENV !== 'development';

// Now we use useLocal hook.

export const clearLocalStore = () => {
  localStorage.clear();
};

const convertDataUrlToBlob = (
  dataUrl: string
): { blob: Blob; type: string; fileType?: string } | void => {
  const arr = dataUrl.split(',');
  if (arr[0]) {
    // @ts-ignore
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return {
      blob: new Blob([u8arr], { type: mime }),
      type: mime,
      fileType: mime.split('/')[1] || '',
    };
  }
};

// Converts a media URI blob into a File.
export const uriToFile = (dataUrl: string, name?: string): File | void => {
  const payload = convertDataUrlToBlob(dataUrl);
  if (payload) {
    const filename = name || `Image-${new Date().valueOf().toString()}.${payload.fileType}`;
    return new File([payload.blob], filename, {
      type: payload.type,
    });
  }
};

// A wrapper for "JSON.parse()"" to support "undefined" value
export function parseJSON<T>(value: string | null): T | undefined {
  try {
    return value === 'undefined' ? undefined : JSON.parse(value ?? '');
  } catch {
    console.error('parsing error on', { value });
    return undefined;
  }
}

export const toHex = (str: string): string => {
  let result = '';
  if (!str || str?.length === 0) {
    return '';
  }
  for (let i = 0; i < str.length; i++) {
    result += str.charCodeAt(i).toString(16);
  }
  return result;
};

export function deepCopy<T>(obj: T): T {
  var copy;

  // Handle the 3 simple types, and null or undefined
  if (null == obj || 'object' != typeof obj) return obj;

  // Handle Date
  if (obj instanceof Date) {
    copy = new Date();
    copy.setTime(obj.getTime());
    //@ts-ignore
    return copy;
  }

  // Handle Array
  if (obj instanceof Array) {
    copy = [];
    for (var i = 0, len = obj.length; i < len; i++) {
      copy[i] = deepCopy(obj[i]);
    }
    //@ts-ignore
    return copy;
  }

  // Handle Object
  if (obj instanceof Object) {
    copy = {};
    for (var attr in obj) {
      //@ts-ignore
      if (obj.hasOwnProperty(attr)) copy[attr] = deepCopy(obj[attr]);
    }
    //@ts-ignore
    return copy;
  }

  throw new Error("Unable to copy obj! Its type isn't supported.");
}
