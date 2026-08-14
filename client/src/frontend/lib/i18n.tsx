import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Language = "vi" | "en";

const STORAGE_KEY = "zenova.lang";

export const LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
  { code: "en", label: "English", flag: "🇬🇧" },
];

/** Translation dictionary. Keys are dot-namespaced by area. */
const dictionaries = {
  vi: {
    "common.loading": "Đang tải...",
    "common.viewAll": "Xem tất cả",
    "common.loadMore": "Xem thêm",
    "common.retry": "Thử lại",
    "common.end": "Bạn đã xem hết",
    "common.empty": "Không có sản phẩm nào",
    "topbar.freeShipping": "Miễn phí vận chuyển cho đơn từ {amount}",
    "topbar.support": "Đổi trả 30 ngày · Hỗ trợ 24/7",
    "header.searchPlaceholder": "Tìm sản phẩm, thương hiệu...",
    "header.searchPlaceholderShort": "Tìm sản phẩm...",
    "header.searchLabel": "Tìm sản phẩm",
    "header.account": "Tài khoản",
    "header.myAccount": "Tài khoản của tôi",
    "header.signIn": "Đăng nhập",
    "header.signUp": "Đăng ký",
    "header.signOut": "Đăng xuất",
    "header.cart": "Giỏ hàng",
    "header.allProducts": "Tất cả sản phẩm",
    "header.openMenu": "Mở danh mục",
    "header.signedOut": "Đã đăng xuất",
    "theme.toggle": "Chế độ tối",
    "theme.light": "Sáng",
    "theme.dark": "Tối",
    "lang.toggle": "Ngôn ngữ",
  },
  en: {
    "common.loading": "Loading...",
    "common.viewAll": "View all",
    "common.loadMore": "Load more",
    "common.retry": "Try again",
    "common.end": "You've reached the end",
    "common.empty": "No products found",
    "topbar.freeShipping": "Free shipping on orders from {amount}",
    "topbar.support": "30-day returns · 24/7 support",
    "header.searchPlaceholder": "Search products, brands...",
    "header.searchPlaceholderShort": "Search products...",
    "header.searchLabel": "Search products",
    "header.account": "Account",
    "header.myAccount": "My account",
    "header.signIn": "Sign in",
    "header.signUp": "Sign up",
    "header.signOut": "Sign out",
    "header.cart": "Cart",
    "header.allProducts": "All products",
    "header.openMenu": "Open categories",
    "header.signedOut": "Signed out",
    "theme.toggle": "Dark mode",
    "theme.light": "Light",
    "theme.dark": "Dark",
    "lang.toggle": "Language",
  },
} as const;

export type TranslationKey = keyof (typeof dictionaries)["vi"];

type I18nContextValue = {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("vi");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "vi" || stored === "en") {
        setLangState(stored);
        document.documentElement.lang = stored;
      }
    } catch {
      /* ignore */
    }
  }, []);

  const setLang = useCallback((next: Language) => {
    setLangState(next);
    document.documentElement.lang = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<I18nContextValue>(() => {
    const table = dictionaries[lang];
    return {
      lang,
      setLang,
      toggleLang: () => setLang(lang === "vi" ? "en" : "vi"),
      t: (key, vars) => {
        let out: string = table[key] ?? dictionaries.vi[key] ?? key;
        if (vars) {
          for (const [k, v] of Object.entries(vars)) {
            out = out.replaceAll(`{${k}}`, String(v));
          }
        }
        return out;
      },
    };
  }, [lang, setLang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}
