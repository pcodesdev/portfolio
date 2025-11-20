/* Change this file to get your personal Porfolio */

// Website related settings
const settings = {
  isSplash: false, // Change this to false if you don't want Splash screen.
};

//SEO Related settings
const seo = {
  title: "Peter Njuguna | Full Stack Developer & Cloud Architect Portfolio",
  description:
    "Portfolio of Peter Njuguna, Full Stack Developer and Cloud Architect specializing in React, Node.js, Python, AWS, Azure. 5+ years experience building scalable web applications and training 2000+ participants in digital skills across Kenya.",
  og: {
    title: "Peter Njuguna | Full Stack Developer & Cloud Architect",
    type: "website",
    url: "https://pcodesdev.github.io/",
  },
};

//Home Page
const greeting = {
  title: "Peter Njuguna",
  logo_name: "PeterNjuguna",
  nickname: "pcodesdev",
  subTitle:
    "Full Stack Developer & Cloud Architect with 5+ years building scalable web applications. Expert in React, Node.js, Python, AWS, and Azure. Trained 2000+ participants across Nairobi, Kakuma, and Dadaab in digital skills with 98% satisfaction and 62% job placement success. Passionate about AI/ML, cloud technologies, and transforming complex problems into user-friendly solutions. Ready to drive innovation and deliver measurable results.",
  resumeLink: "https://github.com/pcodesdev/",
  portfolio_repository: "https://github.com/pcodesdev/",
  githubProfile: "https://github.com/pcodesdev/",
};

const socialMediaLinks = [
  /* Your Social Media Link */
  // github: "https://github.com/pcodesdev/",
  // linkedin: "https://www.linkedin.com/in/pcodesdev/",
  // gmail: "njugunapm23@gmail.com",
  // gitlab: "https://gitlab.com/pcodesdev",
  // twitter: "https://twitter.com/pcodesdev",

  {
    name: "Github",
    link: "https://github.com/pcodesdev/",
    fontAwesomeIcon: "fa-github", // Reference https://fontawesome.com/icons/github?style=brands
    backgroundColor: "#181717", // Reference https://simpleicons.org/?q=github
  },
  {
    name: "LinkedIn",
    link: "https://www.linkedin.com/in/pcodesdev/",
    fontAwesomeIcon: "fa-linkedin-in", // Reference https://fontawesome.com/icons/linkedin-in?style=brands
    backgroundColor: "#0077B5", // Reference https://simpleicons.org/?q=linkedin
  },
  {
    name: "YouTube",
    link: "https://www.youtube.com/channel/UCkhyflbByfOBOkQ8hA0RoTg",
    fontAwesomeIcon: "fa-youtube", // Reference https://fontawesome.com/icons/youtube?style=brands
    backgroundColor: "#FF0000", // Reference https://simpleicons.org/?q=youtube
  },
  {
    name: "Gmail",
    link: "mailto:njugunapm23@gmail.com",
    fontAwesomeIcon: "fa-google", // Reference https://fontawesome.com/icons/google?style=brands
    backgroundColor: "#D14836", // Reference https://simpleicons.org/?q=gmail
  },
  {
    name: "X-Twitter",
    link: "https://twitter.com/pcodesdev",
    fontAwesomeIcon: "fa-x-twitter", // Reference https://fontawesome.com/icons/x-twitter?f=brands&s=solid
    backgroundColor: "#000000", // Reference https://simpleicons.org/?q=x
  },
];

