import { profile } from "@/lib/portfolio";
import OpengraphImage from "./opengraph-image";

// Route config must be declared here, not re-exported
export const alt = `${profile.name} — ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default OpengraphImage;
