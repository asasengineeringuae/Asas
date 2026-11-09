'use client';

import {useState} from 'react';
import {ArrowUpRight, CheckCircle2, Loader2, Mail} from 'lucide-react';
import {services as servicesSeed} from '@/data/services';

const REQUIRED_MSG = {
  en: 'Please fill out this field.',
  ar: 'يرجى تعبئة هذا الحقل.',
};

const EMAIL_MSG = {
  en: 'Please enter a valid email address.',
  ar: 'يرجى إدخال بريد إلكتروني صالح.',
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function HomeContactForm({locale = 'en', services}) {
  const ar = locale === 'ar';
  const list = Array.isArray(services) && services.length ? services : servicesSeed;
  const requiredMsg = ar ? REQUIRED_MSG.ar : REQUIRED_MSG.en;
  const emailMsg = ar ? EMAIL_MSG.ar : EMAIL_MSG.en;
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  function applyValidity(event) {
    const el = event.currentTarget;
    if (el.validity.valueMissing) {
      el.setCustomValidity(requiredMsg);
      return;
    }
    if (el.type === 'email' && (el.validity.typeMismatch || !EMAIL_RE.test(el.value.trim()))) {
      el.setCustomValidity(emailMsg);
      return;
    }
    el.setCustomValidity('');
  }

  function clearValidity(event) {
    event.currentTarget.setCustomValidity('');
  }

  async function onSubmit(event) {
    event.preventDefault();
    if (status === 'loading') return;
    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const phone = String(data.get('phone') || '').trim();
    const service = String(data.get('service') || '').trim();
    const message = String(data.get('message') || '').trim();
    const serviceLabel = list.find((item) => item.slug === service)?.[ar ? 'titleAr' : 'title'] || service;

    setStatus('loading');
    setError('');
    try {
      const res = await fetch('/api/public/enquiry', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          name,
          email,
          phone,
          service,
          serviceLabel,
          message,
          locale,
          source: 'home-contact',
        }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(payload.error || 'Failed');
      form.reset();
      setStatus('success');
    } catch {
      setStatus('idle');
      setError(
        ar
          ? 'تعذر إرسال الرسالة. حاول مرة أخرى أو راسل bahaa@asasengg.ae'
          : 'Could not send the enquiry. Please try again or email bahaa@asasengg.ae',
      );
    }
  }

  if (status === 'success') {
    return (
      <div className="home-contact-success" role="status">
        <CheckCircle2 size={28} aria-hidden="true" />
        <h3>{ar ? 'تم إرسال استفسارك' : 'Your enquiry was sent'}</h3>
        <p>
          {ar
            ? 'وصلت الرسالة إلى فريق أساس وستظهر في لوحة الإدارة. سنتواصل معك قريباً.'
            : 'The message reached the ASAS team and is stored in the admin inbox. We will get back to you shortly.'}
        </p>
        <button type="button" className="button" onClick={() => setStatus('idle')}>
          {ar ? 'إرسال رسالة أخرى' : 'Send another message'}
        </button>
      </div>
    );
  }

  return (
    <form className="home-contact-form" onSubmit={onSubmit} noValidate={false} lang={ar ? 'ar' : 'en'}>
      <div className="home-contact-fields">
        <label>
          <span>{ar ? 'الاسم' : 'Your name'}</span>
          <input
            name="name"
            autoComplete="name"
            required
            onInvalid={applyValidity}
            onInput={clearValidity}
          />
        </label>
        <label>
          <span>{ar ? 'البريد الإلكتروني' : 'Your email'}</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            dir="ltr"
            onInvalid={applyValidity}
            onInput={clearValidity}
          />
        </label>
        <label>
          <span>{ar ? 'رقم الهاتف' : 'Phone number'}</span>
          <input name="phone" type="tel" autoComplete="tel" dir="ltr" />
        </label>
        <label>
          <span>{ar ? 'الخدمة المطلوبة' : 'Service'}</span>
          <select name="service" defaultValue="">
            <option value="" disabled>{ar ? 'اختر خدمة' : 'Select a service'}</option>
            {list.map((service) => (
              <option value={service.slug} key={service.slug}>
                {ar ? service.titleAr : service.title}
              </option>
            ))}
          </select>
        </label>
        <label className="home-contact-message">
          <span>{ar ? 'أخبرنا عن مشروعك' : 'Tell us about your project'}</span>
          <textarea
            name="message"
            rows={5}
            required
            onInvalid={applyValidity}
            onInput={clearValidity}
          />
        </label>
      </div>
      {error ? <p className="home-contact-error">{error}</p> : null}
      <button type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? (
          <>
            <Loader2 size={17} className="enquiry-spin" aria-hidden="true" />
            {ar ? 'جاري الإرسال…' : 'Sending…'}
          </>
        ) : (
          <>
            <Mail size={17} aria-hidden="true" />
            {ar ? 'إرسال الاستفسار' : 'Send enquiry'}
            <ArrowUpRight size={17} aria-hidden="true" className={ar ? 'reverse-arrow' : ''} />
          </>
        )}
      </button>
      <p className="home-contact-note">
        {ar
          ? 'تُحفظ الرسالة في النظام وتُرسل إلى bahaa@asasengg.ae'
          : 'Saved in the admin inbox and emailed to bahaa@asasengg.ae'}
      </p>
    </form>
  );
}
