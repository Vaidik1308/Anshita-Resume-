// Raw portfolio content. Every UI string about the person comes from here (via portfolio.ts).
// `null` means "not provided yet": the UI hides that field instead of inventing it.

export type WorkMode = "Remote" | "Hybrid" | "On-site";
export type EngagementType = "Full-time" | "Internship" | "Part-time" | "Contract";
export type ProjectStatus = "Award" | "Academic";

export type ProfileData = {
  name: string;
  role: string; // headline shown under the name
  hireAs: string; // completes "Hiring ___?"
  location: string;
  coords: { lat: number; lon: number }; // weather widget
  timeZone: string; // IANA zone, for the person's local time in Contact
  email: string;
  linkedin: string | null;
  resume: string | null; // Google Drive share link
  photo: string;
  status: string | null; // green status pill; null hides it
  bio: string | null; // optional hand-written intro; replaces the generated one
  themeSeed: string; // Material You seed colour for the Android shell
};

export type ExperienceData = {
  company: string;
  role: string;
  start: string; // "Mon, YYYY"
  end: string | null; // "Mon, YYYY"; null while current
  current: boolean;
  mode?: WorkMode;
  type: EngagementType;
  location?: string;
  bullets: string[];
  tech: string[];
  link?: string;
};

// Trainings and certifications are listed separately from employment.
export type TrainingData = {
  provider: string;
  title: string;
  date: string; // free text, as given on the résumé / LinkedIn
  mode?: WorkMode;
  bullets: string[];
};

export type EducationData = {
  institution: string;
  degree: string;
  years: string;
  grade: string;
  location?: string;
};

export type SkillGroupData = { group: string; items: string[] };

export type ProjectData = {
  slug: string;
  name: string;
  summary: string; // one line
  description: string[]; // longer write-up, one paragraph per entry
  tech: string[];
  live: string | null;
  status: ProjectStatus;
  publication?: string; // slug of a related publication
};

export type PublicationData = {
  slug: string;
  title: string;
  kind: string; // badge, e.g. "Presented"
  publisher: string; // host institution or publisher
  venue: string; // conference or book
  series?: string;
  published: string; // "Mon, YYYY"
  pages?: string;
  doi?: string;
  url?: string;
  authors: string[]; // empty when not listed
  summary: string;
  highlights: string[];
  images: { src: string; alt: string }[]; // under /public, added when provided
};

export const profileData: ProfileData = {
  name: "Anshita Deo",
  role: "MHA Candidate · Hospital Operations & Healthcare Management",
  hireAs: "for Hospital Operations",
  location: "Bhubaneswar, Odisha, India",
  coords: { lat: 20.2961, lon: 85.8245 },
  timeZone: "Asia/Kolkata",
  email: "deoanshita43@gmail.com",
  linkedin: "https://www.linkedin.com/in/anshita-deo/",
  resume: "https://drive.google.com/file/d/1uoYp_ukd-lkNMnbCq_SW_rOLcyf5fsHu/view?usp=sharing",
  photo: "/anshita.jpg",
  status: null,
  // From her LinkedIn About section
  bio: "As an MHA candidate with an academic background in Biomedical Science, I'm passionate about improving healthcare delivery through effective management, operational efficiency and patient-centred practices.",
  themeSeed: "#3F8F82", // teal, matching the generated wallpapers
};

// Newest first. Only one entry may be `current`.
export const experienceData: ExperienceData[] = [
  {
    company: "Aster RV Hospital",
    role: "Operations Intern, Supply Chain Management (Pharmacy)",
    start: "Jun, 2026",
    end: "Aug, 2026",
    current: false,
    type: "Internship",
    location: "Bengaluru",
    bullets: [
      "Analyzed OPD-to-pharmacy conversion to identify customer journey and prescription-related barriers affecting pharmacy utilization, using a customer-oriented, data-driven approach to patient engagement.",
      "Gained hands-on exposure to pharmacy supply chain operations, including Reorder Level (ROL), Purchase Requisition (PR), Goods Received Note (GRN), Put Away, Consignment & Dispensing processes.",
      "Worked within a fast-paced, target-driven hospital environment, maintaining accuracy of information and documentation across technology-enabled workflows.",
    ],
    tech: ["Pharmacy Supply Chain", "Patient Engagement", "Data Analysis", "Hospital Operations"],
  },
  {
    company: "Indian Council of Medical Research (ICMR)",
    role: "Research Intern",
    start: "Jun, 2023",
    end: "Jul, 2023",
    current: false,
    type: "Internship",
    location: "Bhubaneswar",
    bullets: [
      "Conducted research on the solid-state synthesis of molybdenum disulfide magnetic nanoparticles targeting multidrug-resistant pathogens at the Laboratory of Biomaterials & Regenerative Medicine.",
    ],
    tech: ["Nanoparticle Synthesis", "Biomaterials", "Laboratory Research"],
  },
];

