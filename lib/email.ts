import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const FROM_ADDRESS = process.env.EMAIL_FROM || "Letus TV <onboarding@resend.dev>";

type SendResult = { ok: boolean; error?: string };

async function send(to: string, subject: string, html: string): Promise<SendResult> {
  if (!resend) {
    console.warn("RESEND_API_KEY not set — skipping email send:", subject);
    return { ok: false, error: "Email service not configured" };
  }
  try {
    const { error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to,
      subject,
      html,
    });
    if (error) {
      console.error("Resend error:", error);
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (err) {
    console.error("Email send failed:", err);
    return { ok: false, error: "Unexpected error sending email" };
  }
}

function wrapper(bodyHtml: string): string {
  return `
  <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; background: #f6f5f0; padding: 32px;">
    <div style="background: #0c2159; padding: 20px 24px; text-align: center;">
      <span style="font-family: Arial, sans-serif; font-weight: bold; font-size: 22px; color: #f6f5f0;">
        Letus<span style="color: #e3a336;">TV</span>
      </span>
    </div>
    <div style="background: #ffffff; padding: 28px 24px; color: #0b1220;">
      ${bodyHtml}
    </div>
    <p style="font-family: Arial, sans-serif; font-size: 12px; color: #4a5164; text-align: center; margin-top: 16px;">
      Letus TV — Let's Watch. Let's Know. Let's Connect.
    </p>
  </div>`;
}

export async function sendContactNotification(params: {
  to: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
}): Promise<SendResult> {
  const html = wrapper(`
    <h2 style="font-family: Arial, sans-serif; margin-top: 0;">New contact form message</h2>
    <p><strong>From:</strong> ${escapeHtml(params.name)} (${escapeHtml(params.email)})</p>
    ${params.subject ? `<p><strong>Subject:</strong> ${escapeHtml(params.subject)}</p>` : ""}
    <p style="white-space: pre-line; border-top: 1px solid #ddd9cd; padding-top: 16px; margin-top: 16px;">${escapeHtml(params.message)}</p>
  `);
  return send(params.to, `New message from ${params.name} — Letus TV`, html);
}

export async function sendContactAutoReply(params: {
  to: string;
  name: string;
}): Promise<SendResult> {
  const html = wrapper(`
    <h2 style="font-family: Arial, sans-serif; margin-top: 0;">Thanks for reaching out, ${escapeHtml(params.name)}</h2>
    <p>We've received your message and read every one that comes in. Someone from our team will get back to you soon.</p>
    <p>In the meantime, catch up on our latest coverage and live broadcasts at letustv.com.</p>
  `);
  return send(params.to, "We got your message — Letus TV", html);
}

export async function sendSubscriberWelcome(params: { to: string }): Promise<SendResult> {
  const html = wrapper(`
    <h2 style="font-family: Arial, sans-serif; margin-top: 0;">You're in.</h2>
    <p>Thanks for joining the Letus TV mailing list. One email a day, no noise — the headlines that matter, straight to your inbox.</p>
    <p>Let's Watch. Let's Know. Let's Connect.</p>
  `);
  return send(params.to, "Welcome to Letus TV", html);
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