const skills = {
  data: [
    {
      title: "Digital Skills Training",
      fileName: "DataScienceImg",
      skills: [
        "⚡ I specialize in digital skills training with a strong focus on digital competencies, web design and developemt, digital marketing, and tech support.",
        "⚡ My expertise includes identifying and addressing technical skills gaps, creating industry-standard portfolios, and guiding participants through project-based learning.",
        "⚡ I am dedicated to fostering innovation and entrepreneurship, ensuring that learners are equipped with the necessary skills to excel in the digital economy.",
      ],
      softwareSkills: [
        {
          skillName: "Google Workspace",
          fontAwesomeClassname: "devicon:google",
          style: {
            backgroundColor: "transparent",
          },
        },
        {
          skillName: "Moodle",
          fontAwesomeClassname: "devicon:moodle",
          style: {
            backgroundColor: "transparent",
          },
        },
        {
          skillName: "Replit",
          fontAwesomeClassname: "logos:replit",
          style: {
            backgroundColor: "transparent",
          },
        },
        {
          skillName: "Zoom",
          fontAwesomeClassname: "logos:zoom",
          style: {
            backgroundColor: "white",
            color: "transparent",
          },
        },
        {
          skillName: "Canva",
          fontAwesomeClassname: "devicon:canva",
          style: {
            backgroundColor: "white",
            color: "transparent",
          },
        },
        {
          skillName: "Slack",
          fontAwesomeClassname: "devicon:slack",
          style: {
            backgroundColor: "transparent",
          },
        },
        {
          skillName: "Microsoft Teams",
          fontAwesomeClassname: "logos:microsoft-teams",
          style: {
            backgroundColor: "transparent",
          },
        },
        {
          skillName: "Padlet",
          fontAwesomeClassname: "fa6-brands:padlet",
          style: {
            backgroundColor: "transparent",
            color: "#3776AB",
          },
        },
        {
          skillName: "Notion",
          fontAwesomeClassname: "mingcute:notion-fill",
          style: {
            color: "#000",
          },
        },
        {
          skillName: "One on one coaching",
          fontAwesomeClassname: "mdi:google-classroom",
          style: {
            color: "#000",
          },
        },
      ],
    },
    {
      title: "Full Stack Development",
      fileName: "FullStackImg",
      skills: [
        "⚡ Architecting responsive web frontends leveraging React and Next.js frameworks for seamless cross-device compatibility",
        "⚡ Engineering mobile applications with React Native and Kotlin, optimizing performance and user experience across iOS and Android platforms",
        "⚡ Crafting scalable application backends utilizing Node with Express, Django, and PHP, ensuring efficient server-side logic and data processing",
        "⚡ Designing robust database architectures with MongoDB and MySQL, focusing on high availability, fault tolerance, and data integrity",
        "⚡ Mastering Git version control for efficient collaboration and project history management, and proficiently utilizing GitHub for remote repository hosting and collaborative development workflows",
      ],
      softwareSkills: [
        {
          skillName: "HTML5",
          fontAwesomeClassname: "simple-icons:html5",
          style: {
            color: "#E34F26",
          },
        },
        {
          skillName: "CSS3",
          fontAwesomeClassname: "fa-css3",
          style: {
            color: "#1572B6",
          },
        },
        {
          skillName: "Sass",
          fontAwesomeClassname: "simple-icons:sass",
          style: {
            color: "#CC6699",
          },
        },
        {
          skillName: "JavaScript",
          fontAwesomeClassname: "simple-icons:javascript",
          style: {
            backgroundColor: "#000000",
            color: "#F7DF1E",
          },
        },
        {
          skillName: "ReactJS",
          fontAwesomeClassname: "simple-icons:react",
          style: {
            color: "#61DAFB",
          },
        },
        {
          skillName: "Nextjs",
          fontAwesomeClassname: "logos:nextjs-icon",
          style: {
            color: "#FFFFFF",
          },
        },
        {
          skillName: "Tailwind CSS",
          fontAwesomeClassname: "skill-icons:tailwindcss-light",
          style: {
            color: "#f4f2ed",
          },
        },
        {
          skillName: "Git",
          fontAwesomeClassname: "vscode-icons:file-type-git",
          style: {
            color: "#dd4c35",
          },
        },
        {
          skillName: "GitHub",
          fontAwesomeClassname: "mdi:github",
          style: {
            color: "#000000",
          },
        },
        {
          skillName: "NodeJS",
          fontAwesomeClassname: "devicon-plain:nodejs-wordmark",
          style: {
            color: "#339933",
          },
        },
        {
          skillName: "NPM",
          fontAwesomeClassname: "simple-icons:npm",
          style: {
            color: "#CB3837",
          },
        },
        {
          skillName: "MongoDB",
          fontAwesomeClassname: "logos:mongodb-icon",
          style: {
            color: "#01ec64",
          },
        },
        {
          skillName: "MySQL",
          fontAwesomeClassname: "logos:mysql",
          style: {
            color: "#00758f",
          },
        },
        {
          skillName: "React Native",
          fontAwesomeClassname: "tabler:brand-react-native",
          style: {
            color: "#61DAFB",
          },
        },
        {
          skillName: "Kotlin",
          fontAwesomeClassname: "skill-icons:kotlin-light",
          style: {
            color: "#f4f2ed",
          },
        },
        {
          skillName: "python",
          fontAwesomeClassname: "logos:python",
          style: {
            color: "#f4f2ed",
          },
        },
        {
          skillName: "Django",
          fontAwesomeClassname: "skill-icons:django",
          style: {
            color: "#f4f2ed",
          },
        },
        {
          skillName: "PHP",
          fontAwesomeClassname: "skill-icons:php-dark",
          style: {
            color: "#f4f2ed",
          },
        },
      ],
    },
    {
      title: "Cloud Infrastructure",
      fileName: "CloudInfraImg",
      skills: [
        "⚡ Proficient in orchestrating multi-cloud environments, leveraging the strengths of various cloud platforms for optimized infrastructure deployment",
        "⚡ Expertise in provisioning and managing virtual machine instances for web hosting, coupled with advanced database integration techniques",
        "⚡ Specialized in configuring and optimizing data streaming pipelines between databases and servers across Google Cloud Platform (GCP) and Amazon Web Services (AWS), ensuring high throughput and low latency",
      ],
      softwareSkills: [
        {
          skillName: "GCP",
          fontAwesomeClassname: "devicon:googlecloud",
          style: {
            color: "#4285F4",
          },
        },
        {
          skillName: "AWS",
          fontAwesomeClassname: "simple-icons:amazonaws",
          style: {
            color: "#FF9900",
          },
        },
        {
          skillName: "Heroku",
          fontAwesomeClassname: "devicon:heroku",
          style: {
            color: "#6762a6",
          },
        },
        {
          skillName: "Firebase",
          fontAwesomeClassname: "logos:firebase",
          style: {
            color: "#FFCA28",
          },
        },
      ],
    },
    {
      title: "UI/UX Design",
      fileName: "DesignImg",
      skills: [
        "⚡ Architecting visually stunning user interfaces for mobile and web applications, employing cutting-edge design principles and pixel-perfect precision",
        "⚡ Championing accessibility in digital products, ensuring inclusivity through WCAG compliance and universal design methodologies",
        "⚡ Crafting intuitive application flows and functionalities, leveraging UX research and iterative testing to elevate user experience to unparalleled heights",
      ],
      softwareSkills: [
        {
          skillName: "Adobe XD",
          fontAwesomeClassname: "simple-icons:adobexd",
          style: {
            color: "#FF2BC2",
          },
        },
        {
          skillName: "Figma",
          fontAwesomeClassname: "simple-icons:figma",
          style: {
            color: "#F24E1E",
          },
        },
        {
          skillName: "Penpot",
          fontAwesomeClassname: "simple-icons:penpot",
          style: {
            color: "#000000",
          },
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
        "⚡ Completed comprehensive frontend development training curated by Mozilla MDN, covering modern industry standards and best practices",
        "⚡ Mastered React, JavaScript (ES6+), HTML5, CSS3, Git/GitHub, and accessibility standards through hands-on projects",
        "⚡ Built 12+ portfolio projects and completed hundreds of interactive coding challenges demonstrating practical skills",
        "⚡ Gained expertise in responsive design, component-based architecture, and modern frontend development workflows",
      ],
      website_link:
        "https://v2.scrimba.com/the-frontend-developer-career-path-c0j:details",
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
      alt_name: "Microsoft",
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
  title: "Experience",
  subtitle: "Work, Internship and Volunteership",
  description:
    "Full Stack Developer & Cloud Architect with 5+ years of proven expertise delivering scalable web applications and transformative digital skills training programs. Currently serving as Project Officer Digital Skills at Finn Church Aid Kenya, leading curriculum development and team coordination. Successfully trained 2000+ participants across Nairobi, Kakuma, and Dadaab with 98% satisfaction and 62% job placement rate. Founder of Pemanju IT Consultancy Services, specializing in React, Node.js, Python, AWS, and Azure. Expert in project management, technical training, data analysis, and open-source development. Passionate about leveraging technology to drive innovation and create measurable impact in NGO and private sectors.",
  header_image_path: "experience.svg",
  sections: [
    {
      title: "Work",
      work: true,
      experiences: [
        {
          title: "Project Officer Digital Skills",
          company: "Finn Church Aid Kenya",
          company_url:
            "https://www.linkedin.com/company/finn-church-aid/mycompany/",
          logo_path: "fca.png",
          duration: "December 2024 - Present",
          location: "Nairobi, Kenya",
          description:
            "Oversee day-to-day operations of the FCA Creators Hub (Digital Skills Hub) at NRC YEP Centre, IFO, managing four training streams: Graphic Design, 3D Animation & Motion Design, Web Design & Development, and Digital Marketing. Coordinate cohort enrolment, participant mobilization, attendance tracking, and comprehensive learner support across all programs. Lead infrastructure management including equipment maintenance, software upgrades, hub renovation, branding, and procurement of digital tools and furniture. Supervise and support incentive trainers, ensuring high-quality, industry-aligned learning experiences while addressing performance and professional conduct. Strengthen partnerships with UNICEF, NRC, Ajira Digital/eMobilis, YEP Centre, local schools, and industry experts, facilitating external visits and donor monitoring. Prepare weekly, monthly, and quarterly reports tracking participant outcomes, attendance, performance, retention, and employment pathways. Support alumni transition into freelancing, remote work, entrepreneurship, and employment through portfolio development, career guidance, and networking opportunities. Lead program impact documentation through success stories, video case studies, and photo evidence.",
          color: "#000000",
        },
        {
          title: "Project Assistant",
          company: "Finn Church Aid",
          company_url:
            "https://www.linkedin.com/company/finn-church-aid/mycompany/",
          logo_path: "fca.png",
          duration: "January 2022 - November 2024",
          location: "Nairobi, Kenya",
          description:
            "Led and coordinated a team of 6 technical coaches to deliver comprehensive digital skills training to 2000+ participants across Nairobi, Kakuma, and Dadaab refugee camps. Achieved 98% participant satisfaction rate and 62% job placement success through hands-on technical support and personalized learning approaches. Facilitated smooth project operations by ensuring alignment between coaching efforts and project goals. Implemented continuous improvement initiatives that enhanced training program effectiveness and efficiency by 40%. Provided direct technical mentorship to participants, resulting in measurable skill development and increased employability.",
          color: "#0C9D58",
        },
        {
          title: "Fullstack Developer",
          company: "Pemanju IT Consulting Services",
          company_url:
            "https://www.linkedin.com/company/pemanju-it-consultancy-services/",
          logo_path: "pemanju.jpeg",
          duration: "May 2018 - Present",
          location: "Nairobi, Kenya",
          description:
            "As the founder of Pemanju IT Consulting Services, I spearhead fullstack development projects, delivering tailored solutions to diverse clients. I architect robust web applications, integrating cutting-edge frontend and backend technologies to meet complex business requirements. Additionally, I collaborate closely with clients to analyze their needs, devise strategic technology roadmaps, and implement scalable, efficient systems that drive their digital transformation initiatives.",
          color: "#9b1578",
        },
        {
          title: "Data Specialist",
          company: "Realfield",
          company_url: "https://www.linkedin.com/company/realfield-limited/",
          logo_path: "realfield.jpeg",
          duration: "March 2021 - December2021",
          location: "Naivasha, Kenya",
          description:
            "Orchestrated comprehensive data collection initiatives, implementing rigorous verification processes to ensure data integrity and accuracy across diverse datasets. Spearheaded cross-functional collaboration to establish and maintain high data quality standards, while leveraging advanced analysis tools to enhance data usability. Engineered automated data cleaning scripts and workflows, significantly streamlining processes and boosting overall efficiency in data management operations.",
          color: "#0879bf",
        },

        {
          title: "IT Technical Support Specialist",
          company: "Kenya Power and Lighting Company",
          company_url: "https://www.linkedin.com/company/kenya-power",
          logo_path: "kplc.png",
          duration: "Nov 2017 - Dec 2017",
          location: "Nakuru, Kenya",
          description:
            "At Kenya Power and Lighting Company, I spearheaded the implementation of a robust IT support system, significantly reducing downtime and enhancing operational efficiency. I orchestrated comprehensive training programs for staff, elevating the company's overall technical proficiency and fostering a culture of digital innovation. Additionally, I pioneered the development and deployment of customized software solutions, streamlining internal processes and dramatically improving customer service delivery.",
          color: "#fc1f20",
        },
      ],
    },
    {
      title: "Internships",
      experiences: [
        // At the moment I have no internship engagements
        // {
        //   title: "Machine Learning Intern",
        //   company: "TikTok Inc.",
        //   company_url: "https://www.tiktok.com/en/",
        //   logo_path: "tiktok_logo.png",
        //   duration: "May 2022 - Aug 2022",
        //   location: "San Francisco, USA",
        //   description:
        //     "Building new features on the backend recommendation system, specifically ranking algorithms for Ads that touch hundreds of millions of people around the world. Improving online and offline content ranking algorithms by performing hard sample data replays for training steps.",
        //   color: "#000000",
        // },
        // {
        //   title: "Data Science Research Intern",
        //   company: "Delhivery Pvt. Ltd.",
        //   company_url: "https://www.delhivery.com/",
        //   logo_path: "delhivery_logo.png",
        //   duration: "May 2019 - Sept 2019",
        //   location: "Gurgaon, Haryana",
        //   description:
        //     "I have worked on project of predicting freight rates based on previous data. There were two objectives: (1) To build a forecasting engine to predict daily freight rates. (2) To embed feature in the model which can explain the seasonal major changes in freight rate based on regions and locations. I have closely worked with deep learning models in combination with statistical methods to create solution for this. At the end of internship, I had created model deployed on AWS EC2 with the use of Kafka stream jobs, ElasticSearch and PostgreSQL.",
        //   color: "#ee3c26",
        // },
        // {
        //   title: "Data Science Intern",
        //   company: "Intel Indexer LLC",
        //   company_url:
        //     "https://opencorporates.com/companies/us_dc/EXTUID_4170286",
        //   logo_path: "intel_logo.jpg",
        //   duration: "Nov 2018 - Dec 2018",
        //   location: "Work From Home",
        //   description:
        //     "This is financial Solution Company. I have made Supervised Learning model for the company which can perform time series analysis on Stock price data for 32 companies. I have built LSTM Neural Networks Model and trained the data of 32 companies for last 2 years. This model is also used for forecasting.",
        //   color: "#0071C5",
        // },
      ],
    },
    {
      title: "Volunteerships",
      experiences: [
        // {
        //   title: "Google Explore ML Facilitator",
        //   company: "Google",
        //   company_url: "https://about.google/",
        //   logo_path: "google_logo.png",
        //   duration: "June 2019 - April 2020",
        //   location: "Hyderabad, Telangana",
        //   description:
        //     "Explore Machine Learning (ML) is a Google-sponsored program for university students to get started with Machine Learning. The curriculum offers 3 tracks of ML Content (Beginner, Intermediate, Advanced) and relies on university student facilitators to train other students on campus and to build opensource projects under this program.",
        //   color: "#4285F4",
        // },
        // {
        //   title: "Microsoft Student Partner",
        //   company: "Microsoft",
        //   company_url: "https://www.microsoft.com/",
        //   logo_path: "microsoft_logo.png",
        //   duration: "Aug 2019 - May 2020",
        //   location: "Hyderabad, Telangana",
        //   description:
        //     "Microsoft Student Partner is a program for university students to lead the awareness and use of Cloud especially Azure tools in the development of their projects and startups. Under this program, I have organised hands on workshops and seminars to teach Cloud Computing concepts to students.",
        //   color: "#D83B01",
        // },
        // {
        //   title: "Mozilla Campus Captain",
        //   company: "Mozilla",
        //   company_url: "https://www.mozilla.org/",
        //   logo_path: "mozilla_logo.png",
        //   duration: "Oct 2019 - May 2020",
        //   location: "Kurnool, Andhra Pradesh",
        //   description:
        //     "My responsibility for this program was to create opensource environment in college and in the city. We have organised multiple hackathons on the problems collected by ordinary people from Kurnool city. We have build opensource community of our own college. The community is available at dsc_iiitdmk on github.",
        //   color: "#000000",
        // },
        // {
        //   title: "Developer Students Club Member",
        //   company: "DSC IIITDM Kurnool",
        //   company_url:
        //     "https://www.linkedin.com/company/developer-students-club-iiitdm-kurnool",
        //   logo_path: "dsc_logo.png",
        //   duration: "Jan 2018 - May 2020",
        //   location: "Kurnool, Andhra Pradesh",
        //   description:
        //     "We have well established developer club in college which is directly associated with Google Developers. We have developed many interdisciplinary projects under the membership of this club. We have organised workshops and activities on Android Application Development, Flutter and React JS.",
        //   color: "#0C9D58",
        // },
        {
          title: "Developer Program Member",
          company: "Github",
          company_url: "https://github.com/",
          logo_path: "github_logo.png",
          duration: "July 2017 - Present",
          location: "Remote",
          description:
            "I actively contribute to a diverse array of open-source projects, leveraging cutting-edge technologies and best practices in software development. My contributions span from healthcare informatics in Hospital Management Systems to educational technology in Free Open Source Courses, as well as technical content creation through tech blogging and the development of this portfolio as an open-source, globally accessible resource for developers. These contributions encompass critical bug fixes, innovative feature implementations, and the creation of comprehensive documentation, all adhering to industry standards and employing modern development workflows such as Git version control and continuous integration/continuous deployment (CI/CD) pipelines.",
          color: "#181717",
        },
      ],
    },
  ],
};

// Projects Page
const projectsHeader = {
  title: "Projects",
  description:
    "Full-stack developer specializing in building scalable web applications using React, Node.js, Python, and modern JavaScript frameworks. Expert in cloud deployment on AWS and Azure, containerization with Docker, and implementing CI/CD pipelines. Portfolio showcases end-to-end project development from UI/UX design to production deployment, demonstrating proficiency in responsive design, API development, database architecture, and performance optimization.",
  avatar_image_path: "projects_image.svg",
};

const publicationsHeader = {
  title: "Publications",
  description:
    "Technical articles and tutorials on web development, React, JavaScript, Git, and software engineering best practices. Published on Medium and Hashnode, helping developers solve real-world coding challenges.",
  avatar_image_path: "projects_image.svg",
};

const publications = {
  data: [
    {
      id: "Tic-Tac-Toe-game-using-react",
      name: "Create a Tic-Tac-Toe game using react",
      createdAt: "2023-01-18T00:00:00Z",
      description:
        "Step-by-step tutorial on building an interactive Tic-Tac-Toe game using React hooks, state management, and component-based architecture. Learn game logic implementation and React best practices.",
      url:
        "https://pcodesdev.hashnode.dev/projectcreate-a-tic-tac-toe-game-using-react",
    },
    {
      id: "push-files-over-100MB-to-github",
      name: "How to Push Files Over 100MB to GitHub",
      createdAt: "2023-04-21T00:00:00Z",
      description:
        "Comprehensive guide to using Git Large File Storage (LFS) for managing large files in GitHub repositories. Includes installation, configuration, and troubleshooting common issues with file size limits.",
      url:
        "https://pcodesdev.hashnode.dev/how-to-push-files-over-100mb-to-github-a-step-by-step-guide-with-git-large-file-storage-lfs",
    },
    {
      id: "mastering-git-and-github",
      name: "Mastering Git and Github",
      createdAt: "2023-05-12T00:00:00Z",
      description:
        "Essential Git and GitHub concepts for successful version control. Covers branching strategies, pull requests, merge conflicts, collaboration workflows, and best practices for professional software development.",
      url:
        "https://pcodesdev.hashnode.dev/mastering-git-and-github-key-concepts-you-need-to-know-for-successful-version-control",
    },
    {
      id: "medium-blog",
      name: "Follow me on Medium",
      createdAt: "2024-01-01T00:00:00Z",
      description:
        "Technical articles, tutorials, and insights on full-stack development, cloud architecture, digital skills training, and software engineering best practices. Join my community of developers learning and growing together.",
      url: "https://medium.com/@pcodesdev",
    },
  ],
};

// Contact Page
const contactPageData = {
  contactSection: {
    title: "Contact Me",
    profile_image_path: "Peter-Illustration.png",
    description:
      "I am a Full Stack Developer and Cloud Architect available for freelance projects, consultancy, and full-time opportunities. With expertise in React, Node.js, Python, AWS, and Azure, I help businesses build scalable web applications and cloud solutions. Whether you need a technical consultant, a digital skills trainer, or a lead developer for your next big idea, I'm here to help. Connect with me to discuss your project requirements.",
    email: "njugunapm23@gmail.com",
    phone: "+254702913043",
  },

  blogSection: {
    title: "Blogs",
    subtitle:
      "I document my journey in software engineering, cloud architecture, and digital skills training. Check out my technical articles and tutorials on web development and DevOps.",
    link: "https://hashnode.com/@PcodesDev",
    avatar_image_path: "blogs_image.svg",
  },
  addressSection: {
    title: "Address",
    subtitle: "Nairobi, Kenya",
    locality: "Nairobi",
    country: "Kenya",
    region: "Nairobi",
    postalCode: "0100",
    streetAddress: "Charles New Road",
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
  socialMediaLinks,
  skills,
  competitiveSites,
  degrees,
  certifications,
  experience,
  projectsHeader,
  publicationsHeader,
  publications,
  contactPageData,
};
