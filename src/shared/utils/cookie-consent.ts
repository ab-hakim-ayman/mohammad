// src/shared/utils/cookieConsent.ts
import Cookies from "js-cookie";

export function getCookieConsent() {
    const consentRaw = Cookies.get("cookie_consent_choice");
    if (!consentRaw) return null;

    try {
        return JSON.parse(consentRaw) as {
            choice: string;
            essential: boolean;
            analytics: boolean;
            marketing: boolean;
        };
    } catch {
        return null;
    }
}

export function isAnalyticsAllowed() {
    const consent = getCookieConsent();
    return consent?.analytics === true;
}