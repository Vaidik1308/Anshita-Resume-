import { BookOpenText, BriefcaseBusiness, Cpu, Mail, Trophy, UserRound, type LucideIcon } from "lucide-react";

export type AppId = "about" | "experience" | "projects" | "research" | "skills" | "contact";

export type AppMeta = {
  id: AppId;
  title: string;
  icon: LucideIcon; // Android glyph; Windows draws windows/FluentIcons
  tone: "primary" | "secondary" | "tertiary"; // Material container role on Android
  size: { w: number; h: number }; // default desktop window size
};

export const APPS: AppMeta[] = [
  { id: "about", title: "About", icon: UserRound, tone: "primary", size: { w: 760, h: 560 } },
  { id: "experience", title: "Experience", icon: BriefcaseBusiness, tone: "tertiary", size: { w: 900, h: 600 } },
  { id: "projects", title: "Highlights", icon: Trophy, tone: "secondary", size: { w: 980, h: 640 } },
  { id: "research", title: "Research", icon: BookOpenText, tone: "primary", size: { w: 820, h: 620 } },
  { id: "skills", title: "Skills", icon: Cpu, tone: "tertiary", size: { w: 760, h: 560 } },
  { id: "contact", title: "Contact", icon: Mail, tone: "secondary", size: { w: 620, h: 520 } },
];

export const appById = (id: AppId) => APPS.find((a) => a.id === id)!;
