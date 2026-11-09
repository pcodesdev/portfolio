/* Change this file to get your personal Porfolio */

import mediumPublications from "./shared/medium/publications.json";
import { limitFeaturedItems } from "./shared/featuredItems";
import {
  seo,
  greeting,
  homeHighlights,
  aboutPageData,
  expertiseAreas,
  projectCaseStudyMeta,
} from "./profileData";

// Website related settings
const settings = {
  isSplash: false, // Change this to false if you don't want Splash screen.
};

// Profile content is imported from profileData.js.

const socialMediaLinks = [
  {
    name: "Github",
    link: "https://github.com/pcodesdev/",
    fontAwesomeIcon: "fa-github",
    backgroundColor: "#181717",
  },
  {
    name: "LinkedIn",
    link: "https://www.linkedin.com/in/pcodesdev/",
    fontAwesomeIcon: "fa-linkedin-in",
    backgroundColor: "#0077B5",
  },
  {
    name: "Medium profile",
    link: "https://medium.com/@pcodesdev",
    fontAwesomeIcon: "fa-medium",
    backgroundColor: "#000000",
  },
  {
    name: "YouTube",
    link: "https://www.youtube.com/channel/UCkhyflbByfOBOkQ8hA0RoTg",
    fontAwesomeIcon: "fa-youtube",
    backgroundColor: "#FF0000",
  },
  {
    name: "Gmail",
    link: "mailto:njugunapm23@gmail.com",
    fontAwesomeIcon: "fa-google",
    backgroundColor: "#D14836",
  },
  {
    name: "X-Twitter",
    link: "https://twitter.com/pcodesdev",
    icon: "x",
    backgroundColor: "#000000",
  },
];

