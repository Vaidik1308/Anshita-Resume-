import { profile } from "./portfolio";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
export const SITE_TITLE = `${profile.name} — ${profile.role}`;
export const SITE_DESCRIPTION = profile.bio;
