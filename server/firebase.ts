import { initializeApp, applicationDefault, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

export function ensureFirebase() {
  if (getApps().length === 0) {
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
      const json = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
      initializeApp({ credential: cert(json) });
    } else {
      initializeApp({ credential: applicationDefault() });
    }
  }
  return getFirestore();
}


