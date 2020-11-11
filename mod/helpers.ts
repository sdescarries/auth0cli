export const camel = (input: string): string => input[1].toLocaleUpperCase();
export const under = (input: string): string => `_${input}`;

export const toCamelCase = (input: string): string =>
  input
    .toLocaleLowerCase()
    .replace(/(_[a-z])/g, camel);

export const toUnderscore = (input: string): string =>
  input
    .replace(/([A-Z])/g, under)
    .toLocaleLowerCase();

export interface Converter {
  (input: string): string;
}

export const convertParamsTo = (converter: Converter) =>
  (
    params: Record<string, string | undefined>,
  ) =>
    Object.fromEntries(
      Object.entries(params)
        .map((
          [key, value]: [string, string | undefined],
        ) => [converter(key), value]),
    );

export const convertToUnderscore = convertParamsTo(toUnderscore);
export const convertToCamelCase = convertParamsTo(toCamelCase);

export type Params = Record<string, string | undefined>;

export function validateParams(params: Params, fillers: Params = {}): string[] {
  const result: string[] = [];
  for (const key in params) {
    if (params[key] == null || params[key] === "") {
      const filler = fillers[key];
      if (filler == null || filler === "") {
        result.push(`required parameter [${key}] is not set`);
      } else {
        params[key] = filler;
      }
    }
  }
  return result;
}

export default {
  convertParamsTo,
  convertToCamelCase,
  convertToUnderscore,
  toCamelCase,
  toUnderscore,
  validateParams,
};
