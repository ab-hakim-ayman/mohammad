import { logger } from "@/core/logger/logger";
import { defaultLocale, type Locale } from "@/shared/i18n";
import { buildInviteEmail, buildResetPasswordEmail, buildUnsubscribeOtpEmail } from "./templates";
import nodemailer from "nodemailer";

export interface MailSendInput {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  idempotencyKey?: string;
}

export interface MailDeliveryResult {
  provider: "resend" | "smtp" | "disabled";
  sent: boolean;
  messageId: string | null;
}

function getBaseUrl() {
  return process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

function getLocalePath(locale: Locale = defaultLocale) {
  return locale || defaultLocale;
}

function buildAbsoluteUrl(pathname: string, locale: Locale = defaultLocale) {
  const base = getBaseUrl();
  return new URL(`/${getLocalePath(locale)}${pathname}`, base).toString();
}

function getFromAddress() {
  return process.env.MAIL_FROM || "A2ICoders <onboarding@resend.dev>";
}

function getApiKey() {
  return process.env.RESEND_API_KEY || "";
}

function getSmtpConfig() {
  return {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  };
}

async function sendMail(input: MailSendInput): Promise<MailDeliveryResult> {
  const smtpConfig = getSmtpConfig();
  const resendApiKey = getApiKey();

  if (smtpConfig.host && smtpConfig.user && smtpConfig.pass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpConfig.host,
        port: smtpConfig.port,
        secure: smtpConfig.port === 465,
        auth: {
          user: smtpConfig.user,
          pass: smtpConfig.pass,
        },
      });

      const info = await transporter.sendMail({
        from: getFromAddress(),
        to: Array.isArray(input.to) ? input.to.join(", ") : input.to,
        subject: input.subject,
        html: input.html,
        text: input.text,
      });

      return { provider: "smtp", sent: true, messageId: info.messageId };
    } catch (error: any) {
      logger.error("SMTP Mail delivery failed", error, {
        provider: "smtp",
        to: input.to,
        subject: input.subject,
      });
      return { provider: "smtp", sent: false, messageId: null };
    }
  }

  if (resendApiKey) {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
        "User-Agent": "A2ICoders Mailer/1.0",
        ...(input.idempotencyKey ? { "Idempotency-Key": input.idempotencyKey } : {}),
      },
      body: JSON.stringify({
        from: getFromAddress(),
        to: input.to,
        subject: input.subject,
        html: input.html,
        text: input.text,
      }),
    });

    const payload = (await response.json().catch(() => null)) as {
      id?: string;
      error?: { message?: string };
    } | null;

    if (!response.ok) {
      const message =
        payload?.error?.message || `Mail delivery failed with status ${response.status}`;
      logger.error("Resend Mail delivery failed", new Error(message), {
        provider: "resend",
        to: input.to,
        subject: input.subject,
        status: response.status,
      });
      return { provider: "resend", sent: false, messageId: null };
    }

    return { provider: "resend", sent: true, messageId: payload?.id ?? null };
  }

  logger.warn("Mail send skipped because neither SMTP nor RESEND_API_KEY is configured", {
    to: input.to,
    subject: input.subject,
  });
  return { provider: "disabled", sent: false, messageId: null };
}

export async function sendInviteEmail(params: {
  to: string;
  token: string;
  recipientName?: string | null;
  invitedByName?: string | null;
  role?: string | null;
  expiresAt?: Date | string | null;
  locale?: Locale;
}) {
  const locale = params.locale || defaultLocale;
  const tokenUrl = buildAbsoluteUrl(
    `/accept-invite?token=${encodeURIComponent(params.token)}`,
    locale
  );
  const email = buildInviteEmail({
    tokenUrl,
    recipientName: params.recipientName,
    invitedByName: params.invitedByName,
    role: params.role,
    expiresAt: params.expiresAt,
    locale,
  });

  return sendMail({
    to: params.to,
    subject: email.subject,
    html: email.html,
    text: email.text,
    idempotencyKey: `invite:${params.to}:${params.token}`,
  });
}

export async function sendPasswordResetEmail(params: {
  to: string;
  token: string;
  recipientName?: string | null;
  locale?: Locale;
}) {
  const locale = params.locale || defaultLocale;
  const tokenUrl = buildAbsoluteUrl(
    `/reset-password?token=${encodeURIComponent(params.token)}`,
    locale
  );
  const email = buildResetPasswordEmail({
    tokenUrl,
    recipientName: params.recipientName,
    locale,
  });

  return sendMail({
    to: params.to,
    subject: email.subject,
    html: email.html,
    text: email.text,
    idempotencyKey: `reset:${params.to}:${params.token}`,
  });
}

export async function sendUnsubscribeOtpEmail(params: {
  to: string;
  otp: string;
  locale?: Locale;
}) {
  const email = buildUnsubscribeOtpEmail({
    otp: params.otp,
    locale: params.locale,
  });

  return sendMail({
    to: params.to,
    subject: email.subject,
    html: email.html,
    text: email.text,
    idempotencyKey: `unsubscribe:${params.to}:${params.otp}`,
  });
}

export { buildAbsoluteUrl };
