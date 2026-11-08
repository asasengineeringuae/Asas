'use client';

import {useMemo, useState} from 'react';
import {useRouter} from 'next/navigation';
import MediaPicker from '@/components/admin/media/MediaPicker';

const SECTION_LABELS = {
  hero: 'Hero carousel',
  about: 'About ASAS',
  clients: 'Clients',
  services: 'Services',
  stats: 'Key statistics',
  sectors: 'Sectors',
  process: 'Our process',
  portfolio: 'Portfolio',
  why: 'Why ASAS',
  testimonials: 'Testimonials',
  team: 'Leadership team',
  contact: 'Contact',
  faq: 'FAQs',
};

const TABS = [
  {id: 'layout', label: 'Page layout'},
  {id: 'hero', label: 'Hero slides'},
  {id: 'about', label: 'About'},
  {id: 'copy', label: 'Section copy'},
  {id: 'sectors', label: 'Sectors'},
  {id: 'why', label: 'Why ASAS'},
  {id: 'portfolio', label: 'Portfolio'},
  {id: 'faqs', label: 'FAQs'},
];

const COPY_FIELDS = [
  ['eyebrow', 'Hero eyebrow'],
  ['lede', 'Hero lede'],
  ['start', 'Start CTA'],
  ['work', 'Work CTA'],
  ['sectorEyebrow', 'Sectors eyebrow'],
  ['sectorTitle', 'Sectors title'],
  ['sectorCopy', 'Sectors copy'],
  ['sectorCta', 'Sectors CTA'],
  ['processEyebrow', 'Process eyebrow'],
  ['processTitle', 'Process title'],
  ['processCopy', 'Process copy'],
  ['archive', 'Portfolio eyebrow'],
  ['archiveTitle', 'Portfolio title'],
  ['archiveCopy', 'Portfolio copy'],
  ['archiveCta', 'Portfolio CTA'],
  ['featured', 'Featured label'],
  ['featuredTitle', 'Featured title'],
  ['featuredDesc', 'Featured description'],
];

function emptySlide() {
  return {
    id: `slide-${Date.now().toString(36)}`,
    enabled: true,
    image: '',
    video: '',
    crop: '50% 50%',
    strip: '',
    stripAr: '',
    location: '',
    locationAr: '',
    title: 'New slide',
    titleAr: '',
    note: '',
    noteAr: '',
    slug: '',
  };
}

function isVideoUrl(url) {
  return /\.(mp4|webm|mov|m4v)(\?|$)/i.test(String(url || ''));
}

function Pair({en, ar, enValue, arValue, onEn, onAr, multiline = false, disabled}) {
  const Control = multiline ? 'textarea' : 'input';
  return (
    <div className="pcs-pair">
      <label className="pcs-field">
        <span>{en}</span>
        <Control
          rows={multiline ? 4 : undefined}
          value={enValue || ''}
          onChange={(e) => onEn(e.target.value)}
          disabled={disabled}
        />
      </label>
      <label className="pcs-field">
        <span>{ar}</span>
        <Control
          rows={multiline ? 4 : undefined}
          value={arValue || ''}
          onChange={(e) => onAr(e.target.value)}
          disabled={disabled}
          dir="rtl"
        />
      </label>
    </div>
  );
}