// Workshops and conferences, shown under Experience.
export const trainingData: TrainingData[] = [
  {
    provider: "SOA, Bhubaneswar",
    title: "AI & Machine Learning in Hospital Operations and Patient Flow Management",
    date: "Dec 2025",
    bullets: ["Workshop that built technology adoption skills."],
  },
  {
    provider: "KIIT, Bhubaneswar",
    title: "CAHOTECH 2025: Technology & Impact, Solving Challenges in Healthcare",
    date: "Nov 2025",
    bullets: ["Participated in the health-tech conference."],
  },
  {
    provider: "SOA, Bhubaneswar",
    title: "Understanding AI Agents",
    date: "Oct 2025",
    bullets: ["Workshop strengthening familiarity with emerging technology."],
  },
];

export const educationData: EducationData[] = [
  {
    institution: "Siksha 'O' Anusandhan, Deemed To Be University",
    degree: "MBA in Hospital Administration (MHA)",
    years: "2025 – Present",
    grade: "CGPA 9.57",
    location: "Bhubaneswar",
  },
  {
    institution: "Acharya Narendra Dev College, Delhi University",
    degree: "B.Sc. (Hons.) Biomedical Science",
    years: "2021 – 2024",
    grade: "CGPA 7.0",
    location: "Delhi",
  },
];

export const skillsData: SkillGroupData[] = [
  {
    group: "Patient Engagement",
    items: [
      "Customer Communication",
      "Rapport Building",
      "Customer Journey Awareness",
      "Customer On-boarding",
      "Customer Oriented Approach",
      "Follow-up & Interpersonal Communication",
    ],
  },
  {
    group: "Health & Technology",
    items: [
      "Biomedical Science Foundation",
      "Preventive Health",
      "Digital Health (Telemedicine, EHR, EHS)",
      "AI in Hospital Operations",
      "Health Education",
      "Epidemiological Data Analysis",
    ],
  },
  {
    group: "Analytics & Tools",
    items: ["R Software", "MS Excel", "Power BI", "Digital Platforms", "Healthcare Data Analytics"],
  },
  {
    group: "Professional Skills",
    items: [
      "Communication Skills",
      "Interpersonal and Relation Building",
      "Advisory Skills",
      "Teamwork",
      "Adaptability",
      "Decision Making",
      "Time Management",
      "Ownership Mindset",
    ],
  },
];

// Achievements and academic work, shown in the Highlights app.
export const projectsData: ProjectData[] = [
  {
    slug: "safe-a-thon",
    name: "Safe-A-Thon: 1st Place",
    summary: "Won the Apollo Hospital Hyderabad Safe-A-Thon Regional Prelims (Dec 2025).",
    description: [
      "Awarded 1st Place at the Apollo Hospital Hyderabad Safe-A-Thon Regional Prelims for healthcare innovation, patient safety problem-solving and collaborative solution development.",
    ],
    tech: ["Patient Safety", "Healthcare Innovation", "Teamwork"],
    live: null,
    status: "Award",
  },
  {
    slug: "clinical-workflows",
    name: "Clinical Workflows & Hospital Operations",
    summary: "Exposure to clinical workflows and hospital operational processes across key departments.",
    description: ["Gained exposure to clinical workflows and hospital operational processes through visits across key departments."],
    tech: ["Hospital Operations", "Clinical Workflows"],
    live: null,
    status: "Academic",
  },
  {
    slug: "epidemiological-analysis",
    name: "Epidemiological Data Analysis",
    summary: "Epidemiological data analysis using R, building a foundation in preventive health.",
    description: ["Performed Epidemiological Data Analysis using R Software, building a foundation in preventive health and health data."],
    tech: ["R Software", "Epidemiology", "Preventive Health"],
    live: null,
    status: "Academic",
  },
  {
    slug: "molecular-biology",
    name: "Molecular Biology Techniques",
    summary: "Hands-on lab work in DNA isolation, gel electrophoresis, DNA fingerprinting and DOT ELISA.",
    description: [
      "Gained hands-on experience with Molecular Biology Techniques including DNA Isolation, Gel Electrophoresis, DNA Fingerprinting and DOT ELISA.",
    ],
    tech: ["DNA Isolation", "Gel Electrophoresis", "DNA Fingerprinting", "DOT ELISA"],
    live: null,
    status: "Academic",
  },
];

export const publicationsData: PublicationData[] = [
  {
    slug: "green-hospital-infrastructure",
    title: "Impact of Green Hospital Infrastructure on Nurse Well-Being and Quality of Care",
    kind: "Presented",
    publisher: "SUM Nursing College, SOA",
    venue: "International Conference",
    published: "Nov, 2025",
    authors: [],
    summary:
      "Paper presented at an International Conference at SUM Nursing College, Siksha 'O' Anusandhan, on how green hospital infrastructure affects nurse well-being and the quality of care.",
    highlights: [],
    images: [],
  },
];
