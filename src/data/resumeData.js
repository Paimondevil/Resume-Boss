// ============================================================
// LOCKED SECTIONS — never touched by AI
// ============================================================

export const LOCKED_EXPERIENCE = `\\resumeSubheading
{Siemens Tech. and Services Ltd.}{Bengaluru, India}
{Software Development Engineer}{Oct 2021 -- Sep 2022}
\\resumeItemListStart
\\resumeItem{Engineered \\textbf{PLC}-based automation for conveyor systems using \\textbf{C\\#}, \\textbf{.NET}, and TIA Portal, increasing throughput and reclaiming 40+ hours/month via workflow automation.}
\\resumeItem{Spearheaded software feasibility studies and effort estimations, resulting in a \\textbf{20\\%} reduction in project delays and a \\textbf{15\\%} boost in on-time delivery rates.}
\\resumeItem{Modularized system architectures within an \\textbf{Agile/Scrum} environment, reducing debugging time by \\textbf{25\\%} and significantly improving production stability.}
\\resumeItemListEnd

\\resumeSubheading
{Solartis LLC}{Chennai, India}
{Associate Software Engineer}{Apr 2021 -- Oct 2021}
\\resumeItemListStart
\\resumeItem{Refactored backend logic and optimized \\textbf{SQL} (\\textbf{MySQL}) queries, cutting load times by \\textbf{40\\%} and reducing post-release bug reports by \\textbf{40\\%}.}
\\resumeItem{Architected \\textbf{Jenkins} \\textbf{CI/CD} pipelines, lowering deployment errors by \\textbf{70\\%} and reclaiming 15+ hours/week for the core engineering team.}
\\resumeItem{Orchestrated cross-functional collaboration on a global campaign, increasing customer acquisition by \\textbf{25\\%} and contributing \\textbf{\\$1.5M} in revenue impact.}
\\resumeItemListEnd`;

// ============================================================
// VERIFIED SKILLS — everything you can back up in an interview
// ============================================================
export const VERIFIED_SKILLS = [
  // Languages
  "c", "c++", "python", "c#", "java", "javascript", "sql", "html", "css", "kotlin",
  // Frontend
  "react", "react.js", "tailwind", "tailwind css", "framer motion", "lottie",
  // Backend
  ".net", "django", "flask", "rest apis", "rest api",
  // Databases
  "mysql", "sqlite", "relational design", "query optimization",
  // Cloud
  "aws", "ec2", "s3",
  // Deployment
  "vercel", "netlify", "cloudinary", "vite",
  // Tools
  "linux", "git", "visual studio", "eclipse", "jupyter notebook",
  // Concepts
  "data structures", "oop", "sdlc", "api design", "encryption", "authentication",
  "machine learning", "data mining", "distributed systems", "data warehousing",
  "high performance computing", "operating systems",
  // Practices
  "debugging", "performance optimization", "agile", "scrum", "agile/scrum",
  // Soft skills — always safe
  "collaboration", "communication", "problem-solving", "analytical thinking",
  "teamwork", "leadership", "mentoring", "time management",
];

// ============================================================
// DEFAULT SKILLS BLOCK
// ============================================================
export const DEFAULT_SKILLS = `\\textbf{Languages}{: C, C++, Python, C\\#, Java, JavaScript, SQL, Kotlin} \\\\
\\textbf{Frontend}{: React.js, HTML, CSS, Tailwind CSS, Framer Motion, Lottie} \\\\
\\textbf{Backend}{: .NET, Django, Flask, REST APIs} \\\\
\\textbf{Databases}{: MySQL, SQLite, relational design, query optimization} \\\\
\\textbf{Cloud}{: AWS (EC2, S3 -- foundational knowledge)} \\\\
\\textbf{Deployment}{: Vercel, Netlify, Cloudinary} \\\\
\\textbf{Tools}{: Linux, Git, Visual Studio, Eclipse, Jupyter Notebook, Vite} \\\\
\\textbf{Concepts}{: Data Structures, OOP, SDLC, API design, Machine Learning, Distributed Systems} \\\\
\\textbf{Practices}{: Debugging, performance optimization, Agile/Scrum}`;