export default function HomepageStudio({initialValue, canWrite}) {
  const router = useRouter();
  const [doc, setDoc] = useState(initialValue || {});
  const [tab, setTab] = useState('layout');
  const [slideIndex, setSlideIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const sections = useMemo(
    () => [...(doc.sections || [])].sort((a, b) => (a.order || 0) - (b.order || 0)),
    [doc.sections],
  );
  const slides = doc.heroSlides || [];
  const slide = slides[slideIndex] || slides[0];
  const cards = doc.sectorCards || [];
  const faqs = doc.faqs || [];

  function setSections(next) {
    setDoc((current) => ({
      ...current,
      sections: next.map((item, index) => ({...item, order: (index + 1) * 10})),
    }));
    setMessage('');
  }

  function moveSection(index, dir) {
    const next = index + dir;
    if (next < 0 || next >= sections.length) return;
    const copy = [...sections];
    [copy[index], copy[next]] = [copy[next], copy[index]];
    setSections(copy);
  }

  function updateSection(index, patch) {
    const copy = [...sections];
    copy[index] = {...copy[index], ...patch};
    setSections(copy);
  }

  function updateHeroSlide(index, patch) {
    setDoc((current) => {
      const heroSlides = [...(current.heroSlides || [])];
      heroSlides[index] = {...heroSlides[index], ...patch};
      return {...current, heroSlides};
    });
    setMessage('');
  }

  function updateSectorCard(index, patch) {
    setDoc((current) => {
      const sectorCards = [...(current.sectorCards || [])];
      sectorCards[index] = {...sectorCards[index], ...patch};
      return {...current, sectorCards};
    });
    setMessage('');
  }

  function updateAbout(patch) {
    setDoc((current) => ({...current, about: {...(current.about || {}), ...patch}}));
    setMessage('');
  }

  function updateFaq(index, patch) {
    setDoc((current) => {
      const nextFaqs = [...(current.faqs || [])];
      nextFaqs[index] = {...nextFaqs[index], ...patch};
      return {...current, faqs: nextFaqs};
    });
    setMessage('');
  }

  function updateCopy(locale, key, value) {
    setDoc((current) => ({
      ...current,
      copy: {
        ...(current.copy || {}),
        [locale]: {
          ...((current.copy || {})[locale] || {}),
          [key]: value,
        },
      },
    }));
    setMessage('');
  }

  function updateWhy(index, patch) {
    setDoc((current) => {
      const whyPoints = [...(current.whyPoints || [])];
      whyPoints[index] = {...whyPoints[index], ...patch};
      return {...current, whyPoints};
    });
    setMessage('');
  }

  function addSlide() {
    if (!canWrite) return;
    setDoc((current) => ({...current, heroSlides: [...(current.heroSlides || []), emptySlide()]}));
    setSlideIndex((doc.heroSlides || []).length);
    setMessage('');
  }

  function removeSlide(index) {
    if (!canWrite) return;
    setDoc((current) => {
      const heroSlides = (current.heroSlides || []).filter((_, i) => i !== index);
      return {...current, heroSlides};
    });
    setSlideIndex((current) => Math.max(0, Math.min(current, (slides.length || 1) - 2)));
  }

  function addFaq() {
    if (!canWrite) return;
    setDoc((current) => ({
      ...current,
      faqs: [
        ...(current.faqs || []),
        {
          id: `faq-${Date.now().toString(36)}`,
          questionEn: '',
          questionAr: '',
          answerEn: '',
          answerAr: '',
        },
      ],
    }));
  }

  function removeFaq(index) {
    setDoc((current) => ({
      ...current,
      faqs: (current.faqs || []).filter((_, i) => i !== index),
    }));
  }

  function addWhy() {
    setDoc((current) => ({
      ...current,
      whyPoints: [
        ...(current.whyPoints || []),
        {id: `why-${Date.now().toString(36)}`, titleEn: '', titleAr: '', bodyEn: '', bodyAr: ''},
      ],
    }));
  }

  function removeWhy(index) {
    setDoc((current) => ({
      ...current,
      whyPoints: (current.whyPoints || []).filter((_, i) => i !== index),
    }));
  }

  async function onSave() {
    if (!canWrite) return;
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({resource: 'homepage', document: doc}),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      setDoc(data.document || doc);
      setMessage('Saved');
      router.refresh();
    } catch (err) {
      setError(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="pcs">
      <nav className="pcs-pages" aria-label="Homepage editors">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={tab === item.id ? 'is-active' : ''}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <section className="pcs-editor">
        <div className="pcs-body">
          {tab === 'layout' ? (
            <div className="hps-list">
              <p className="adm-section-help" style={{margin: 0}}>
                Show or hide homepage blocks, then move them up or down. Visitors see the list from top to bottom.
              </p>
              {sections.map((section, index) => (
                <div key={section.id || index} className="hps-row">
                  <div>
                    <strong>{SECTION_LABELS[section.id] || section.id}</strong>
                    <small>{section.enabled === false ? 'Hidden on the website' : 'Visible on the website'}</small>
                  </div>
                  <label className="adm-switch">
                    <input
                      type="checkbox"
                      checked={section.enabled !== false}
                      disabled={!canWrite}
                      onChange={(e) => updateSection(index, {enabled: e.target.checked})}
                    />
                    <span className="adm-switch-track" aria-hidden />
                    <span>{section.enabled !== false ? 'On' : 'Off'}</span>
                  </label>
                  <div className="hps-move">
                    <button type="button" disabled={!canWrite || index === 0} onClick={() => moveSection(index, -1)}>
                      Up
                    </button>
                    <button
                      type="button"
                      disabled={!canWrite || index === sections.length - 1}
                      onClick={() => moveSection(index, 1)}
                    >
                      Down
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {tab === 'hero' ? (
            <>
              <div className="hps-slides">
                {slides.map((item, index) => (
                  <button
                    key={item.id || index}
                    type="button"
                    className={`hps-chip${slideIndex === index ? ' is-active' : ''}${item.enabled === false ? ' is-off' : ''}`}
                    onClick={() => setSlideIndex(index)}
                  >
                    Slide {index + 1}
                    {item.enabled === false ? ' · off' : ''}
                  </button>
                ))}
                {canWrite ? (
                  <button type="button" className="hps-chip" onClick={addSlide}>
                    + Add slide
                  </button>
                ) : null}
              </div>
              {slide ? (
                <>
                  <label className="adm-switch">
                    <input
                      type="checkbox"
                      checked={slide.enabled !== false}
                      disabled={!canWrite}
                      onChange={(e) => updateHeroSlide(slideIndex, {enabled: e.target.checked})}
                    />
                    <span className="adm-switch-track" aria-hidden />
                    <span>{slide.enabled !== false ? 'Active on website' : 'Hidden'}</span>
                  </label>
                  <MediaPicker
                    label="Slide image or video"
                    hint="Upload a photo or an MP4/WebM video for this slide."
                    value={slide.video || slide.image || ''}
                    canWrite={canWrite}
                    enableCrop={!slide.video && !isVideoUrl(slide.image)}
                    enableFocal={!slide.video && !isVideoUrl(slide.image)}
                    onChange={(url, item) => {
                      const video = item?.mime?.startsWith('video/') || isVideoUrl(url);
                      if (!url) {
                        updateHeroSlide(slideIndex, {image: '', video: ''});
                        return;
                      }
                      if (video) updateHeroSlide(slideIndex, {video: url});
                      else updateHeroSlide(slideIndex, {image: url, video: ''});
                    }}
                    focalValue={slide.crop || '50% 50%'}
                    onFocalChange={(crop) => updateHeroSlide(slideIndex, {crop})}
                  />
                  <Pair
                    en="Title"
                    ar="العنوان"
                    enValue={slide.title}
                    arValue={slide.titleAr}
                    onEn={(v) => updateHeroSlide(slideIndex, {title: v})}
                    onAr={(v) => updateHeroSlide(slideIndex, {titleAr: v})}
                    disabled={!canWrite}
                  />
                  <Pair
                    en="Note"
                    ar="الوصف"
                    multiline
                    enValue={slide.note}
                    arValue={slide.noteAr}
                    onEn={(v) => updateHeroSlide(slideIndex, {note: v})}
                    onAr={(v) => updateHeroSlide(slideIndex, {noteAr: v})}
                    disabled={!canWrite}
                  />
                  <Pair
                    en="Location"
                    ar="الموقع"
                    enValue={slide.location}
                    arValue={slide.locationAr}
                    onEn={(v) => updateHeroSlide(slideIndex, {location: v})}
                    onAr={(v) => updateHeroSlide(slideIndex, {locationAr: v})}
                    disabled={!canWrite}
                  />
                  <Pair
                    en="Strip label"
                    ar="شريط"
                    enValue={slide.strip}
                    arValue={slide.stripAr}
                    onEn={(v) => updateHeroSlide(slideIndex, {strip: v})}
                    onAr={(v) => updateHeroSlide(slideIndex, {stripAr: v})}
                    disabled={!canWrite}
                  />
                  {canWrite && slides.length > 1 ? (
                    <button type="button" className="adm-btn-danger" onClick={() => removeSlide(slideIndex)}>
                      Remove this slide
                    </button>
                  ) : null}
                </>
              ) : (
                <p className="adm-section-help">No hero slides yet. Add a slide to start.</p>
              )}
            </>
          ) : null}

          {tab === 'copy' ? (
            <div className="hps-list">
              <p className="adm-section-help" style={{margin: 0}}>
                Headings and buttons for homepage sections. Clients, services, team and testimonials content is edited in those admin pages; you can still hide those blocks under Page layout.
              </p>
              {COPY_FIELDS.map(([key, label]) => (
                <Pair
                  key={key}
                  en={label}
                  ar={`${label} (AR)`}
                  multiline={/copy|lede|desc/i.test(key)}
                  enValue={doc.copy?.en?.[key]}
                  arValue={doc.copy?.ar?.[key]}
                  onEn={(v) => updateCopy('en', key, v)}
                  onAr={(v) => updateCopy('ar', key, v)}
                  disabled={!canWrite}
                />
              ))}
            </div>
          ) : null}

          {tab === 'about' ? (
            <>
              <MediaPicker
                label="About image"
                value={doc.about?.image || ''}
                canWrite={canWrite}
                onChange={(url) => updateAbout({image: url})}
                focalValue={doc.about?.crop || '50% 50%'}
                onFocalChange={(crop) => updateAbout({crop})}
              />
              <Pair
                en="Title"
                ar="العنوان"
                enValue={doc.about?.titleEn}
                arValue={doc.about?.titleAr}
                onEn={(v) => updateAbout({titleEn: v})}
                onAr={(v) => updateAbout({titleAr: v})}
                disabled={!canWrite}
              />
              <Pair
                en="Body"
                ar="النص"
                multiline
                enValue={doc.about?.bodyEn}
                arValue={doc.about?.bodyAr}
                onEn={(v) => updateAbout({bodyEn: v})}
                onAr={(v) => updateAbout({bodyAr: v})}
                disabled={!canWrite}
              />
              <Pair
                en="Note"
                ar="ملاحظة"
                multiline
                enValue={doc.about?.noteEn}
                arValue={doc.about?.noteAr}
                onEn={(v) => updateAbout({noteEn: v})}
                onAr={(v) => updateAbout({noteAr: v})}
                disabled={!canWrite}
              />
            </>
          ) : null}

          {tab === 'sectors' ? (
            <div className="hps-list">
              {cards.map((card, index) => (
                <div key={card.key || index} className="pcs-body" style={{padding: 0, borderBottom: '1px solid #eef2f7'}}>
                  <strong>{card.title || card.key || `Card ${index + 1}`}</strong>
                  <MediaPicker
                    label="Card image"
                    value={card.image || ''}
                    canWrite={canWrite}
                    onChange={(url) => updateSectorCard(index, {image: url || ''})}
                    focalValue={card.crop || '50% 50%'}
                    onFocalChange={(crop) => updateSectorCard(index, {crop})}
                  />
                  <Pair
                    en="Title"
                    ar="العنوان"
                    enValue={card.title}
                    arValue={card.titleAr}
                    onEn={(v) => updateSectorCard(index, {title: v})}
                    onAr={(v) => updateSectorCard(index, {titleAr: v})}
                    disabled={!canWrite}
                  />
                  <Pair
                    en="Copy"
                    ar="الوصف"
                    multiline
                    enValue={card.copy}
                    arValue={card.copyAr}
                    onEn={(v) => updateSectorCard(index, {copy: v})}
                    onAr={(v) => updateSectorCard(index, {copyAr: v})}
                    disabled={!canWrite}
                  />
                </div>
              ))}
            </div>
          ) : null}

          {tab === 'why' ? (
            <div className="hps-list">
              {(doc.whyPoints || []).map((item, index) => (
                <div key={item.id || index} className="pcs-body" style={{padding: 0}}>
                  <strong>Point {index + 1}</strong>
                  <Pair
                    en="Title"
                    ar="العنوان"
                    enValue={item.titleEn}
                    arValue={item.titleAr}
                    onEn={(v) => updateWhy(index, {titleEn: v})}
                    onAr={(v) => updateWhy(index, {titleAr: v})}
                    disabled={!canWrite}
                  />
                  <Pair
                    en="Body"
                    ar="النص"
                    multiline
                    enValue={item.bodyEn}
                    arValue={item.bodyAr}
                    onEn={(v) => updateWhy(index, {bodyEn: v})}
                    onAr={(v) => updateWhy(index, {bodyAr: v})}
                    disabled={!canWrite}
                  />
                  {canWrite ? (
                    <button type="button" className="adm-btn-ghost" onClick={() => removeWhy(index)}>
                      Remove
                    </button>
                  ) : null}
                </div>
              ))}
              {canWrite ? (
                <button type="button" className="adm-btn" onClick={addWhy}>
                  Add point
                </button>
              ) : null}
            </div>
          ) : null}

          {tab === 'portfolio' ? (
            <div className="hps-list">
              <label className="pcs-field">
                <span>Featured project slug</span>
                <input
                  value={doc.portfolioFeaturedSlug || ''}
                  disabled={!canWrite}
                  onChange={(e) => setDoc((current) => ({...current, portfolioFeaturedSlug: e.target.value}))}
                />
              </label>
              <label className="pcs-field">
                <span>Grid project slugs (one per line)</span>
                <textarea
                  rows={5}
                  value={(doc.portfolioGridSlugs || []).join('\n')}
                  disabled={!canWrite}
                  onChange={(e) =>
                    setDoc((current) => ({
                      ...current,
                      portfolioGridSlugs: e.target.value
                        .split('\n')
                        .map((line) => line.trim())
                        .filter(Boolean),
                    }))
                  }
                />
              </label>
            </div>
          ) : null}

          {tab === 'faqs' ? (
            <div className="hps-list">
              {faqs.map((faq, index) => (
                <div key={faq.id || index} className="pcs-body" style={{padding: 0}}>
                  <strong>Question {index + 1}</strong>
                  <Pair
                    en="Question"
                    ar="السؤال"
                    enValue={faq.questionEn}
                    arValue={faq.questionAr}
                    onEn={(v) => updateFaq(index, {questionEn: v})}
                    onAr={(v) => updateFaq(index, {questionAr: v})}
                    disabled={!canWrite}
                  />
                  <Pair
                    en="Answer"
                    ar="الإجابة"
                    multiline
                    enValue={faq.answerEn}
                    arValue={faq.answerAr}
                    onEn={(v) => updateFaq(index, {answerEn: v})}
                    onAr={(v) => updateFaq(index, {answerAr: v})}
                    disabled={!canWrite}
                  />
                  {canWrite ? (
                    <button type="button" className="adm-btn-ghost" onClick={() => removeFaq(index)}>
                      Remove
                    </button>
                  ) : null}
                </div>
              ))}
              {canWrite ? (
                <button type="button" className="adm-btn" onClick={addFaq}>
                  Add question
                </button>
              ) : null}
            </div>
          ) : null}
        </div>

        <footer className="pcs-footer">
          <span>{error || message || (canWrite ? 'Changes apply to the public homepage after save.' : 'View only')}</span>
          <button type="button" onClick={onSave} disabled={!canWrite || saving}>
            {saving ? 'Saving…' : 'Save homepage'}
          </button>
        </footer>
      </section>
    </div>
  );
}
