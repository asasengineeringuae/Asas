import {NextResponse} from 'next/server';

export function createHttpGateway(resolvePath) {
  async function dispatch(method, request, context) {
    const parts = (await context.params).path || [];
    const matched = resolvePath(parts);
    if (!matched) {
      return NextResponse.json({error: 'Not found'}, {status: 404});
    }
    const mod = await matched.load();
    const handler = mod[method];
    if (typeof handler !== 'function') {
      return NextResponse.json({error: 'Method not allowed'}, {status: 405});
    }
    return handler(request, {params: Promise.resolve(matched.params || {})});
  }

  return {
    GET: (request, context) => dispatch('GET', request, context),
    POST: (request, context) => dispatch('POST', request, context),
    PUT: (request, context) => dispatch('PUT', request, context),
    PATCH: (request, context) => dispatch('PATCH', request, context),
    DELETE: (request, context) => dispatch('DELETE', request, context),
  };
}
