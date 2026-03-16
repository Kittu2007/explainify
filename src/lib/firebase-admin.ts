import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (projectId && clientEmail && privateKey) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, '\n'),
      }),
    });
  } else {
    console.warn("Firebase Admin credentials missing. Admin SDK not initialized.");
  }
}

// Provide a safe 'auth' object for the build phase
export const auth = {
  createSessionCookie: async (...args: any[]) => {
    if (admin.apps.length > 0) return admin.auth().createSessionCookie(args[0], args[1]);
    throw new Error("Firebase Admin not initialized");
  },
  verifySessionCookie: async (...args: any[]) => {
    if (admin.apps.length > 0) return admin.auth().verifySessionCookie(args[0]);
    throw new Error("Firebase Admin not initialized");
  }
} as any;
