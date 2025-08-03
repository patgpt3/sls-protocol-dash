export function wait (seconds: number) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

export const uniqueKeysFromObjectArray = (data: Object[]): string[] => {
  return Object.keys(Object.assign({}, ...data));
};
