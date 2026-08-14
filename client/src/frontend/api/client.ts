// FE — axios instance dùng chung cho mọi lời gọi tới BE.
import axios, { AxiosError } from "axios";
import { getFirebaseAuth } from "@/frontend/lib/firebase";
import type { ApiError } from "@/shared/types";

function resolveBaseUrl() {
  const configured = import.meta.env['VITE_API_BASE_URL'] as string | undefined;
  if (configured) return configured;
  // Cùng origin: BE là các route /api/* của chính app này.
  return typeof window === "undefined" ? "http://localhost:8080" : window.location.origin;
}

export const api = axios.create({
  baseURL: resolveBaseUrl(),
  timeout: 15_000,
  headers: { "Content-Type": "application/json" },
});

export function getSessionToken(): string {
  if (typeof window === "undefined") return "";
  let token = window.localStorage.getItem("zenova.sessionToken");
  if (!token) {
    token = `st_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    window.localStorage.setItem("zenova.sessionToken", token);
  }
  return token;
}

// Request interceptor: gắn ID token của Firebase khi người dùng đã đăng nhập và sessionToken cho giỏ hàng.
api.interceptors.request.use(async (config) => {
  if (typeof window !== "undefined") {
    const sessionToken = getSessionToken();
    if (sessionToken) {
      config.headers["x-session-token"] = sessionToken;
    }

    const user = getFirebaseAuth()?.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor: chuẩn hoá lỗi về ApiError.
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    const normalized: ApiError = {
      message:
        error.response?.data?.message ?? error.message ?? "Có lỗi xảy ra, vui lòng thử lại.",
      details: error.response?.data?.details,
    };
    return Promise.reject(normalized);
  },
);

export function getApiErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "message" in error) {
    return String((error as ApiError).message);
  }
  return "Có lỗi xảy ra, vui lòng thử lại.";
}