const skills = {
  data: [
    {
      title: "Digital Programme Delivery",
      fileName: "DataScienceImg",
      skills: [
        "⚡ Delivering technology-enabled training, learning environments, and programme support for youth and community development initiatives.",
        "⚡ Coordinating learning logistics, partner engagement, training delivery, and operational support across multiple locations and programme streams.",
        "⚡ Translating technical and digital learning objectives into practical activities, learner support, and measurable programme outcomes.",
      ],
      softwareSkills: [
        {
          skillName: "Google Workspace",
          fontAwesomeClassname: "devicon:google",
          style: { backgroundColor: "transparent" },
        },
        {
          skillName: "Microsoft Teams",
          fontAwesomeClassname: "logos:microsoft-teams",
          style: { backgroundColor: "transparent" },
        },
        {
          skillName: "Moodle",
          fontAwesomeClassname: "devicon:moodle",
          style: { backgroundColor: "transparent" },
        },
        {
          skillName: "Canva",
          fontAwesomeClassname: "devicon:canva",
          style: { backgroundColor: "white", color: "transparent" },
        },
        {
          skillName: "Zoom",
          fontAwesomeClassname: "logos:zoom",
          style: { backgroundColor: "white", color: "transparent" },
        },
        {
          skillName: "Notion",
          fontAwesomeClassname: "mingcute:notion-fill",
          style: { color: "#000" },
        },
      ],
    },
    {
      title: "Full-Stack Development",
      fileName: "FullStackImg",
      skills: [
        "⚡ Building responsive, user-focused web applications with React and TypeScript, with an emphasis on practical front-end architecture and maintainability.",
        "⚡ Developing front-end and service-layer logic for data-driven workflows, API integration, and structured application behaviour.",
        "⚡ Applying relational thinking to data models, form validation, and consistency across application workflows.",
        "⚡ Working with offline-first patterns, local persistence, and structured import/export flows suited to environments with limited connectivity.",
      ],
      softwareSkills: [
        {
          skillName: "React",
          fontAwesomeClassname: "simple-icons:react",
          style: { color: "#61DAFB" },
        },
        {
          skillName: "TypeScript",
          fontAwesomeClassname: "simple-icons:typescript",
          style: { color: "#3178C6" },
        },
        {
          skillName: "JavaScript",
          fontAwesomeClassname: "simple-icons:javascript",
          style: { backgroundColor: "#000000", color: "#F7DF1E" },
        },
        {
          skillName: "HTML5",
          fontAwesomeClassname: "simple-icons:html5",
          style: { color: "#E34F26" },
        },
        {
          skillName: "CSS3",
          fontAwesomeClassname: "fa-css3",
          style: { color: "#1572B6" },
        },
        {
          skillName: "NodeJS",
          fontAwesomeClassname: "devicon-plain:nodejs-wordmark",
          style: { color: "#339933" },
        },
        {
          skillName: "Git",
          fontAwesomeClassname: "vscode-icons:file-type-git",
          style: { color: "#dd4c35" },
        },
        {
          skillName: "GitHub",
          fontAwesomeClassname: "mdi:github",
          style: { color: "#000000" },
        },
        {
          skillName: "SQL",
          fontAwesomeClassname: "simple-icons:postgresql",
          style: { color: "#336791" },
        },
      ],
    },
    {
      title: "Cloud Solutions",
      fileName: "CloudInfraImg",
      skills: [
        "⚡ Design and deployment thinking for cloud-enabled systems, service reliability, and structured application hosting approaches.",
        "⚡ Working with infrastructure reliability, access control, secure deployment practices, and automation-minded workflows.",
        "⚡ Applying cloud and DevOps concepts to improve maintainability, operational readiness, and deployment consistency.",
      ],
      softwareSkills: [
        {
          skillName: "Cloud Architecture",
          fontAwesomeClassname: "simple-icons:googlecloud",
          style: { color: "#4285F4" },
        },
        {
          skillName: "Deployment",
          fontAwesomeClassname: "simple-icons:vercel",
          style: { color: "#000000" },
        },
        {
          skillName: "Security",
          fontAwesomeClassname: "simple-icons:shield",
          style: { color: "#4CAF50" },
        },
        {
          skillName: "Automation",
          fontAwesomeClassname: "simple-icons:githubactions",
          style: { color: "#2088FF" },
        },
      ],
    },
    {
      title: "Technology Programme Support",
      fileName: "DesignImg",
      skills: [
        "⚡ Supporting learners and teams through technology adoption, digital skill building, and practical application of software tools.",
        "⚡ Turning technical concepts into accessible learning experiences that fit real-world implementation and community needs.",
        "⚡ Bridging engineering work with programme delivery, monitoring, and stakeholder coordination.",
      ],
      softwareSkills: [
        {
          skillName: "UX Thinking",
          fontAwesomeClassname: "simple-icons:figma",
          style: { color: "#F24E1E" },
        },
        {
          skillName: "Project Support",
          fontAwesomeClassname: "simple-icons:trello",
          style: { color: "#0079BF" },
        },
        {
          skillName: "Documentation",
          fontAwesomeClassname: "simple-icons:notion",
          style: { color: "#000000" },
        },
      ],
    },
  ],
};

// Education Page
const competitiveSites = {
  competitiveSites: [
    {
      siteName: "freeCodeCamp",
      iconifyClassname: "simple-icons:freecodecamp",
      style: {
        color: "#000000",
      },
      profileLink: "https://www.freecodecamp.org/pcodesdev",
    },
    {
      siteName: "HackerRank",
      iconifyClassname: "simple-icons:hackerrank",
      style: {
        color: "#2EC866",
      },
      profileLink: "https://www.hackerrank.com/profile/njugunapm233",
    },
    {
      siteName: "Cisco",
      iconifyClassname: "simple-icons:cisco",
      style: {
        color: "#000000",
      },
      profileLink: "https://www.netacad.com/portal/profile",
    },
    {
      siteName: "Coursera",
      iconifyClassname: "simple-icons:coursera",
      style: {
        color: "#0056d2",
      },
      profileLink:
        "https://www.coursera.org/user/4d72c50d2d43d84813a81ec603863414",
    },
    {
      siteName: "Google Cloud",
      iconifyClassname: "devicon:googlecloud",
      style: {
        color: "#ea4535",
      },
      profileLink:
        "https://www.credly.com/badges/74673ffa-2e93-44b2-b287-cb146c5e41f7/public_url",
    },
    {
      siteName: "AWS",
      iconifyClassname: "skill-icons:aws-dark",
      style: {
        color: "#242938",
      },
      profileLink:
        "https://www.credly.com/badges/c965d339-68ae-4c86-a4c3-e1429ccddf00/public_url",
    },
  ],
};

