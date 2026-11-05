export const technologySkillCategories = [
  {
    id: "ai-workflows",
    title: "AI Engineering & Implementation",
    description:
      "Apply AI engineering and integration capabilities across software development, workflow automation, AI solution development, and digital learning use cases.",
    groups: [
      {
        title: "Engineering and implementation competencies",
        items: [
          { name: "AI Engineering", icon: "mdi:brain", kind: "competency" },
          {
            name: "AI Implementation & Integration",
            icon: "mdi:connection",
            kind: "competency",
          },
          {
            name: "AI-Assisted Software Development",
            icon: "mdi:code-braces-box",
            kind: "competency",
          },
          {
            name: "AI-Powered Workflow Automation",
            icon: "mdi:workflow-outline",
            kind: "competency",
          },
          {
            name: "AI Solutions Development",
            icon: "mdi:lightbulb-on-outline",
            kind: "competency",
          },
          {
            name: "AI Applications in EdTech & Digital Learning",
            icon: "mdi:school-outline",
            kind: "competency",
          },
        ],
      },
      {
        title: "AI development and research tools",
        items: [
          {
            name: "ChatGPT / OpenAI",
            icon: "simple-icons:openai",
            color: "#10A37F",
          },
          {
            name: "Google Gemini",
            icon: "simple-icons:googlegemini",
            color: "#4285F4",
          },
          { name: "Claude", icon: "simple-icons:anthropic", color: "#D97757" },
          {
            name: "Microsoft Copilot",
            icon: "mdi:robot-outline",
            color: "#5B65D8",
          },
          {
            name: "GitHub Copilot",
            icon: "simple-icons:githubcopilot",
            color: "#111111",
          },
          {
            name: "Perplexity",
            icon: "simple-icons:perplexity",
            color: "#20808D",
          },
        ],
      },
    ],
  },
  {
    id: "programming-web",
    title: "Programming Languages & Web Technologies",
    groups: [
      {
        title: "Languages and foundations",
        items: [
          { name: "Java", icon: "logos:java", color: "#5382A1" },
          {
            name: "JavaScript",
            icon: "simple-icons:javascript",
            color: "#F7DF1E",
          },
          { name: "HTML5", icon: "simple-icons:html5", color: "#E34F26" },
          { name: "CSS3", icon: "simple-icons:css3", color: "#1572B6" },
          { name: "Python", icon: "simple-icons:python", color: "#3776AB" },
          { name: "PHP", icon: "simple-icons:php", color: "#777BB4" },
          {
            name: "SQL",
            icon: "mdi:database-search-outline",
            color: "#336791",
          },
          {
            name: "TypeScript",
            icon: "simple-icons:typescript",
            color: "#3178C6",
          },
        ],
      },
      {
        title: "Frameworks and libraries",
        items: [
          { name: "React", icon: "simple-icons:react", color: "#61DAFB" },
          { name: "Next.js", icon: "simple-icons:nextdotjs", color: "#111111" },
          { name: "Node.js", icon: "simple-icons:nodedotjs", color: "#339933" },
          { name: "Django", icon: "simple-icons:django", color: "#092E20" },
          {
            name: "Tailwind CSS",
            icon: "simple-icons:tailwindcss",
            color: "#06B6D4",
          },
        ],
      },
    ],
  },
  {
    id: "databases",
    title: "Databases & Data Technologies",
    groups: [
      {
        title: "Data stores and backend services",
        items: [
          { name: "MySQL", icon: "simple-icons:mysql", color: "#4479A1" },
          { name: "MongoDB", icon: "simple-icons:mongodb", color: "#47A248" },
          {
            name: "PostgreSQL",
            icon: "simple-icons:postgresql",
            color: "#4169E1",
          },
          { name: "Firebase", icon: "simple-icons:firebase", color: "#DD2C00" },
        ],
      },
    ],
  },
  {
    id: "cloud-infrastructure",
    title: "Cloud Computing & Infrastructure",
    groups: [
      {
        title: "Cloud and deployment",
        items: [
          {
            name: "Google Cloud",
            icon: "simple-icons:googlecloud",
            color: "#4285F4",
          },
          {
            name: "Amazon Web Services",
            icon: "simple-icons:amazonaws",
            color: "#232F3E",
          },
          { name: "Vercel", icon: "simple-icons:vercel", color: "#111111" },
          {
            name: "GitHub Actions",
            icon: "simple-icons:githubactions",
            color: "#2088FF",
          },
        ],
      },
    ],
  },
  {
    id: "operating-systems",
    title: "Operating Systems",
    groups: [
      {
        title: "Desktop and server",
        items: [
          { name: "Windows", icon: "simple-icons:windows", color: "#0078D4" },
          { name: "Linux", icon: "simple-icons:linux", color: "#FCC624" },
          { name: "Ubuntu", icon: "simple-icons:ubuntu", color: "#E95420" },
          { name: "macOS", icon: "simple-icons:apple", color: "#555555" },
        ],
      },
      {
        title: "Mobile",
        items: [
          { name: "Android", icon: "simple-icons:android", color: "#3DDC84" },
          { name: "iOS", icon: "simple-icons:ios", color: "#555555" },
        ],
      },
    ],
  },
  {
    id: "project-management",
    title: "Project Management & Delivery",
    description:
      "Competency icons represent delivery practices; the logos below identify software tools and do not imply certification.",
    groups: [
      {
        title: "Professional competencies",
        items: [
          {
            name: "Project Management",
            icon: "mdi:clipboard-check-multiple-outline",
            kind: "competency",
          },
          {
            name: "Project Planning",
            icon: "mdi:clipboard-list-outline",
            kind: "competency",
          },
          {
            name: "Workplan & Schedule Management",
            icon: "mdi:calendar-clock",
            kind: "competency",
          },
          {
            name: "Task & Milestone Tracking",
            icon: "mdi:chart-timeline-variant",
            kind: "competency",
          },
          {
            name: "Team Coordination",
            icon: "mdi:account-group-outline",
            kind: "competency",
          },
          {
            name: "Stakeholder Management",
            icon: "mdi:handshake-outline",
            kind: "competency",
          },
          {
            name: "Monitoring, Evaluation & Reporting",
            icon: "mdi:chart-box-outline",
            kind: "competency",
          },
        ],
      },
      {
        title: "Project and collaboration tools",
        items: [
          {
            name: "Trello",
            icon: "simple-icons:trello",
            color: "#0052CC",
            kind: "tool",
          },
          {
            name: "Jira",
            icon: "simple-icons:jira",
            color: "#1868DB",
            kind: "tool",
          },
          {
            name: "Asana",
            icon: "simple-icons:asana",
            color: "#F06A6A",
            kind: "tool",
          },
          {
            name: "Notion",
            icon: "simple-icons:notion",
            color: "#111111",
            kind: "tool",
          },
          {
            name: "Microsoft Teams",
            icon: "simple-icons:microsoftteams",
            color: "#6264A7",
            kind: "tool",
          },
          {
            name: "Slack",
            icon: "simple-icons:slack",
            color: "#4A154B",
            kind: "tool",
          },
        ],
      },
    ],
  },
  {
    id: "digital-skills-edtech",
    title: "Digital Skills Training & EdTech",
    groups: [
      {
        title: "Training and learning practice",
        items: [
          {
            name: "Digital Skills Training",
            icon: "mdi:laptop-account",
            kind: "competency",
          },
          {
            name: "Technical Training & Facilitation",
            icon: "mdi:account-multiple-check-outline",
            kind: "competency",
          },
          {
            name: "Learning Management Systems (LMS)",
            icon: "mdi:school-outline",
            kind: "competency",
          },
          {
            name: "E-Learning",
            icon: "mdi:book-open-page-variant",
            kind: "competency",
          },
          {
            name: "Blended Learning",
            icon: "mdi:monitor-cellphone",
            kind: "competency",
          },
          {
            name: "Digital Learning Content Development",
            icon: "mdi:file-document-edit-outline",
            kind: "competency",
          },
          {
            name: "STEM & Digital Skills Education",
            icon: "mdi:atom-variant",
            kind: "competency",
          },
        ],
      },
      {
        title: "Learning platforms and delivery tools",
        items: [
          {
            name: "Moodle",
            icon: "simple-icons:moodle",
            color: "#F98012",
            kind: "tool",
          },
          {
            name: "Google Classroom",
            icon: "simple-icons:googleclassroom",
            color: "#0F9D58",
            kind: "tool",
          },
        ],
      },
    ],
  },
  {
    id: "design-productivity",
    title: "Design, Collaboration & Productivity",
    groups: [
      {
        title: "Design, collaboration, and productivity tools",
        items: [
          {
            name: "Figma",
            icon: "simple-icons:figma",
            color: "#F24E1E",
            kind: "tool",
          },
          {
            name: "Adobe XD",
            icon: "simple-icons:adobexd",
            color: "#FF61F6",
            kind: "tool",
          },
          {
            name: "Adobe Creative Cloud",
            icon: "simple-icons:adobecreativecloud",
            color: "#DA1F26",
            kind: "tool",
          },
          {
            name: "Canva",
            icon: "simple-icons:canva",
            color: "#00C4CC",
            kind: "tool",
          },
          {
            name: "Google Workspace",
            icon: "logos:google-workspace",
            kind: "tool",
          },
          { name: "Microsoft 365", icon: "logos:microsoft-icon", kind: "tool" },
          {
            name: "Zoom",
            icon: "simple-icons:zoom",
            color: "#2D8CFF",
            kind: "tool",
          },
          {
            name: "Replit",
            icon: "simple-icons:replit",
            color: "#F26207",
            kind: "tool",
          },
          {
            name: "GitHub",
            icon: "simple-icons:github",
            color: "#111111",
            kind: "tool",
          },
        ],
      },
    ],
  },
];
