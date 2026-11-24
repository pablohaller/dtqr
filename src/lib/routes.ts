export const HOME = "/";
export const SELECT = "/select";
export const RESULT = "/result";

export const generateRoute = (
  route: string,
  params: Record<string, string>,
) =>
  Object.entries(params).reduce(
    (path, [key, value]) => path.replace(`:${key}`, encodeURIComponent(value)),
    route,
  );