const degrees = {
  degrees: [
    {
      title: "Scrimba",
      subtitle: "The Frontend Developer Career Path",
      logo_path: "simple-icons--scrimba.png",
      alt_name: "Scrimba Logo",
      duration: "2024 (Completed)",
      descriptions: [
        "⚡ Completed the Frontend Developer Career Path, a structured course covering frontend development foundations",
        "⚡ Course topics include React, JavaScript, HTML, CSS, Git/GitHub, and accessibility fundamentals",
        "⚡ Practiced responsive layouts, component-based interfaces, and frontend workflows through course exercises",
      ],
      website_link: "https://scrimba.com/u017h29:certs",
    },
    {
      title: "Laikipia University",
      subtitle: "Bsc in Information and Communication Technology",
      logo_path: "LU-Logo.png",
      alt_name: "Laikipia University Nyahururu",
      duration: "2016 - 2020",
      descriptions: [
        "⚡ Software Development & Programming: Python, Java, JavaScript, C++, React.js, Node.js, HTML5, CSS3, Git, GitHub, Visual Studio Code",
        "⚡ Database Management & Data Analysis: MySQL, PostgreSQL, MongoDB, Cassandra, Hadoop, Apache Spark, Tableau, D3.js",
        "⚡ Networking & Cybersecurity: TCP/IP, HTTP/HTTPS, DNS, Wireshark, Nmap, Encryption, Firewalls, IDS, NIST, ISO 27001",
        "⚡ Cloud Computing & DevOps: AWS (EC2, S3, Lambda), Azure, Docker, Kubernetes, Jenkins, GitLab CI, Terraform, Ansible",
        "⚡ Emerging Technologies: Machine Learning (TensorFlow, scikit-learn), Agile (Scrum, Kanban), RESTful APIs, GraphQL",
      ],
      website_link: "https://laikipia.ac.ke/",
    },
  ],
};

const certifications = {
  certifications: [
    {
      title: "Responsive Web Design",
      subtitle: "- freeCodeCamp",
      logo_path: "Freecodecamp.png",
      certificate_link:
        "https://freecodecamp.org/certification/pcodesdev/responsive-web-design",
      alt_name: "freeCodeCamp",
      color_code: "#FFFFFF",
    },
    {
      title: "JavaScript Algorithms and Data Structures",
      subtitle: "- freeCodeCamp",
      logo_path: "Freecodecamp.png",
      certificate_link:
        "https://freecodecamp.org/certification/pcodesdev/javascript-algorithms-and-data-structures",
      alt_name: "freeCodeCamp",
      color_code: "#FFFFFF",
    },
    {
      title: "Frontend Developer (React)",
      subtitle: "- Hackerrank",
      logo_path: "hackerrank.png",
      certificate_link: "https://www.hackerrank.com/certificates/b1765ea2884a",
      alt_name: "hackerrank",
      color_code: "#1f202a",
    },
    {
      title: "Google IT Support",
      subtitle: "- Coursera",
      logo_path: "google.png",
      certificate_link:
        "https://www.credly.com/badges/b9384c32-e908-48fa-bb44-e277cbd623a7/linked_in_profile",
      alt_name: "Google",
      color_code: "#0C9D5899",
    },
    {
      title: "Cloud Digital Leader",
      subtitle: "- Google Cloud",
      logo_path: "google.png",
      certificate_link:
        "https://www.credly.com/badges/74673ffa-2e93-44b2-b287-cb146c5e41f7/public_url",
      alt_name: "Google Cloud",
      color_code: "#0C9D5899",
    },
    {
      title: "Cloud Practitioner",
      subtitle: "- Amazon Web Services",
      logo_path: "aws.png",
      certificate_link:
        "https://www.credly.com/badges/c965d339-68ae-4c86-a4c3-e1429ccddf00/public_url",
      alt_name: "AWS",
      color_code: "#1F70C199",
    },
    {
      title: "Cloud Computing",
      subtitle: "- IBM",
      logo_path: "ibm.png",
      certificate_link:
        "https://www.credly.com/badges/5a658a4d-62d6-4b08-b75c-9f2dea345af2/public_url",
      alt_name: "International Business Machines Corporation",
      color_code: "#FFFFFF",
    },
    {
      title: "Programming Essentials in Python",
      subtitle: "- Cisco Networking Academy",
      logo_path: "cisco.png",
      certificate_link:
        "https://drive.google.com/file/d/18Be5Lj2ElIUDhDnsfdynfOS93xTJotZ9/view?usp=sharing",
      alt_name: "OpenEDG Python Institute",
      color_code: "#00000099",
    },
    {
      title: "NDG Linux Essentials",
      subtitle: "- Cisco Networking Academy",
      logo_path: "cisco.png",
      certificate_link:
        "https://drive.google.com/file/d/1xlC_vVxnWbMZKhEJ8ElNtQejUnws1KF9/view?usp=sharing",
      alt_name: "Linux Professional Institute",
      color_code: "#00000099",
    },
    {
      title: "Google Cloud Platform",
      subtitle: "- Qwiklabs",
      logo_path: "gcp_logo.png",
      certificate_link:
        "https://www.cloudskillsboost.google/public_profiles/6d292a54-28c4-4517-b85b-db75568ecf47",
      alt_name: "GCP",
      color_code: "#4285F499",
    },
    {
      title: "Google Developer Program",
      subtitle: "- Qwiklabs",
      logo_path: "google.png",
      certificate_link: "https://developers.google.com/profile/u/pcodesdev",
      alt_name: "Google Developer Program",
      color_code: "#4285F499",
    },
    {
      title: "Huawei Seeds for the Future",
      subtitle: "- Huawei",
      logo_path: "huawei.png",
      certificate_link:
        "https://drive.google.com/file/d/1Ak30KTFViHOYhSIKXHsnAVmpZQLL3Jwk/view?usp=sharing",
      alt_name: "Huawei",
      color_code: "#FF8A8A",
    },
    {
      title: "Training of Trainers(TOT)",
      subtitle: "- Tallinn University",
      logo_path: "tallinn.png",
      certificate_link:
        "https://drive.google.com/file/d/1mZ5I-JuBquqlQFxnZTU68T6bstLfSYm4/view?usp=sharing",
      alt_name: "Tallinn University",
      color_code: "#2E073F",
    },
  ],
};

