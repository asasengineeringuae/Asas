import {appendFile, mkdir} from 'fs/promises';
import path from 'path';
import {tmpdir} from 'os';

export const STAFF_INBOX = process.env.STAFF_NOTIFY_EMAIL || 'bahaa@asasengg.ae';

function mailDir() {
  if (process.env.VERCEL) return path.join(tmpdir(), 'asas-mail');
  return path.join(process.cwd(), '.data', 'mail');
}

async function queueLocal(payload) {
  try {
    await mkdir(mailDir(), {recursive: true});
    await appendFile(path.join(mailDir(), 'queue.jsonl'), `${JSON.stringify(payload)}\n`, 'utf8');
  } catch (error) {
    console.error('[mail] queue write skipped', error.message);
  }
}

async function sendViaResend({to, subject, text, html, replyTo}) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return {ok: false, reason: 'no-resend'};
  const from = process.env.MAIL_FROM || 'ASAS Engineering <onboarding@resend.dev>';
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {Authorization: `Bearer ${key}`, 'Content-Type': 'application/json'},
    body: JSON.stringify({
      from,
      to,
      subject,
      text,
      html: html || undefined,
      reply_to: replyTo || undefined,
    }),
  });
  if (!res.ok) throw new Error(await res.text());
  return {ok: true, provider: 'resend'};
}

async function sendViaWeb3Forms({to, subject, text, replyTo}) {
  const key = process.env.WEB3FORMS_ACCESS_KEY;
  if (!key) return {ok: false, reason: 'no-web3forms'};
  const res = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: {'Content-Type': 'application/json', Accept: 'application/json'},
    body: JSON.stringify({
      access_key: key,
      subject,
      from_name: 'ASAS Website',
      name: 'ASAS Website',
      email: replyTo || STAFF_INBOX,
      message: `${Array.isArray(to) ? to.join(', ') : to}\n\n${text}`,
      botcheck: '',
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.success === false) {
    throw new Error(data.message || `web3forms ${res.status}`);
  }
  return {ok: true, provider: 'web3forms'};
}

export async function sendMail({to, subject, text, html, replyTo}) {
  const recipients = (Array.isArray(to) ? to : [to]).filter(Boolean);
  if (!recipients.length) return {ok: false, reason: 'no-recipient'};
  const payload = {
    at: new Date().toISOString(),
    to: recipients,
    subject: String(subject || ''),
    text: String(text || ''),
    html: html || null,
    replyTo: replyTo || null,
  };
  await queueLocal(payload);

  const attempts = [sendViaResend, sendViaWeb3Forms];
  let lastError = '';
  for (const attempt of attempts) {
    try {
      const result = await attempt({
        to: recipients,
        subject: payload.subject,
        text: payload.text,
        html: payload.html,
        replyTo,
      });
      if (result.ok) return {ok: true, sent: true, queued: true, provider: result.provider};
    } catch (error) {
      lastError = error.message;
      console.error('[mail] provider failed', error.message);
    }
  }
  return {ok: true, sent: false, queued: true, reason: lastError || 'no-mail-provider'};
}

export async function notifyStaff(subject, text, {replyTo} = {}) {
  return sendMail({to: STAFF_INBOX, subject, text, replyTo});
}
