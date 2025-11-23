
import { adminAuth } from './firebase-admin';

export async function verifyBearer(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const idToken = authHeader.split(' ')[1];
  try {
    const decoded = await adminAuth.verifyIdToken(idToken);
    return decoded as any; // contains uid, orgId, roles
  } catch {
    return null;
  }
}