// ============================================================
// FULL CERTIFICATES POOL
// ============================================================
export const CERTS_POOL = [
  { name: "AWS APAC Solutions Architecture", issuer: "Amazon Web Services", year: 2023, tags: ["aws", "cloud", "architecture", "infrastructure", "s3", "ec2"] },
  { name: "SAP Technical Consulting", issuer: "SAP", year: 2023, tags: ["sap", "enterprise", "consulting", "it service", "enterprise applications"] },
  { name: "Goldman Sachs Software Engineering", issuer: "Goldman Sachs", year: 2023, tags: ["software engineering", "backend", "security", "financial", "enterprise"] },
  { name: "Accenture Nordics Developer", issuer: "Accenture", year: 2021, tags: ["developer", "agile", "consulting", "software development"] },
  { name: "SQL", issuer: "HackerRank", year: 2022, tags: ["sql", "mysql", "database", "queries", "data"] },
  { name: "Python", issuer: "HackerRank", year: 2022, tags: ["python", "scripting", "automation"] },
  { name: "Problem Solving Intermediate", issuer: "HackerRank", year: 2022, tags: ["algorithms", "data structures", "problem solving", "c++"] },
  { name: "Problem Solving Basic", issuer: "HackerRank", year: 2022, tags: ["data structures", "problem solving", "algorithms"] },
  { name: "Technical Support Fundamentals", issuer: "Google", year: 2021, tags: ["technical support", "it", "troubleshooting", "infrastructure", "it service management"] },
  { name: "Algorithmic Toolbox", issuer: "UC San Diego / Coursera", year: 2021, tags: ["algorithms", "data structures", "computer science"] },
];

// ============================================================
// PROJECT BULLET POOLS
// ============================================================
export const PROJECT_BULLETS = {
  resumeBoss: [
    "Built an AI-powered resume tailoring web app using React and Groq API, automating keyword extraction and LaTeX generation to match job descriptions.",
    "Engineered a tiered keyword extraction system and ATS scoring engine in JavaScript, achieving score alignment within 15% of industry tools like Jobscan.",
    "Developed a full-stack AI application with React and Vite, integrating LLM prompt engineering workflows to automate resume customization for job applications.",
    "Designed and deployed a production React app on Vercel, implementing Groq API integration, localStorage persistence, and real-time ATS scoring.",
    "Built an end-to-end AI resume optimization tool, engineering structured JSON prompts for LLM output parsing and dynamic LaTeX assembly.",
    "Implemented a frequency-based keyword placement engine and cert selector using JavaScript, reducing resume tailoring time from hours to seconds.",
  ],
  dataHub: [
    "Built a secure file-sharing platform using Python and Flask, implementing PIN-based encryption and SQLite-backed user authentication.",
    "Designed and implemented a custom encryption system in Python to secure user-uploaded files, with PIN-based decryption and hashed password storage.",
    "Developed a full-stack web application with Python/Flask backend and SQLite database, featuring user auth, encrypted file storage, and secure retrieval.",
    "Engineered backend REST routes and database schemas in Python/Flask, implementing end-to-end file encryption and session-based access control.",
    "Built a peer-to-peer data sharing platform with Python, Flask, and SQLite, implementing custom encryption logic and secure multi-user file management.",
    "Implemented secure file upload and retrieval system using Python/Flask with SHA-based password hashing and PIN-encrypted content delivery.",
  ],
  traffic: [
    "Developed a real-time traffic management simulator using advanced scheduling algorithms to optimize vehicle flow and reduce congestion.",
    "Built a dynamic React-based dashboard to visualize traffic data, improving simulated traffic efficiency by 35% through algorithmic problem-solving.",
    "Designed and implemented a scheduling algorithm engine in JavaScript, reducing simulated congestion by 35% through state-based traffic management.",
    "Built an interactive React frontend with real-time data visualization, demonstrating full-stack development and algorithmic problem-solving skills.",
    "Engineered a traffic simulation system using React and JavaScript, applying data structures and scheduling concepts to model real-world vehicle flow.",
    "Developed automated scheduling logic to manage traffic signal timing, improving throughput by 35% through algorithm optimization and state management.",
  ],
  goodwill: [
    "Engineered and deployed an interactive business platform, optimizing page load speeds by 30% through efficient asset management and code splitting.",
    "Implemented responsive UI components and fluid animations using Framer Motion, ensuring 100% cross-browser compatibility and accessibility.",
    "Built a production-ready React web application for a real client, delivering responsive UI, Framer Motion animations, and 30% faster load times.",
    "Deployed a client-facing business website on Vercel with Tailwind CSS and Framer Motion, achieving 100% cross-browser compatibility.",
    "Optimized frontend performance by 30% through code splitting and asset management, while implementing accessible, mobile-first UI components.",
    "Collaborated with a client to gather requirements and deliver an interactive React platform, improving page speed by 30% and ensuring accessibility.",
  ],
};

