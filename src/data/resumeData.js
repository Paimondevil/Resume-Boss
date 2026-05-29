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
// LATEX TEMPLATE — placeholders for dynamic sections
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

\\resumeProjectHeading
{\\textbf{Traffic Controller System} $|$ \\emph{React, JavaScript, Scheduling Algorithms, CSS} $|$ \\href{https://traffic-controll-neon.vercel.app/}{\\color{blue}Live Demo}}{}
\\resumeItemListStart
%%TRAFFIC_1%%
%%TRAFFIC_2%%
\\resumeItemListEnd

\\resumeProjectHeading
{\\textbf{GoodWill Enterprises Website} $|$ \\emph{React, Tailwind CSS, Framer Motion, Vercel} $|$ \\href{https://goodwill-enterprises.vercel.app}{\\color{blue}Live Demo}}{}
\\resumeItemListStart
%%GOODWILL_1%%
%%GOODWILL_2%%
\\resumeItemListEnd

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