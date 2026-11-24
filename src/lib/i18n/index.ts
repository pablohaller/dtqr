import { cookies } from "next/headers";
import { en, type Dict } from "./locales/en";
import { es } from "./locales/es";

export type { Dict };
export { interpolate } from "./client";

export const LOCALES = ["en", "es"] as const;
export type Locale = (typeof LOCALES)[number];

const dicts: Record<Locale, Dict> = { en, es };

const DEFAULT_LOCALE: Locale = "en";

export const getLocale = async (): Promise<Locale> => {
  const value = (await cookies()).get("locale")?.value;
  return LOCALES.includes(value as Locale) ? (value as Locale) : DEFAULT_LOCALE;
};

export const getTranslations = async (): Promise<Dict> =>
  dicts[await getLocale()];
