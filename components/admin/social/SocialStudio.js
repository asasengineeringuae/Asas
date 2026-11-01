'use client';

import {useMemo, useState} from 'react';
import {adminText} from '@/lib/admin/translate';
import MediaPicker from '@/components/admin/media/MediaPicker';
import {SOCIAL_PLATFORMS} from '@/lib/social/platforms';

const EMPTY = {
  id: '',
  caption: '',
  captionAr: '',
  link: '',
  mediaUrl: '',
  platforms: ['facebook', 'instagram', 'linkedin', 'x'],
};

export default function SocialStudio({initialConnections = [], initialPosts = [], canWrite = false}) {
  const [connections, setConnections] = useState(initialConnections);
  const [posts, setPosts] = useState(initialPosts);
  const [draft, setDraft] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const connectedCount = connections.filter((item) => item.connected).length;

  const platformState = useMemo(() => {
    const map = new Map(connections.map((item) => [item.id, item]));
    return SOCIAL_PLATFORMS.map((platform) => map.get(platform.id) || {id: platform.id, connected: false});
  }, [connections]);

  function togglePlatform(id) {
    setDraft((current) => {
      const has = current.platforms.includes(id);
      return {
        ...current,
        platforms: has ? current.platforms.filter((item) => item !== id) : [...current.platforms, id],
      };
    });
  }

  async function submit(action) {
    if (!canWrite) return;
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const res = await fetch('/api/admin/social', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({action, post: draft.id ? draft : {...draft, id: undefined}}),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');
      if (data.connections) setConnections(data.connections);
      if (data.post) {
        setPosts((current) => {
          const next = current.filter((item) => item.id !== data.post.id);
          return [data.post, ...next];
        });
        setDraft({...EMPTY, ...data.post});
      }
      setMessage(
        action === 'publish'
          ? data.post?.status === 'waiting_for_api'
            ? 'Saved. Publishing waits until the APIs are linked.'
            : 'Publish attempted.'
          : 'Draft saved.',
      );
    } catch (err) {
      setError(err.message || 'Failed');
    } finally {
      setSaving(false);
    }
  }

  async function remove(id) {
    if (!canWrite) return;
    const res = await fetch('/api/admin/social', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({action: 'delete', id}),
    });
    if (res.ok) {
      setPosts((current) => current.filter((item) => item.id !== id));
      if (draft.id === id) setDraft(EMPTY);
    }
  }

  return (
    <div className="soc-studio">
      <section className="soc-banner">
        <strong>{adminText('One post, every connected network')}</strong>
        <p>
          {adminText(
            'Compose here. Facebook, Instagram, LinkedIn and X only go live after their official APIs are linked in environment variables. Until then every publish stays queued as waiting for API.',
          )}
        </p>
        <p className="ecs-help">
          {connectedCount
            ? adminText(`${connectedCount} network(s) linked.`)
            : adminText('No APIs linked yet — drafts are saved, nothing is posted.')}
        </p>
      </section>

      <div className="soc-grid">
        {platformState.map((item) => (
          <article key={item.id} className={`soc-card${item.connected ? ' is-on' : ''}`}>
            <h3>{adminText(item.label || item.id)}</h3>
            <p className={`cms-badge cms-badge--${item.connected ? 'published' : 'draft'}`}>
              {adminText(item.connected ? 'API linked' : 'Waiting for API')}
            </p>
            {!item.connected ? (
              <p className="ecs-help">
                {adminText('Set')}: {(item.env || []).join(', ')}
              </p>
            ) : null}
          </article>
        ))}
      </div>

      <section className="soc-composer">
        <h2>{adminText(draft.id ? 'Edit post' : 'New post')}</h2>
        {error ? <p className="adm-error">{adminText(error)}</p> : null}
        {message ? <p className="adm-success">{adminText(message)}</p> : null}
        <div className="adm-field">
          <label>{adminText('Caption (EN)')}</label>
          <textarea
            rows={4}
            value={draft.caption}
            disabled={!canWrite}
            onChange={(e) => setDraft((current) => ({...current, caption: e.target.value}))}
          />
        </div>
        <div className="adm-field">
          <label>{adminText('Caption (AR)')}</label>
          <textarea
            rows={3}
            dir="rtl"
            value={draft.captionAr}
            disabled={!canWrite}
            onChange={(e) => setDraft((current) => ({...current, captionAr: e.target.value}))}
          />
        </div>
        <div className="adm-field">
          <label>{adminText('Link')}</label>
          <input
            dir="ltr"
            value={draft.link}
            disabled={!canWrite}
            onChange={(e) => setDraft((current) => ({...current, link: e.target.value}))}
            placeholder="https://"
          />
        </div>
        <MediaPicker
          label={adminText('Image')}
          value={draft.mediaUrl}
          canWrite={canWrite}
          onChange={(url) => setDraft((current) => ({...current, mediaUrl: url || ''}))}
        />
        <fieldset className="soc-platforms">
          <legend>{adminText('Publish to')}</legend>
          {platformState.map((item) => (
            <label key={item.id}>
              <input
                type="checkbox"
                checked={draft.platforms.includes(item.id)}
                disabled={!canWrite}
                onChange={() => togglePlatform(item.id)}
              />
              {adminText(item.label || item.id)}
              <em>{adminText(item.connected ? 'ready' : 'waiting')}</em>
            </label>
          ))}
        </fieldset>
        <div className="ecs-inline">
          <button type="button" className="adm-btn-ghost" disabled={!canWrite || saving} onClick={() => submit('save')}>
            {adminText(saving ? 'Saving…' : 'Save draft')}
          </button>
          <button type="button" className="adm-btn" disabled={!canWrite || saving} onClick={() => submit('publish')}>
            {adminText('Publish to linked APIs')}
          </button>
          <button type="button" className="adm-btn-ghost" disabled={!canWrite} onClick={() => setDraft(EMPTY)}>
            {adminText('Clear')}
          </button>
        </div>
      </section>

      <section>
        <h2>{adminText('Queue')}</h2>
        {!posts.length ? <p className="ecs-help">{adminText('No social posts yet.')}</p> : null}
        <ul className="soc-queue">
          {posts.map((post) => (
            <li key={post.id}>
              <div>
                <strong>{post.caption || post.captionAr || adminText('Untitled')}</strong>
                <p>
                  {adminText(post.status)} · {(post.platforms || []).join(', ')}
                </p>
              </div>
              <div className="ecs-inline">
                <button type="button" className="adm-btn-ghost" onClick={() => setDraft(post)}>
                  {adminText('Open')}
                </button>
                <button type="button" className="adm-btn-danger" disabled={!canWrite} onClick={() => remove(post.id)}>
                  {adminText('Delete')}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <style jsx>{`
        .soc-studio { display: grid; gap: 18px; }
        .soc-banner { padding: 14px 16px; border-radius: 14px; background: #fff; border: 1px solid rgba(7,4,99,.08); }
        .soc-banner p { margin: 6px 0 0; color: #5b6472; }
        .soc-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 10px; }
        .soc-card { padding: 12px; border-radius: 12px; background: #fff; border: 1px solid rgba(7,4,99,.08); }
        .soc-card.is-on { border-color: rgba(16, 185, 129, .45); }
        .soc-card h3 { margin: 0 0 8px; font-size: 14px; }
        .soc-composer, .soc-queue li { padding: 16px; border-radius: 14px; background: #fff; border: 1px solid rgba(7,4,99,.08); }
        .soc-platforms { display: grid; gap: 8px; border: 0; padding: 0; margin: 12px 0; }
        .soc-platforms label { display: flex; gap: 8px; align-items: center; font-size: 13px; }
        .soc-platforms em { color: #6b7280; font-style: normal; margin-inline-start: auto; font-size: 12px; }
        .soc-queue { list-style: none; padding: 0; margin: 0; display: grid; gap: 8px; }
        .soc-queue li { display: flex; justify-content: space-between; gap: 12px; align-items: center; }
        .soc-queue p { margin: 4px 0 0; color: #6b7280; font-size: 12px; }
      `}</style>
    </div>
  );
}
