import {createElement} from 'react';
import {notFound} from 'next/navigation';

export function matchStaticAndDynamic(params, {pathKey = 'path', staticLoaders = {}, dynamics = []} = {}) {
  const parts = params[pathKey] || [];
  const key = parts.join('/');
  if (staticLoaders[key]) return {load: staticLoaders[key]};
  for (const rule of dynamics) {
    const hit = rule(parts, params);
    if (hit) return hit;
  }
  return null;
}

export function createPageGateway(match) {
  async function resolve(props) {
    const params = await props.params;
    const hit = match(params);
    if (!hit) return null;
    const nextParams = hit.params ? {...params, ...hit.params} : params;
    return {
      load: hit.load,
      wrap: hit.wrap || null,
      props: {
        ...props,
        params: Promise.resolve(nextParams),
      },
    };
  }

  async function generateMetadata(props) {
    const hit = await resolve(props);
    if (!hit) return {};
    const mod = await hit.load();
    if (typeof mod.generateMetadata === 'function') {
      return mod.generateMetadata(hit.props);
    }
    return {};
  }

  async function Page(props) {
    const hit = await resolve(props);
    if (!hit) notFound();
    const mod = await hit.load();
    if (typeof mod.default !== 'function') notFound();
    const node = await mod.default(hit.props);
    if (hit.wrap === 'ops') {
      return createElement('div', {className: 'ops-workspace'}, node);
    }
    return node;
  }

  return {generateMetadata, Page};
}
