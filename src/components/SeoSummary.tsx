import { currentRole, education, externalLinks, profile, projects, publications, rolePeriod, roles, skills } from "@/lib/portfolio";

// Server-rendered, visually hidden summary so crawlers and screen readers get
// the content even though the OS interface renders on the client.
export function SeoSummary() {
  return (
    <div className="sr-only">
      <h1>
        {profile.name} — {profile.role}
      </h1>
      <p>{profile.bio}</p>
      <p>Based in {profile.location}.</p>
      {currentRole && (
        <p>
          Currently {currentRole.role} at {currentRole.company}.
        </p>
      )}
      <h2>Experience</h2>
      <ul>
        {roles.map((r) => (
          <li key={r.id}>
            {r.role}, {r.company} ({rolePeriod(r)}){r.bullets.length > 0 && `: ${r.bullets.join(" ")}`}
          </li>
        ))}
      </ul>
      <h2>Education</h2>
      <ul>
        {education.map((e) => (
          <li key={e.institution}>
            {e.degree}, {e.institution}, {e.years}, {e.grade}
          </li>
        ))}
      </ul>
      <h2>Research</h2>
      <ul>
        {publications.map((p) => (
          <li key={p.slug}>
            {p.title} — {p.kind} at {p.venue}, {p.publisher} ({p.published}).
          </li>
        ))}
      </ul>
      <h2>Highlights</h2>
      <ul>
        {projects.map((p) => (
          <li key={p.slug}>
            {p.name}: {p.summary}
          </li>
        ))}
      </ul>
      <h2>Skills</h2>
      <ul>
        {skills.map((g) => (
          <li key={g.group}>
            {g.group}: {g.items.join(", ")}
          </li>
        ))}
      </ul>
      <h2>Contact</h2>
      <ul>
        {externalLinks.map((l) => (
          <li key={l.id}>
            <a href={l.href}>{l.label}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