// Experience Page
const experience = {
  title: "Professional Experience",
  subtitle:
    "Digital skills, EdTech, workforce development, data systems, and software delivery",
  description:
    "My experience connects digital skills and learning programmes with workforce development, software engineering, data systems, and technology training. At Finn Church Aid Kenya, I progressed from Project Assistant / Digital Skills Trainer to Project Officer – Digital Skills. Earlier roles at Realfield Limited and Kenya Power demonstrate data-quality engineering and practical digital-tool adoption support.",
  header_image_path: "experience.svg",
  sections: [
    {
      title: "Work Experience",
      work: true,
      experiences: [
        {
          title: "Project Officer – Digital Skills",
          company: "Finn Church Aid Kenya",
          company_url:
            "https://www.linkedin.com/company/finn-church-aid/mycompany/",
          logo_path: "fca.png",
          duration: "December 2024 - Present",
          location: "Kakuma & Dadaab, Kenya",
          description:
            "Coordinate implementation workplans, onboarding, training schedules, attendance, mentorship, learner progress, and follow-up across hubs. Organize learning resources and assessments; use programme data to monitor delivery and prepare reports; and coordinate UNICEF, Ajira Digital, UNHCR, DRC, government, private-sector, and community partners. Support LMS, blended, and AI-assisted learning across tracks in graphic design, 3D animation, web development, and digital marketing.",
          achievements: [
            "500+ refugee and host-community youth supported in training; approximately 70% are women and girls.",
            "1,800+ junior and senior secondary school learners reached annually through STEM and digital-skills bootcamps; coordinate and supervise 12+ trainers, facilitators, and consultants.",
            "Reported placement success in this role: 50%, through employment, apprenticeships, freelancing, and livelihoods.",
          ],
          color: "#0C9D58",
        },
        {
          title: "Project Assistant / Digital Skills Trainer",
          company: "Finn Church Aid",
          company_url:
            "https://www.linkedin.com/company/finn-church-aid/mycompany/",
          logo_path: "fca.png",
          duration: "January 2022 - November 2024",
          location: "Nairobi & Kakuma, Kenya",
          description:
            "Delivered hands-on digital literacy and ICT training across graphic design, illustration, 3D animation, motion design, web development, and digital marketing. Supported session planning, blended delivery, LMS use, assignment tracking, onboarding, mentorship, career readiness, portfolios, learner follow-up, and ICT troubleshooting.",
          achievements: [
            "600+ learners trained in digital literacy and ICT.",
            "Reported placement success in this role: 60%, through jobs, apprenticeships, freelancing, and entrepreneurship; separate from the Project Officer’s 50% figure.",
            "Supported the introduction and use of an LMS to improve learning access, participation, and continuity.",
          ],
          color: "#0C9D58",
        },
        {
          title: "Data Specialist",
          company: "Realfield Limited",
          company_url: "https://www.linkedin.com/company/realfield-limited/",
          logo_path: "realfield.jpeg",
          duration: "March 2021 - December 2021",
          location: "Nakuru, Kenya (Remote)",
          description:
            "Collected, cleaned, validated, and analyzed data to improve data quality and reporting reliability. Implemented machine-learning approaches for anomaly detection and supported responsible data management through governance and audit-readiness practices.",
          achievements: [
            "Designed data-collection systems processing 500,000+ records with 99.7% accuracy.",
            "Developed automated validation pipelines that reduced manual verification time by 80%.",
          ],
          color: "#0879bf",
        },
        {
          title: "ICT Technical Associate",
          company: "Kenya Power and Lighting Company",
          company_url: "https://www.linkedin.com/company/kenya-power",
          logo_path: "kplc.png",
          duration: "January 2021 - March 2021",
          location: "Nakuru, Kenya",
          description:
            "Developed technical documentation, user guides, presentations, and training materials. Translated technical concepts into accessible workshops and step-by-step guidance, and collaborated with IT teams to align learning with system functions and operational workflows.",
          achievements: [
            "Designed and delivered structured technical training for 50+ non-technical staff during digital transformation initiatives.",
            "Improved digital-tool adoption by 30% through targeted training, practical demonstrations, and user support.",
          ],
          color: "#fc1f20",
        },
        {
          title: "Full-Stack Developer",
          company: "Pemanju IT Consulting Services",
          company_url:
            "https://www.linkedin.com/company/pemanju-it-consultancy-services/",
          logo_path: "pemanju.jpeg",
          duration: "May 2018 - Present",
          location: "Nairobi, Kenya",
          description:
            "Design and develop web-based solutions around usability, data integrity, and practical operational workflows. The work spans interface implementation, application logic, structured data handling, and technology consulting, translating user needs into maintainable software. Pemanju Farm Manager is a current example of applying offline-first design and structured records to farm operations.",
          color: "#9b1578",
        },
      ],
    },
    {
      title: "Community & Open Source",
      experiences: [
        {
          title: "Developer Program Member",
          company: "GitHub",
          company_url: "https://github.com/",
          logo_path: "github_logo.png",
          duration: "July 2017 - Present",
          location: "Remote",
          description:
            "Participate in developer-community and open-source work through issue reports, pull requests, and documentation contributions. This provides ongoing practice with collaborative repository workflows and feedback from project maintainers.",
          color: "#181717",
        },
      ],
    },
  ],
};

