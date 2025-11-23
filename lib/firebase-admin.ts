
import { getApps, initializeApp, cert, App } from 'firebase-admin/app';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';
import { getStorage as getAdminStorage } from 'firebase-admin/storage';

let app: App;
if (!getApps().length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT as string);
  app = initializeApp({
    credential: cert(serviceAccount),
    storageBucket: process.env.NEXT_PUBLIC_FB_STORAGE_BUCKET,
  });
} else {
  app = getApps()[0]!;
}

export const adminAuth = getAdminAuth(app);
export const adminDb = getAdminFirestore(app);
export const adminStorage = getAdminStorage(app);
