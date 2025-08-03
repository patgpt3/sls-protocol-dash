// @ts-nocheck
export const reloadWindow = () => {
  window.location.reload();
};

export const parseTemplate = (template, args) => {
  if (args) {
    for (const key in args) {
      const value = args[key];
      const pattern = new RegExp(`{{${key}}}`, 'gi');
      template = template.replace(pattern, `${value}`);
    }
  }
  return template;
};

export const parsePath = (url: string) => {
  return new URL(url).pathname;
};