const projectCaseStudy = {
  title: "Pemanju Farm Manager",
  tag: "Flagship engineering case study",
  summary:
    "An offline-first livestock management application designed to improve record keeping, animal traceability, and practical farm operations with a strong emphasis on reliability and data integrity.",
  overview: [
    "Pemanju Farm Manager is a field-oriented livestock management application that helps organize animal records, track operational information, and reduce dependence on fragmented spreadsheet workflows.",
    "The application is built for users working in practical farm environments where digital tools must be reliable, fast, and usable without always having a stable internet connection.",
    "The core significance of the project lies in combining structured data models with offline-first persistence so that essential farm records remain dependable and easier to manage over time.",
  ],
  problem: [
    "Livestock record keeping often becomes fragmented across spreadsheets, manual notes, and inconsistent identifiers.",
    "When animal records are scattered, traceability, relationship integrity, and routine operational updates become harder to trust.",
    "The project addresses this by designing a structured system around animal-centric records, relational data handling, and import/export workflows that fit real farm reporting needs.",
  ],
  solution: [
    "The application uses a relational data model centred on animal identifiers, with structured records for livestock-related operational data. This supports traceability and reduces errors from inconsistent record handling.",
    "Local persistence is handled through Dexie and IndexedDB so the app remains usable in offline farm conditions. Excel import/export is supported to align the system with real-world record-keeping workflows.",
    "The project is intentionally designed to be practical: it supports daily management tasks while keeping the system understandable, maintainable, and aligned to the realities of field operations.",
  ],
  architecture: [
    "User interface and workflows built with React and TypeScript.",
    "Application logic and validation organized around a clear data model for livestock records and relationships.",
    "IndexedDB storage through Dexie enables offline persistence and local workflow continuity.",
    "Excel import and export pipelines are used for data movement and reconciliation.",
    "Planned cloud synchronization with Supabase/PostgreSQL is identified as a future enhancement rather than a confirmed production capability.",
  ],
  challenges: [
    {
      title: "Relational integrity",
      description:
        "Consistent identifiers and validation keep relationships between animals and operational records reliable during edits and imports.",
    },
    {
      title: "Offline-first reliability",
      description:
        "Dexie and IndexedDB support local work when connectivity is unreliable, so routine record updates do not depend on a live connection.",
    },
    {
      title: "Excel data handling",
      description:
        "Import validation and reconciliation account for spreadsheet variation and reduce errors when bringing existing farm records into the app.",
    },
  ],
  implementation:
    "Implemented stack: React, TypeScript, Vite, Tailwind CSS, Dexie, IndexedDB, and SheetJS. Supabase/PostgreSQL cloud sync remains planned.",
  stack: {
    implemented: [
      "React",
      "TypeScript",
      "Vite",
      "Tailwind CSS",
      "Dexie",
      "IndexedDB",
      "SheetJS",
      "Relational record model",
    ],
    planned: [
      "Supabase",
      "PostgreSQL",
      "Cloud synchronization",
      "Expanded production deployment workflows",
    ],
    underDevelopment: [
      "Advanced cloud sync automation",
      "Expanded farm analytics and reporting",
      "Deeper operational integrations",
    ],
  },
  evidence: [
    "Offline-first storage, structured animal records, and Excel import/export.",
    "Local reliability first; cloud synchronization is planned, not deployed.",
    "Designed around day-to-day farm records and workflows.",
  ],
};

