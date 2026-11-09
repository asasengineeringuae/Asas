'use client';

import {useState} from 'react';
import {ArrowUpRight, CheckCircle2, Loader2, Mail} from 'lucide-react';
import {services as servicesSeed} from '@/data/services';

const EXTRA_OPTIONS = [
  {slug: 'other', title: 'Other', titleAr: 'أخرى'},
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const initial = {
  name: '',
  email: '',
  phone: '',
  service: '',
  location: '',
  message: '',
};

export default function EnquiryForm({
  locale = 'en',
  id = 'project-enquiry-form',
  services,
}) {
  const ar = locale === 'ar';
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [submitError, setSubmitError] = useState('');
  const options = [...(Array.isArray(services) && services.length ? services : servicesSeed), ...EXTRA_OPTIONS];

  const copy = ar
    ? {
        name: 'الاسم الكامل',
        email: 'البريد الإلكتروني',
        phone: 'رقم الهاتف',
        service: 'الخدمة المطلوبة',
        servicePlaceholder: 'اختر خدمة',
        location: 'موقع المشروع أو القطاع',
        locationHint: 'اختياري',
        message: 'تفاصيل المشروع',
        submit: 'إرسال الاستفسار',
        sending: 'جاري الإرسال…',
        successTitle: 'شكراً لك',
        successBody: 'وصلت رسالتك إلى bahaa@asasengg.ae وظهرت في لوحة الإدارة. سنتواصل معك قريباً.',
        reset: 'إرسال استفسار آخر',
        note: 'تُحفظ الرسالة في النظام وتُرسل إلى bahaa@asasengg.ae',
        sendFailed: 'تعذر إرسال الرسالة. حاول مرة أخرى.',
        required: 'هذا الحقل مطلوب',
        emailInvalid: 'أدخل بريداً إلكترونياً صالحاً',
      }
    : {
        name: 'Full name',
        email: 'Email address',
        phone: 'Phone number',
        service: 'Service needed',
        servicePlaceholder: 'Select a service',
        location: 'Project location or sector',
        locationHint: 'Optional',
        message: 'Message / project details',
        submit: 'Submit Project Enquiry',
        sending: 'Sending…',
        successTitle: 'Thanks — our team will be in touch shortly',
        successBody: 'Your enquiry was emailed to bahaa@asasengg.ae and saved in the admin inbox.',
        reset: 'Send another enquiry',
        note: 'Saved in the admin inbox and emailed to bahaa@asasengg.ae',
        sendFailed: 'Could not send the enquiry. Please try again.',
        required: 'This field is required',
        emailInvalid: 'Enter a valid email address',
      };

  function setField(key, value) {
    setValues((prev) => ({...prev, [key]: value}));
    if (errors[key]) setErrors((prev) => ({...prev, [key]: undefined}));
  }

  function validate() {
    const next = {};
    if (!values.name.trim()) next.name = copy.required;
    if (!values.email.trim()) next.email = copy.required;
    else if (!EMAIL_RE.test(values.email.trim())) next.email = copy.emailInvalid;
    if (!values.phone.trim()) next.phone = copy.required;
    if (!values.service) next.service = copy.required;
    if (!values.message.trim()) next.message = copy.required;
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(event) {
    event.preventDefault();
    if (status === 'loading') return;
    if (!validate()) return;

    setStatus('loading');
    setSubmitError('');
    const serviceLabel =
      options.find((item) => item.slug === values.service)?.[ar ? 'titleAr' : 'title'] || values.service;

    try {
      const res = await fetch('/api/public/enquiry', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          phone: values.phone.trim(),
          service: values.service,
          serviceLabel,
          location: values.location.trim(),
          message: values.message.trim(),
          locale,
          source: id,
        }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(payload.error || 'Failed');
      setStatus('success');
    } catch {
      setStatus('idle');
      setSubmitError(copy.sendFailed);
    }
  }

  if (status === 'success') {
    return (
      <div className="enquiry-success" role="status">
        <CheckCircle2 size={28} aria-hidden="true" />
        <h3>{copy.successTitle}</h3>
        <p>{copy.successBody}</p>
        <button
          type="button"
          className="button enquiry-reset"
          onClick={() => {
            setValues(initial);
            setErrors({});
            setSubmitError('');
            setStatus('idle');
          }}
        >
          {copy.reset}
        </button>
      </div>
    );
  }

  return (
    <form className="enquiry-form" id={id} onSubmit={onSubmit} noValidate>
      <div className="enquiry-fields">
        <label className={errors.name ? 'has-error' : undefined}>
          <span>{copy.name}</span>
          <input
            name="name"
            autoComplete="name"
            value={values.name}
            onChange={(e) => setField('name', e.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? `${id}-name-error` : undefined}
          />
          {errors.name && <em id={`${id}-name-error`}>{errors.name}</em>}
        </label>

        <label className={errors.email ? 'has-error' : undefined}>
          <span>{copy.email}</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            dir="ltr"
            value={values.email}
            onChange={(e) => setField('email', e.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? `${id}-email-error` : undefined}
          />
          {errors.email && <em id={`${id}-email-error`}>{errors.email}</em>}
        </label>

        <label className={errors.phone ? 'has-error' : undefined}>
          <span>{copy.phone}</span>
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            dir="ltr"
            value={values.phone}
            onChange={(e) => setField('phone', e.target.value)}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? `${id}-phone-error` : undefined}
          />
          {errors.phone && <em id={`${id}-phone-error`}>{errors.phone}</em>}
        </label>

        <label className={errors.service ? 'has-error' : undefined}>
          <span>{copy.service}</span>
          <select
            name="service"
            value={values.service}
            onChange={(e) => setField('service', e.target.value)}
            aria-invalid={Boolean(errors.service)}
            aria-describedby={errors.service ? `${id}-service-error` : undefined}
          >
            <option value="" disabled>
              {copy.servicePlaceholder}
            </option>
            {options.map((service) => (
              <option value={service.slug} key={service.slug}>
                {ar ? service.titleAr : service.title}
              </option>
            ))}
          </select>
          {errors.service && <em id={`${id}-service-error`}>{errors.service}</em>}
        </label>

        <label className="enquiry-location">
          <span>
            {copy.location} <small>{copy.locationHint}</small>
          </span>
          <input
            name="location"
            autoComplete="off"
            value={values.location}
            onChange={(e) => setField('location', e.target.value)}
          />
        </label>

        <label className={`enquiry-message${errors.message ? ' has-error' : ''}`}>
          <span>{copy.message}</span>
          <textarea
            name="message"
            rows={5}
            value={values.message}
            onChange={(e) => setField('message', e.target.value)}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? `${id}-message-error` : undefined}
          />
          {errors.message && <em id={`${id}-message-error`}>{errors.message}</em>}
        </label>
      </div>

      {submitError ? <p className="enquiry-note" role="alert">{submitError}</p> : null}
      <button className="button enquiry-submit" type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? (
          <>
            <Loader2 size={17} className="enquiry-spin" aria-hidden="true" />
            {copy.sending}
          </>
        ) : (
          <>
            <Mail size={17} aria-hidden="true" />
            {copy.submit}
            <ArrowUpRight size={17} aria-hidden="true" />
          </>
        )}
      </button>
      <p className="enquiry-note">{copy.note}</p>
    </form>
  );
}
