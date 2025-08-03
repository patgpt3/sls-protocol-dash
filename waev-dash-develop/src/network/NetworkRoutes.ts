/// /////////////////////////////
//
// Backend Routes
//
/// /////////////////////////////
import jquery from 'jquery';

import { parsePath, parseTemplate } from 'utils';
import sec from 'utils/token';

export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
export const API_VER = '2022-04';

export const CLIENT = 'client';
export const DASHBOARD = 'dashboard';
export const PARTNER = 'partner';

export * from './organizations';

// Abort Signals
export const abortController = new AbortController();

// Call API Method
const requestMethods = {
  // @ts-ignore
  get: (url: string, body: object, params: any, signal = null, token = undefined) => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    } else if (parsePath(url) === '/organizations') {
      // Temporary way to hide post-auth error.
      return Promise.resolve({ text: async () => {}, ok: true });
    }
    return fetch(`${parseTemplate(url, params)}?${jquery.param(body || {})}`, {
      credentials: 'include',
      signal,
      headers,
    });
  },
  // @ts-ignore
  post: (url: string, body: object, params: any, signal = null, token = undefined) => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return fetch(parseTemplate(url, params), {
      method: 'POST',
      credentials: 'include',
      headers,
      redirect: 'follow',
      body: typeof body === 'string' ? body : JSON.stringify(body),
      signal,
    });
  },
  // @ts-ignore
  put: (url: string, body: object, params: any, signal = null, token = undefined) => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return fetch(parseTemplate(url, params), {
      method: 'PUT',
      credentials: 'include',
      headers,
      redirect: 'follow',
      body: typeof body === 'string' ? body : JSON.stringify(body),
      signal,
    });
  },
  // @ts-ignore
  patch: (url: string, body: object, params: any, signal = null, token = undefined) => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      mode: 'no-cors',
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return fetch(parseTemplate(url, params), {
      method: 'PATCH',
      credentials: 'include',
      headers,
      redirect: 'follow',
      body: typeof body === 'string' ? body : JSON.stringify(body),
      signal,
    });
  },
  // @ts-ignore
  delete: (url: string, body: object, params: any, signal = null, token = undefined) => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return fetch(parseTemplate(url, params), {
      method: 'DELETE',
      credentials: 'include',
      headers,
      redirect: 'follow',
      body: typeof body === 'string' ? body : JSON.stringify(body),
      signal,
    });
  },
  // @ts-ignore
  upload: (url: string, body: object, params: any, signal = null, token = undefined) => {
    const headers: HeadersInit = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    const formData = new FormData();
    for (const key in body) {
      // @ts-ignore
      formData.append(key, body[key]);
    }
    return fetch(parseTemplate(url, params), {
      method: 'POST',
      credentials: 'include',
      headers,
      body: formData,
      signal,
    });
  },
};

export const call = async (
  method: string,
  url: string,
  body: object | string | null = null,
  params: any = null,
  signal: any = null
): Promise<Response> => {
  let accessToken: string;
  // Hack to remove "Is not a function" error
  try {
    const retrieve: Function = await sec.getAccessTokenSilently();
    accessToken = await retrieve();
  } catch (e) {
    const retrieve: Function = await sec.getAccessTokenSilently();
    accessToken = await retrieve();
  }

  signal = !signal && signal !== -1 ? abortController.signal : signal === -1 ? null : signal;
  method = method.toLowerCase();
  // params = { mode: 'no-cors' as RequestMode, ...params };
  // @ts-ignore
  return requestMethods[method](url, body, params, signal, accessToken).then(
    (response: {
      headers: { get: (arg0: string) => string };
      json: () => any;
      text: () => Promise<any>;
      body: () => Promise<any>;
      ok: any;
      status: number;
    }) => {
      let promise = null;
      promise = response.text().then((text: any) => {
        return text ? JSON.parse(text) : {};
      });

      if (response.ok) {
        promise = promise.then((data: any) => Promise.resolve(data));
      } else {
        if (
          (response.status === 401 || response.status === 403) &&
          ![
            'sign-in',
            'register',
            'waev-registration-page',
            'forgot-password',
            'home',
            'magiclink',
          ].includes(parsePath(window.location.href).replace(/[/?]/g, '')) &&
          signal
        ) {
          console.error('Aborting!');
          abortController.abort();
          sec.setAccessTokenSilently(() => Promise.resolve(null));
          // @ts-ignore
          window.location = '/magiclink';
        }
        promise = promise.then((data: any) => Promise.reject(data));
      }
      return promise;
    }
  );
};
