import type { ComponentType } from "react";
import type { AppId } from "../registry";
import About from "./About";
import Contact from "./Contact";
import Experience from "./Experience";
import Projects from "./Projects";
import Research from "./Research";
import Skills from "./Skills";

// Every app takes an optional deep-link `arg` (role id, project slug, paper slug).
export const APP_COMPONENTS: Record<AppId, ComponentType<{ arg?: string }>> = {
  about: About,
  experience: Experience,
  projects: Projects,
  research: Research,
  skills: Skills,
  contact: Contact,
};
