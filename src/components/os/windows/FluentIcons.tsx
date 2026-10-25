import { createElement, useId, type ReactNode } from "react";
import type { AppId } from "../registry";

// Original Fluent-style app glyphs: colourful, slightly dimensional, no tile behind them.
type G = { id: string };

function About({ id }: G) {
  return (
    <>
      <defs>
        <linearGradient id={`${id}a`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4FB3FF" />
          <stop offset="1" stopColor="#1366D6" />
        </linearGradient>
        <linearGradient id={`${id}b`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#D5E8FF" />
        </linearGradient>
      </defs>
      <rect x="4" y="9" width="40" height="30" rx="5" fill={`url(#${id}a)`} />
      <rect x="4" y="9" width="40" height="30" rx="5" fill="none" stroke="#0B4FA8" strokeOpacity=".35" />
      <circle cx="17" cy="21" r="5" fill={`url(#${id}b)`} />
      <path d="M8.5 34c0-4.7 3.8-7.5 8.5-7.5s8.5 2.8 8.5 7.5z" fill={`url(#${id}b)`} />
      <rect x="28" y="18" width="11" height="2.6" rx="1.3" fill="#fff" opacity=".9" />
      <rect x="28" y="24" width="9" height="2.6" rx="1.3" fill="#fff" opacity=".65" />
      <rect x="28" y="30" width="7" height="2.6" rx="1.3" fill="#fff" opacity=".45" />
    </>
  );
}

function Experience({ id }: G) {
  return (
    <>
      <defs>
        <linearGradient id={`${id}a`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E6A15C" />
          <stop offset="1" stopColor="#B4642A" />
        </linearGradient>
        <linearGradient id={`${id}b`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F4C48D" />
          <stop offset="1" stopColor="#D88A45" />
        </linearGradient>
      </defs>
      <path d="M17 13v-3a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v3" fill="none" stroke="#7A4419" strokeWidth="3" />
      <rect x="4" y="13" width="40" height="28" rx="5" fill={`url(#${id}a)`} />
      <path d="M4 18a5 5 0 0 1 5-5h30a5 5 0 0 1 5 5v6c-6 3-13 4.5-20 4.5S10 27 4 24z" fill={`url(#${id}b)`} />
      <rect x="20.5" y="24.5" width="7" height="6" rx="1.5" fill="#FFE2BD" stroke="#7A4419" strokeOpacity=".5" />
    </>
  );
}

function Projects({ id }: G) {
  return (
    <>
      <defs>
        <linearGradient id={`${id}a`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F2A93B" />
          <stop offset="1" stopColor="#D9861A" />
        </linearGradient>
        <linearGradient id={`${id}b`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFDA6B" />
          <stop offset="1" stopColor="#FFB82E" />
        </linearGradient>
      </defs>
      {/* Trophy: the app is "Highlights" in this portfolio */}
      <path d="M13 9h-5a2 2 0 0 0-2 2c0 5.5 3.6 9.5 9 10M35 9h5a2 2 0 0 1 2 2c0 5.5-3.6 9.5-9 10" fill="none" stroke="#D9861A" strokeWidth="3" />
      <path d="M12 5h24v12a12 12 0 0 1-24 0z" fill={`url(#${id}b)`} />
      <path d="M12 5h24v4H12z" fill="#FFF3C4" opacity=".55" />
      <rect x="21" y="28" width="6" height="7" fill={`url(#${id}a)`} />
      <rect x="14" y="35" width="20" height="8" rx="2" fill={`url(#${id}a)`} />
    </>
  );
}

function Research({ id }: G) {
  return (
    <>
      <defs>
        <linearGradient id={`${id}a`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#E3E8F2" />
        </linearGradient>
        <linearGradient id={`${id}b`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#B58CFF" />
          <stop offset="1" stopColor="#6E3BD9" />
        </linearGradient>
      </defs>
      <path d="M10 4h19l11 11v26a3 3 0 0 1-3 3H10a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3z" fill={`url(#${id}a)`} stroke="#8A94A8" strokeOpacity=".45" />
      <path d="M29 4v8a3 3 0 0 0 3 3h8z" fill="#C9D2E3" />
      <rect x="13" y="20" width="18" height="2.4" rx="1.2" fill="#8A94A8" />
      <rect x="13" y="25.5" width="14" height="2.4" rx="1.2" fill="#B3BBCB" />
      <circle cx="33" cy="35" r="7" fill={`url(#${id}b)`} />
      <path d="M29.8 35.2l2.2 2.2 4.2-4.6" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </>
  );
}

function Skills({ id }: G) {
  const teeth = Array.from({ length: 8 }, (_, i) => i * 45);
  return (
    <>
      <defs>
        <linearGradient id={`${id}a`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8A9BB2" />
          <stop offset="1" stopColor="#4A586D" />
        </linearGradient>
        <linearGradient id={`${id}b`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5AD4FF" />
          <stop offset="1" stopColor="#1A7BE0" />
        </linearGradient>
      </defs>
      <g transform="translate(24 24)">
        {teeth.map((d) => (
          <rect key={d} x="-4" y="-21" width="8" height="10" rx="2" fill={`url(#${id}a)`} transform={`rotate(${d})`} />
        ))}
        <circle r="15" fill={`url(#${id}a)`} />
        <circle r="8" fill={`url(#${id}b)`} />
        <circle r="8" fill="none" stroke="#fff" strokeOpacity=".5" />
      </g>
    </>
  );
}

function Contact({ id }: G) {
  return (
    <>
      <defs>
        <linearGradient id={`${id}a`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3FA9F5" />
          <stop offset="1" stopColor="#0F62C2" />
        </linearGradient>
        <linearGradient id={`${id}b`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#B9E2FF" />
          <stop offset="1" stopColor="#6CBCF7" />
        </linearGradient>
      </defs>
      <rect x="4" y="10" width="40" height="29" rx="5" fill={`url(#${id}a)`} />
      <path d="M6 13.5l16.2 12.2a3 3 0 0 0 3.6 0L42 13.5" fill="none" stroke={`url(#${id}b)`} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </>
  );
}

const GLYPHS: Record<AppId, (p: G) => ReactNode> = {
  about: About,
  experience: Experience,
  projects: Projects,
  research: Research,
  skills: Skills,
  contact: Contact,
};

export function FluentIcon({ id, className }: { id: AppId; className?: string }) {
  const uid = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden style={{ filter: "drop-shadow(0 1px 1.5px rgb(0 0 0 / 0.28))" }}>
      {createElement(GLYPHS[id], { id: uid })}
    </svg>
  );
}
