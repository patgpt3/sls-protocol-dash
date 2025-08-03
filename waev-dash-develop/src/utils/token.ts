// Util to allow for context data to be accessed outside of a React Component
let getAccessTokenSilently: () => Promise<string>;

export const sec = {
  getAccessTokenSilently: () => getAccessTokenSilently,
  setAccessTokenSilently: (func: () => Promise<string>) => (getAccessTokenSilently = func),
};

export default sec;