// Projects Page
const projectsHeader = {
  title: "Featured Projects",
  description:
    "I focus on practical digital solutions that combine software engineering, operational thinking, and technology-enabled impact. The featured work reflects a mix of product development, platform reliability, and programme-oriented problem solving.",
  avatar_image_path: "projects_image.svg",
};

const publicationsHeader = {
  title: "Technical Articles & Publications",
  description:
    "Selected writing on software engineering, technology adoption, AI, digital products, and practical programming, published on Medium.",
  avatar_image_path: "projects_image.svg",
};

const publications = {
  ...mediumPublications,
  data: limitFeaturedItems(mediumPublications.data),
};

// Contact Page
const contactPageData = {
  contactSection: {
    title: "Contact",
    profile_image_path: "Peter-Illustration.png",
    description:
      "I work across digital transformation and technology solutions, combining digital skills programme delivery, technology-enabled learning, and software development. I am open to roles and projects focused on practical implementation, stakeholder coordination, and workforce development.",
    email: "njugunapm23@gmail.com",
    phone: "+254702913043",
  },
  blogSection: {
    title: "Medium",
    subtitle:
      "Articles on software, digital products, technology, and learning.",
    link: "https://medium.com/@pcodesdev",
    avatar_image_path: "blogs_image.svg",
  },
  addressSection: {
    title: "Address",
    subtitle: "Nairobi, Kenya",
    locality: "Nairobi",
    country: "Kenya",
    region: "Nairobi",
    avatar_image_path: "address_image.svg",
    location_map_link: "https://maps.app.goo.gl/B1LzU1qSUNeWRNYg9",
  },
  phoneSection: {
    title: "Phone",
    subtitle: "+254702913043",
  },
};

export {
  settings,
  seo,
  greeting,
  homeHighlights,
  aboutPageData,
  expertiseAreas,
  projectCaseStudyMeta,
  socialMediaLinks,
  skills,
  competitiveSites,
  degrees,
  certifications,
  experience,
  projectCaseStudy,
  projectsHeader,
  publicationsHeader,
  publications,
  contactPageData,
};
