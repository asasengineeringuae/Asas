import {NextResponse} from 'next/server';
import {requireAdmin} from '@/lib/cms/auth';
import {writeAudit} from '@/lib/cms/audit';
import {hasPermission, PERMS} from '@/lib/cms/permissions';
import {getSocialConnections} from '@/lib/social/connections';
import {deleteSocialPost, listSocialPosts, saveSocialPost} from '@/lib/social/store';
import {publishSocialPost} from '@/lib/social/publisher';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await requireAdmin(PERMS.SOCIAL_READ);
    const [connections, posts] = await Promise.all([getSocialConnections(), listSocialPosts()]);
    return NextResponse.json({connections, posts});
  } catch (error) {
    return NextResponse.json({error: error.message || 'Unauthorized'}, {status: error.status || 401});
  }
}

export async function POST(request) {
  try {
    const session = await requireAdmin(PERMS.SOCIAL_WRITE);
    const body = await request.json();
    const action = String(body.action || 'save');

    if (action === 'delete') {
      await deleteSocialPost(body.id);
      return NextResponse.json({ok: true});
    }

    let post = await saveSocialPost(body.post || {});
    if (action === 'publish') {
      post = await publishSocialPost(post);
      post = await saveSocialPost(post);
    }

    await writeAudit({
      actorId: session.user?.id,
      actorEmail: session.user?.email,
      action: `social.${action}`,
      entity: 'social_post',
      entityId: post.id,
      meta: {status: post.status, platforms: post.platforms},
    });

    return NextResponse.json({post, connections: getSocialConnections()});
  } catch (error) {
    return NextResponse.json({error: error.message || 'Save failed'}, {status: error.status || 500});
  }
}

export async function DELETE(request) {
  try {
    const session = await requireAdmin();
    if (!hasPermission(session.role, PERMS.SOCIAL_WRITE)) {
      return NextResponse.json({error: 'Forbidden'}, {status: 403});
    }
    const id = new URL(request.url).searchParams.get('id');
    await deleteSocialPost(id);
    return NextResponse.json({ok: true});
  } catch (error) {
    return NextResponse.json({error: error.message || 'Delete failed'}, {status: error.status || 500});
  }
}
