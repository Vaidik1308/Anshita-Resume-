import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { profile, skills } from "@/lib/portfolio";

export const alt = `${profile.name} — ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Domain groups make better headline tags than "Professional Skills"
const tags = skills.filter((g) => g.group !== "Professional Skills").slice(0, 3);

const photo = `data:image/jpeg;base64,${await readFile(join(process.cwd(), "public", profile.photo), "base64")}`;

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 64,
          padding: "0 96px",
          color: "white",
          background: "radial-gradient(circle at 75% 60%, #3f9f90 0%, #1d4f4a 40%, #0a1a1c 78%)",
        }}
      >
        <img src={photo} width={300} height={300} alt="" style={{ borderRadius: 300, border: "6px solid rgba(255,255,255,0.25)" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 680 }}>
          <div style={{ fontSize: 76, fontWeight: 700, letterSpacing: -2 }}>{profile.name}</div>
          <div style={{ fontSize: 36, opacity: 0.85 }}>{profile.role}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 16 }}>
            {tags.map((g) => (
              <div key={g.group} style={{ fontSize: 22, padding: "8px 18px", borderRadius: 999, background: "rgba(255,255,255,0.14)" }}>
                {g.group}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size
  );
}
