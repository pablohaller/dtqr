export const interpolate = (
  template: string,
  values: Record<string, string | number>,
) =>
  Object.entries(values).reduce(
    (acc, [key, value]) => acc.replaceAll(`{${key}}`, String(value)),
    template,
  );
