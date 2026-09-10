import "./env";

export const SITE_NAME = "Letus TV";
export const SITE_TAGLINE = "Let's Watch. Let's Know. Let's Connect.";
export const DEFAULT_PER_PAGE = 12;
export const TRENDING_WINDOW_DAYS = 30;
export const VIEW_DEDUP_WINDOW_MS = 10 * 60 * 1000;
export const isProd = process.env.NODE_ENV === "production";
export const ADMIN_EMAIL = () => process.env.ADMIN_EMAIL ?? "admin@letustv.com";
export const ADMIN_PASSWORD = () => process.env.ADMIN_PASSWORD ?? "Changeme123!";
export const ADMIN_NAME = () => process.env.ADMIN_NAME ?? "Letus TV Admin";