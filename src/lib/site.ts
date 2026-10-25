import { profile } from "./portfolio";

// NEXT_PUBLIC_SITE_URL wins if set; otherwise Vercel's production domain (it picks the custom domain when there is one).
const vercelDomain = process.env.VERCEL_PROJECT_PRODUCTION_URL;
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? (vercelDomain ? `https://${vercelDomain}` : "http://localhost:3000")
).replace(/\/$/, "");

// Search-facing copy. Titles stay under ~60 characters and descriptions under ~160 so results aren't truncated.
export const SITE_TITLE = `${profile.name} | MHA, Hospital Operations & Healthcare Management`;
export const SITE_DESCRIPTION =
  "Anshita Deo, MHA candidate at Siksha 'O' Anusandhan, Bhubaneswar. Hospital operations, pharmacy supply chain and patient engagement; Apollo Safe-A-Thon winner.";

export const SITE_KEYWORDS = [
  profile.name,
  "Anshita",
  "Anshita Deo MHA",
  "Hospital Administration",
  "MHA",
  "Hospital Operations",
  "Healthcare Management",
  "Healthcare Consulting",
  "Pharmacy Supply Chain",
  "Patient Engagement",
  "Aster RV Hospital",
  "ICMR",
  "Siksha 'O' Anusandhan",
  "Biomedical Science",
  "Bhubaneswar",
  "Portfolio",
];

// Shown on the Person entry in JSON-LD
export const SITE_AWARDS = ["1st Place, Apollo Hospital Hyderabad Safe-A-Thon Regional Prelims (2025)"];