// ============================================================
// LATEX TEMPLATE
// ============================================================
export const LATEX_TEMPLATE = `%-------------------------
% Resume in Latex
% Author : Jake Gutierrez
% Based off of: https://github.com/sb2nov/resume
% License : MIT
%------------------------

\\documentclass[letterpaper,11pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[dvipsnames]{xcolor}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\input{glyphtounicode}

% Footer setup
\\setlength{\\footskip}{27pt}
\\pagestyle{fancy}
\\fancyhf{}
\\fancyfoot[C]{\\makebox[\\textwidth][c]{\\textcolor{black!50}{\\small Devesh Gautam - Resume}}}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

% Adjust margins
\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.75in}
\\addtolength{\\textheight}{1.5in}

\\urlstyle{same}

\\flushbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

% Sections formatting
\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

\\titlespacing{\\section}{-1pt}{0.2cm}{0.15cm}

\\pdfgentounicode=1

%-------------------------
% Custom commands
\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{0pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small #3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small #1 & #2 \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubItem}[1]{\\resumeItem{#1}\\vspace{-4pt}}

\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

%-------------------------------------------
%%%%%%  RESUME STARTS HERE  %%%%%%%%%%%%%%%%%%%%%%%%%%%%

\\begin{document}

%----------HEADING----------
\\begin{center}
    \\textbf{\\Huge \\scshape Devesh Gautam} \\\\ \\vspace{1pt}
    \\small
    \\href{tel:+19023382913}{\\textcolor{black}{+1(902) 338-2913}} $|$
    \\href{mailto:29deveshgautam@gmail.com}{29deveshgautam@gmail.com} $|$
    \\href{https://www.linkedin.com/in/29deveshgautam}{linkedin.com/in/29deveshgautam} $|$
    \\href{https://deveshfolio.vercel.app}{deveshfolio.vercel.app}
\\end{center}

%-----------EDUCATION-----------
\\section{Education}
  \\resumeSubHeadingListStart
    \\resumeSubheading
      {St. Francis Xavier University}{Antigonish, NS}
      {Master of Applied Computer Science}{Jan 2023 -- May 2025}
    \\resumeSubheading
      {Sathyabama University}{Chennai, India}
      {Bachelor of Engineering in Computer Science}{Aug 2017 -- May 2021}
  \\resumeSubHeadingListEnd

%-----------EXPERIENCE-----------
\\section{Experience}
\\resumeSubHeadingListStart

%%FREELANCE_BLOCK%%

%%LOCKED_EXPERIENCE%%

\\resumeSubHeadingListEnd

%-----------PROJECTS-----------
\\section{Projects \\hfill \\small \\href{https://deveshfolio.vercel.app/}{\\color{blue}Portfolio \\& Demos}}
\\resumeSubHeadingListStart

%%PROJECT_1%%

%%PROJECT_2%%

\\resumeSubHeadingListEnd

%-----------TECHNICAL SKILLS-----------
\\section{Technical Skills}
\\vspace{0.05in}
\\begin{itemize}[leftmargin=0.15in, label={}]
\\small{\\item{
%%SKILLS_BLOCK%%
}}
\\end{itemize}

%-----------CERTIFICATIONS-----------
\\section{Certifications}
\\vspace{0.05in}
\\begin{itemize}[leftmargin=0.15in, label={}]
  \\small{\\item{
%%CERTS_BLOCK%%
  }}
\\end{itemize}

%-------------------------------------------
\\end{document}`;