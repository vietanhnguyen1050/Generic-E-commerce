// FE — khởi tạo Firebase (chỉ chạy phía trình duyệt).
// Điền các biến VITE_FIREBASE_* trong file .env (xem .env.example).
import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";

export const firebaseConfig = {
  apiKey: import.meta.env['VITE_FIREBASE_API_KEY'] as string | undefined,
  authDomain: import.meta.env['VITE_FIREBASE_AUTH_DOMAIN'] as string | undefined,
  projectId: import.meta.env['VITE_FIREBASE_PROJECT_ID'] as string | undefined,
  storageBucket: import.meta.env['VITE_FIREBASE_STORAGE_BUCKET'] as string | undefined,
  messagingSenderId: import.meta.env['VITE_FIREBASE_MESSAGING_SENDER_ID'] as string | undefined,
  appId: import.meta.env['VITE_FIREBASE_APP_ID'] as string | undefined,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId,
);

let cachedApp: FirebaseApp | null = null;

export function getFirebaseApp(): FirebaseApp | null {
  if (typeof window === "undefined" || !isFirebaseConfigured) return null;
  if (!cachedApp) {
    cachedApp =
      getApps()[0] ??
      initializeApp({
        apiKey: firebaseConfig.apiKey!,
        authDomain: firebaseConfig.authDomain!,
        projectId: firebaseConfig.projectId!,
        storageBucket: firebaseConfig.storageBucket ?? "",
        messagingSenderId: firebaseConfig.messagingSenderId ?? "",
        appId: firebaseConfig.appId!,
      });
  }
  return cachedApp;
}

export function getFirebaseAuth(): Auth | null {
  const app = getFirebaseApp();
  return app ? getAuth(app) : null;
}

export function googleProvider() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  return provider;
}
