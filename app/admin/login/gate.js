import {redirect} from 'next/navigation';
import {getAdminSession} from '@/lib/cms/auth';
import {homePathForRole} from '@/lib/cms/permissions';
import LoginPage from './view.js';

export default async function LoginGate(props) {
  const session = await getAdminSession();
  if (session) redirect(homePathForRole(session.role));
  return <LoginPage {...props} />;
}
