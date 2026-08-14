// FE — context xác thực dựa trên Firebase Auth.
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as fbSignOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getFirebaseAuth, googleProvider, isFirebaseConfigured } from "@/frontend/lib/firebase";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  configured: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (fullName: string, email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function requireAuth() {
  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error(
      "Firebase chưa được cấu hình. Hãy thêm các biến VITE_FIREBASE_* vào file .env rồi tải lại trang.",
    );
  }
  return auth;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(isFirebaseConfigured);

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, (next) => {
      setUser(next);
      setLoading(false);
    });
    return unsub;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      configured: isFirebaseConfigured,
      signIn: async (email, password) => {
        await signInWithEmailAndPassword(requireAuth(), email, password);
      },
      signUp: async (fullName, email, password) => {
        const cred = await createUserWithEmailAndPassword(requireAuth(), email, password);
        if (fullName) await updateProfile(cred.user, { displayName: fullName });
        setUser({ ...cred.user, displayName: fullName } as User);
      },
      signInWithGoogle: async () => {
        await signInWithPopup(requireAuth(), googleProvider());
      },
      resetPassword: async (email) => {
        await sendPasswordResetEmail(requireAuth(), email, {
          url: `${window.location.origin}/dang-nhap`,
        });
      },
      signOut: async () => {
        const auth = getFirebaseAuth();
        if (auth) await fbSignOut(auth);
      },
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth phải dùng bên trong AuthProvider");
  return ctx;
}

export function firebaseErrorMessage(error: unknown) {
  const code = (error as { code?: string })?.code ?? "";
  switch (code) {
    case "auth/invalid-email":
      return "Email không hợp lệ.";
    case "auth/email-already-in-use":
      return "Email này đã được đăng ký.";
    case "auth/weak-password":
      return "Mật khẩu quá yếu (tối thiểu 6 ký tự).";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Email hoặc mật khẩu không đúng.";
    case "auth/too-many-requests":
      return "Bạn thử quá nhiều lần. Vui lòng đợi một chút.";
    case "auth/popup-closed-by-user":
      return "Cửa sổ đăng nhập Google đã bị đóng.";
    case "auth/operation-not-allowed":
      return "Phương thức đăng nhập này chưa được bật trong Firebase Console.";
    default:
      return error instanceof Error ? error.message : "Có lỗi xảy ra, vui lòng thử lại.";
  }
}
