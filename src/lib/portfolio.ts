import {
  educationData,
  experienceData,
  profileData,
  projectsData,
  publicationsData,
  skillsData,
  trainingData,
  type ExperienceData,
  type ProjectData,
  type PublicationData,
} from "./data";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// "Mon, YYYY" -> months since year 0, so ranges are plain integer maths
export function parseMonth(value: string): number {
  const [mon, year] = value.split(",").map((s) => s.trim());
  const m = MONTHS.indexOf(mon);
  if (m < 0 || !/^\d{4}$/.test(year)) throw new Error(`Bad date "${value}", expected "Mon, YYYY"`);
  return Number(year) * 12 + m;
}

export const formatMonth = (index: number) => `${MONTHS[index % 12]} ${Math.floor(index / 12)}`;
export const monthIndexOf = (d: Date) => d.getFullYear() * 12 + d.getMonth();

if (experienceData.filter((e) => e.current).length > 1) {
  throw new Error("Only one experience entry can be current");
}

// Current roles run until "now". The build pins this at deploy time; ticking
// client widgets recompute with useNow() so the numbers stay fresh.
const BUILD_MONTH = monthIndexOf(new Date());

export const monthsLabel = (n: number) => {
  const y = Math.floor(n / 12);
  const m = n % 12;
  const parts = [y ? `${y} yr${y > 1 ? "s" : ""}` : "", m ? `${m} mo${m > 1 ? "s" : ""}` : ""];
  return parts.filter(Boolean).join(" ") || "1 mo";
};

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export type Role = ExperienceData & {
  id: string;
  startIndex: number;
  endIndex: number | null; // inclusive; null = ongoing
  startLabel: string; // "Aug 2026"
};

export const roles: Role[] = experienceData.map((e) => ({
  ...e,
  id: slug(`${e.company}-${e.role}`),
  startIndex: parseMonth(e.start),
  endIndex: e.current || !e.end ? null : parseMonth(e.end),
  startLabel: formatMonth(parseMonth(e.start)),
}));

export const roleEnd = (r: Role, nowMonth: number) => r.endIndex ?? nowMonth;
export const roleMonths = (r: Role, nowMonth: number) => roleEnd(r, nowMonth) - r.startIndex + 1;
export const rolePeriod = (r: Role) =>
  `${r.startLabel} – ${r.endIndex === null ? "Present" : formatMonth(r.endIndex)}`;

export const currentRole = roles.find((r) => r.current) ?? null;

// Overlapping months (e.g. a promotion month) count once.
export function experienceStats(nowMonth: number = BUILD_MONTH) {
  const covered = new Set<number>();
  const byCompany = new Map<string, number>();
  for (const r of roles) {
    const company = new Set<number>();
    for (let m = r.startIndex; m <= roleEnd(r, nowMonth); m++) {
      covered.add(m);
      company.add(m);
    }
    byCompany.set(r.company, (byCompany.get(r.company) ?? 0) + company.size);
  }
  return {
    months: covered.size,
    label: monthsLabel(covered.size),
    companies: [...byCompany].map(([name, months]) => ({ name, months })),
  };
}

export const companyCount = new Set(roles.map((r) => r.company)).size;

const buildStats = experienceStats();

export const profile = {
  ...profileData,
  firstName: profileData.name.split(" ")[0],
  initials: profileData.name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2),
  bio:
    profileData.bio ??
    [
      currentRole
        ? `${currentRole.role} at ${currentRole.company}, working with ${currentRole.tech.join(" and ")}.`
        : "",
      `${educationData[0].degree} from ${educationData[0].institution} (${educationData[0].grade}), with ${buildStats.label} of experience across ${companyCount} organisations.`,
      publicationsData.length
        ? `Co-author of ${publicationsData.length === 1 ? "a research paper" : `${publicationsData.length} research papers`} with ${publicationsData[0].publisher}.`
        : "",
    ]
      .filter(Boolean)
      .join(" "),
};

export const education = educationData;
export const trainings = trainingData;
export const skills = skillsData;
export const allSkills = [...new Set(skillsData.flatMap((g) => g.items))];

export type Publication = PublicationData & { doiUrl: string | null };
export const publications: Publication[] = publicationsData.map((p) => ({
  ...p,
  doiUrl: p.doi ? `https://doi.org/${p.doi}` : null,
}));

export type Project = ProjectData & { paper: Publication | null };
export const projects: Project[] = projectsData.map((p) => ({
  ...p,
  paper: publications.find((x) => x.slug === p.publication) ?? null,
}));

export type ExternalLink = { id: "email" | "linkedin" | "resume"; label: string; href: string };

// Only links that exist; null entries in data.ts simply drop out of the UI.
export const externalLinks: ExternalLink[] = (
  [
    { id: "email", label: "Email", href: `mailto:${profileData.email}` },
    { id: "linkedin", label: "LinkedIn", href: profileData.linkedin },
    { id: "resume", label: "Résumé", href: profileData.resume },
  ] as const
).flatMap((l) => (l.href ? [{ ...l, href: l.href }] : []));

export const linkFor = (id: ExternalLink["id"]) => externalLinks.find((l) => l.id === id) ?? null;
