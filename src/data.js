const STORAGE_KEY = "aura-trainees-v1";

export const ENGLISH_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
export const STATUSES = [
  { value: "training", label: "In Training" },
  { value: "interviewing", label: "Interviewing" },
  { value: "hired", label: "Hired" },
];

export const emptyTrainee = {
  name: "",
  from: "",
  livingIn: "",
  englishLevel: "B1",
  communication: 5,
  skills: [],
  shortIntro: "",
  experience: "",
  email: "",
  phone: "",
  linkedin: "",
  github: "",
  portfolio: "",
  qrLink: "",
  status: "training",
  notes: "",
};

export function loadTrainees() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    /* corrupted storage -> fall back to seed */
  }
  return seed;
}

export function saveTrainees(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

const seed = [
  {
    id: "t1",
    name: "Abdelrahman Alhayek",
    from: "Palestine",
    livingIn: "Spain",
    englishLevel: "B2",
    communication: 7,
    skills: [
      "Business Operations",
      "Project Management",
      "Business Development",
      "JavaScript",
      "C#",
    ],
    shortIntro:
      "Business Administration professional with 8+ years of experience in business operations, project management, business development, inventory, procurement, and team supervision. Also experienced in JavaScript and C#, combining business and technical skills to improve processes, solve problems, and support business growth. Currently open to remote and international opportunities.",
    experience: "",
    email: "abdhayek17@gmail.com",
    phone: "",
    linkedin:
      "https://www.linkedin.com/in/abdelrahman-alhayek-b80ba0129?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    github: "",
    portfolio: "",
    qrLink: "https://www.linkedin.com/in/abdelrahman-alhayek-b80ba0129",
    status: "training",
    notes: "",
  },

  {
    id: "t2",
    name: "Mohamed Shublaq",
    from: "Palestine / Egypt",
    livingIn: "",
    englishLevel: "B2",
    communication: 7,
    skills: ["PHP", "JavaScript", "Backend Development", "REST APIs", "MySQL"],
    shortIntro:
      "Computer Engineer and Backend Developer with 2 years of experience building web applications using PHP and Laravel. Experienced in REST APIs, database design, authentication, and business logic. Passionate about building reliable, scalable, and maintainable solutions.",
    experience: "",
    email: "",
    phone: "",
    linkedin: "https://www.linkedin.com/in/mohamed-shublaq/",
    github: "",
    portfolio: "",
    qrLink: "https://www.linkedin.com/in/mohamed-shublaq/",
    status: "training",
    notes: "",
  },

  {
    id: "t3",
    name: "Ahmed Alnono",
    from: "Palestine",
    livingIn: "Gaza",
    englishLevel: "B1",
    communication: 6,
    skills: [
      "Full-Stack Web Development",
      "ASP.NET Core & .NET",
      "React.js",
      "Database Management",
      "API Integration",
    ],
    shortIntro:
      "A freelance full-stack developer with hands-on experience building complete websites from A to Z. Multiple projects have been designed, developed, integrated, deployed, and maintained independently. Through multiple client work, strong experience has been gained in turning ideas into reliable, practical, and scalable web solutions.",
    experience: "",
    email: "ahmed.alnono.work@gmail.com",
    phone: "",
    linkedin: "https://www.linkedin.com/in/ahmed-alnono-187b09251",
    github: "",
    portfolio: "",
    qrLink: "https://www.linkedin.com/in/ahmed-alnono-187b09251",
    status: "training",
    notes: "",
  },

  {
    id: "t4",
    name: "Mervat AlBhaisi",
    from: "Palestine",
    livingIn: "",
    englishLevel: "B1",
    communication: 6,
    skills: [
      "C# Programming",
      "Game Development",
      "Version Control",
      "Quality Assurance & Debugging",
      "Graphic Design (Adobe Illustrator & Photoshop)",
    ],
    shortIntro:
      "Game Developer skilled in Unity, C#, gameplay programming, version control, QA and debugging, and interactive design. Independently created a story-driven game about children's right to education in Gaza, taking it from story development and design to coding and implementation. Skilled in Adobe Illustrator and Photoshop, with strong problem-solving skills.",
    experience: "",
    email: "",
    phone: "",
    linkedin: "https://www.linkedin.com/in/mervat-albhaisi",
    github: "",
    portfolio: "",
    qrLink: "https://www.linkedin.com/in/mervat-albhaisi",
    status: "training",
    notes: "",
  },

  {
    id: "t5",
    name: "Ahmed Aghaalkurdi",
    from: "Palestine",
    livingIn: "Spain",
    englishLevel: "B2",
    communication: 7,
    skills: [
      "SQL",
      "PL/SQL",
      "Troubleshooting",
      "Cards & E-Payments",
      "JasperReports",
    ],
    shortIntro:
      "Computer Engineer with experience in banking technology, data, reporting, and payment systems. Skilled in SQL, Oracle, PL/SQL, JasperReports, and PowerCard. Currently specializing in Data Analytics and Business Intelligence, focusing on Power BI, data visualization, and turning data into practical insights.",
    experience: "",
    email: "a.r.aghaalkurdi@gmail.com",
    phone: "",
    linkedin:
      "https://www.linkedin.com/in/ahmed-aghaalkurdi-a88311180?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    github: "",
    portfolio: "",
    qrLink: "https://www.linkedin.com/in/ahmed-aghaalkurdi-a88311180",
    status: "training",
    notes: "",
  },

  {
    id: "t6",
    name: "Leonard de Lima",
    from: "São Paulo, Brazil",
    livingIn: "São Paulo, Brazil",
    englishLevel: "B1",
    communication: 6,
    skills: ["Graphic Design", "UI/UX Design", "Video Editing"],
    shortIntro:
      "I am a creative soul passionate about technology who found my calling in the graphic design world. I have been working in the field for over 10 years, specializing in UI/UX development, motion design, and branding.",
    experience: "",
    email: "",
    phone: "",
    linkedin: "https://www.linkedin.com/in/leonardlima/",
    github: "",
    portfolio: "",
    qrLink: "https://www.linkedin.com/in/leonardlima/",
    status: "training",
    notes: "",
  },
];
