import { defaultLocale, type Locale } from "@/shared/i18n";

const BRAND_NAME = "A2ICoders";
const BRAND_TAGLINE = "Building dependable software with clarity and care.";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function toPlainUrl(url: string) {
  return url.replace(/^https?:\/\//, "");
}

function buildShell(params: {
  locale: Locale;
  subject: string;
  preheader: string;
  heading: string;
  body: string;
  ctaLabel: string;
  ctaUrl: string;
  footerNote?: string;
}) {
  const { locale, subject, preheader, heading, body, ctaLabel, ctaUrl, footerNote } = params;
  const safeHeading = escapeHtml(heading);
  const safeBody = body;
  const safeCtaLabel = escapeHtml(ctaLabel);
  const safeCtaUrl = escapeHtml(ctaUrl);
  const safeSubject = escapeHtml(subject);
  const safePreheader = escapeHtml(preheader);
  const safeFooter = escapeHtml(footerNote || BRAND_TAGLINE);

  const html = `
 <!doctype html>
 <html lang="${locale}">
 <head>
 <meta charset="utf-8" />
 <meta name="viewport" content="width=device-width, initial-scale=1" />
 <title>${safeSubject}</title>
 </head>
 <body style="margin:0;background:rgb(248 250 252);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:rgb(15 23 42);">
 <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${safePreheader}</div>
 <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:rgb(248 250 252);padding:40px 16px;">
 <tr>
 <td align="center">
 <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:640px;background:rgb(255 255 255);border:1px solid rgb(226 232 240);border-radius:24px;overflow:hidden;box-shadow:0 18px 50px rgba(15,23,42,0.08);">
 <tr>
 <td style="padding:32px 32px 24px 32px;border-bottom:1px solid rgb(226 232 240);">
 <div style="font-size:12px;letter-spacing:.24em;text-transform:uppercase;color:rgb(37 99 235);font-weight:700;margin-bottom:12px;">${BRAND_NAME}</div>
 <h1 style="margin:0;font-size:28px;line-height:1.2;font-weight:700;color:rgb(2 6 23);">${safeHeading}</h1>
 </td>
 </tr>
 <tr>
 <td style="padding:32px;">
 <div style="font-size:16px;line-height:1.8;color:rgb(51 65 85);">${safeBody}</div>
 <div style="margin-top:32px;text-align:center;">
 <a href="${safeCtaUrl}" style="display:inline-block;background:rgb(37 99 235);color:rgb(255 255 255);text-decoration:none;font-weight:700;font-size:15px;padding:14px 24px;border-radius:999px;">${safeCtaLabel}</a>
 </div>
 <div style="margin-top:28px;font-size:13px;line-height:1.7;color:rgb(100 116 139);word-break:break-word;">
 If the button does not work, copy and paste this link into your browser:<br />
 <a href="${safeCtaUrl}" style="color:rgb(37 99 235);text-decoration:underline;">${toPlainUrl(safeCtaUrl)}</a>
 </div>
 </td>
 </tr>
 <tr>
 <td style="padding:20px 32px 32px 32px;border-top:1px solid rgb(226 232 240);font-size:12px;line-height:1.7;color:rgb(100 116 139);">
 ${safeFooter}
 </td>
 </tr>
 </table>
 </td>
 </tr>
 </table>
 </body>
 </html>
 `;

  const text = [
    BRAND_NAME,
    heading,
    "",
    body.replace(/<[^>]+>/g, ""),
    "",
    `Open: ${ctaUrl}`,
    "",
    footerNote || BRAND_TAGLINE,
  ].join("\n");

  return { html, text, subject };
}

export function buildInviteEmail(params: {
  tokenUrl: string;
  recipientName?: string | null;
  invitedByName?: string | null;
  role?: string | null;
  expiresAt?: Date | string | null;
  locale?: Locale;
}) {
  const recipientName = params.recipientName?.trim() || "there";
  const inviterName = params.invitedByName?.trim() || BRAND_NAME;
  const roleLabel = params.role ? params.role.replace(/_/g, " ").toLowerCase() : "workspace member";
  const expiryText = params.expiresAt
    ? ` This invitation expires on ${new Date(params.expiresAt).toLocaleString()}.`
    : "";
  const body = `
 <p style="margin:0 0 16px 0;">Hi ${escapeHtml(recipientName)},</p>
 <p style="margin:0 0 16px 0;">${escapeHtml(inviterName)} invited you to join <strong>${BRAND_NAME}</strong> as a ${escapeHtml(roleLabel)}.${escapeHtml(expiryText)}</p>
 <p style="margin:0 0 16px 0;">Use the button below to accept the invitation, set your password, and activate your account.</p>
 `;

  return buildShell({
    locale: params.locale || defaultLocale,
    subject: `You're invited to join ${BRAND_NAME}`,
    preheader: `Accept your ${BRAND_NAME} invitation and activate your account.`,
    heading: "Accept your invitation",
    body,
    ctaLabel: "Accept invitation",
    ctaUrl: params.tokenUrl,
    footerNote: `${BRAND_NAME} · ${BRAND_TAGLINE}`,
  });
}

export function buildResetPasswordEmail(params: {
  tokenUrl: string;
  recipientName?: string | null;
  locale?: Locale;
}) {
  const recipientName = params.recipientName?.trim() || "there";
  const body = `
 <p style="margin:0 0 16px 0;">Hi ${escapeHtml(recipientName)},</p>
 <p style="margin:0 0 16px 0;">We received a request to reset your <strong>${BRAND_NAME}</strong> password.</p>
 <p style="margin:0 0 16px 0;">Use the button below to choose a new password. If you did not request this, you can safely ignore this email.</p>
 `;

  return buildShell({
    locale: params.locale || defaultLocale,
    subject: `Reset your ${BRAND_NAME} password`,
    preheader: `Reset your ${BRAND_NAME} password using the secure link below.`,
    heading: "Reset your password",
    body,
    ctaLabel: "Reset password",
    ctaUrl: params.tokenUrl,
    footerNote: `${BRAND_NAME} · ${BRAND_TAGLINE}`,
  });
}

export function buildUnsubscribeOtpEmail(params: { otp: string; locale?: Locale }) {
  const body = `
 <p style="margin:0 0 16px 0;">Hi there,</p>
 <p style="margin:0 0 16px 0;">We received a request to unsubscribe this email address from the <strong>${BRAND_NAME}</strong> newsletter.</p>
 <p style="margin:0 0 16px 0;">To complete the unsubscription process, please use the verification code below:</p>
 <div style="text-align:center; margin: 32px 0;">
  <span style="font-size: 32px; font-weight: bold; letter-spacing: 0.1em; color: rgb(2 6 23); background: rgb(241 245 249); padding: 12px 24px; border-radius: 8px; font-family: ui-monospace, monospace;">${params.otp}</span>
 </div>
 <p style="margin:0 0 16px 0;">This code will expire in 15 minutes. If you did not request this, you can safely ignore this email and remain subscribed.</p>
 `;

  return buildShell({
    locale: params.locale || defaultLocale,
    subject: `Unsubscribe verification code for ${BRAND_NAME} newsletter`,
    preheader: `Your verification code is ${params.otp}.`,
    heading: "Unsubscribe verification",
    body,
    ctaLabel: "Return to website",
    ctaUrl: "javascript:void(0);", // Normally they will enter it directly on the site
    footerNote: `${BRAND_NAME} · ${BRAND_TAGLINE}`,
  });
}
