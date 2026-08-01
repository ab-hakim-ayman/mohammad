import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = (
    requested && routing.locales.includes(requested as any) ? requested : routing.defaultLocale
  ) as string;

  return {
    locale,
    messages: (await import(`@/shared/i18n/messages/${locale}.json`)).default,
    timeZone: "Asia/Dhaka",
    onError(error) {
      if (error.code === "MISSING_MESSAGE") {
        return;
      }
      console.error(error);
    },
    getMessageFallback({ namespace, key, error }) {
      return key;
    },
  };
});
