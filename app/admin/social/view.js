import {adminText} from '@/lib/admin/translate';
import {requireAdminPage} from '@/lib/cms/guard';
import {hasPermission, PERMS} from '@/lib/cms/permissions';
import {getSocialConnections} from '@/lib/social/connections';
import {listSocialPosts} from '@/lib/social/store';
import AdminShell from '@/components/admin/AdminShell';
import SocialStudio from '@/components/admin/social/SocialStudio';

export const dynamic = 'force-dynamic';

export default async function AdminSocialPage() {
  const {user, navItems, session} = await requireAdminPage(PERMS.SOCIAL_READ);
  const [connections, posts] = await Promise.all([getSocialConnections(), listSocialPosts()]);
  const canWrite = hasPermission(session.role, PERMS.SOCIAL_WRITE);

  return (
    <AdminShell
      user={user}
      navItems={navItems}
      title={adminText('Social studio')}
      subtitle={adminText('Draft once. Publish only through linked official APIs.')}
    >
      <SocialStudio initialConnections={connections} initialPosts={posts} canWrite={canWrite} />
    </AdminShell>
  );
}
