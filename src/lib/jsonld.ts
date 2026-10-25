import { allSkills, currentRole, education, linkFor, parseMonth, profile, publications } from "./portfolio";
import { SITE_AWARDS, SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "./site";

// schema.org graph so search engines can show a rich profile result and link the paper to the person.
const personId = `${SITE_URL}/#person`;
const websiteId = `${SITE_URL}/#website`;

// "Mon, YYYY" -> "YYYY-MM" (ISO 8601)
const isoMonth = (value: string) => {
  const i = parseMonth(value);
  return `${Math.floor(i / 12)}-${String((i % 12) + 1).padStart(2, "0")}`;
};

const [locality, region] = profile.location.split(",").map((s) => s.trim());
const [givenName, ...rest] = profile.name.split(" ");
const linkedin = linkFor("linkedin");
const resume = linkFor("resume");

const person = {
  "@type": "Person",
  "@id": personId,
  name: profile.name,
  givenName,
  familyName: rest.join(" "),
  jobTitle: currentRole?.role ?? profile.role.split(" · ")[0],
  description: profile.bio,
  url: SITE_URL,
  image: `${SITE_URL}${profile.photo}`,
  email: `mailto:${profile.email}`,
  address: { "@type": "PostalAddress", addressLocality: locality, addressRegion: region, addressCountry: "IN" },
  ...(currentRole && { worksFor: { "@type": "Organization", name: currentRole.company } }),
  alumniOf: education.map((e) => ({ "@type": "CollegeOrUniversity", name: e.institution })),
  knowsAbout: allSkills.slice(0, 24),
  ...(SITE_AWARDS.length > 0 && { award: SITE_AWARDS }),
  ...(linkedin && { sameAs: [linkedin.href] }),
  mainEntityOfPage: { "@id": `${SITE_URL}/#profilepage` },
};

const articles = publications.map((p) => ({
  "@type": "ScholarlyArticle",
  "@id": `${SITE_URL}/#${p.slug}`,
  headline: p.title,
  name: p.title,
  description: p.summary,
  datePublished: isoMonth(p.published),
  // Co-authors by name; the site owner links back to the Person entry
  author: (p.authors.length ? p.authors : [profile.name]).map((a) => (a === profile.name ? { "@id": personId } : { "@type": "Person", name: a })),
  publisher: { "@type": "Organization", name: p.publisher },
  isPartOf: { "@type": p.doi ? "Book" : "Event", name: p.venue },
  ...(p.pages && { pagination: p.pages }),
  ...(p.url && { url: p.url }),
  ...(p.doiUrl && { sameAs: p.doiUrl, identifier: { "@type": "PropertyValue", propertyID: "DOI", value: p.doi } }),
}));

export const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": websiteId,
      url: SITE_URL,
      name: `${profile.name} · Portfolio`,
      inLanguage: "en-IN",
      publisher: { "@id": personId },
    },
    {
      "@type": "ProfilePage",
      "@id": `${SITE_URL}/#profilepage`,
      url: SITE_URL,
      name: SITE_TITLE,
      description: SITE_DESCRIPTION,
      isPartOf: { "@id": websiteId },
      mainEntity: { "@id": personId },
      ...(resume && { relatedLink: [resume.href] }),
    },
    person,
    ...articles,
  ],
};

// Escapes "<" so data can never close the script tag early
export const jsonLdHtml = JSON.stringify(jsonLd).replace(/</g, "\\u003c");
