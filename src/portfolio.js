/* Change this file to get your personal Porfolio */

// Website related settings
const settings = {
  isSplash: false, // Change this to false if you don't want Splash screen.
};

//SEO Related settings
const seo = {
  title: "Peter's Portfolio",
  description:
    "A passionate individual who always thrives to work on end to end products which develop sustainable and scalable social and technical systems to create impact.",
  og: {
    title: "Peter Njuguna Portfolio",
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
    "Empowering teams and individuals through technology is my driving force. With over 5 years of experience, I’ve honed expertise in full-stack development (JavaScript, Python, React, Node.js), IT support, digital skills training, and project management. My commitment to fostering tech literacy has seen me successfully train over 500 participants in Nairobi and Turkana, Kenya, achieving a 98% satisfaction rate and a 62% job placement success. As a passionate continuous learner, I’m currently expanding my knowledge in Cloud, AI, and Machine Learning. My strength lies in translating complex technical concepts into accessible, user-friendly solutions, allowing me to bring a powerful combination of technical proficiency and creative problem-solving to any forward-thinking organization. I am dedicated to driving innovation, enhancing efficiency, and delivering results that truly matter.",
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
    link: "https://github.com/pcodesdev",
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
      duration: "2024 - Current",
      descriptions: [
        "⚡ The curriculum is curated by Mozilla MDN, ensuring alignment with the latest industry standards and best practices in modern frontend development. It draws from extensive research on essential skills for new hires.",

        "⚡ The program provides a balanced education between modern tools, such as React and GitHub, and fundamental practices like semantic HTML, JavaScript fundamentals, and accessibility.",

        "⚡ The course includes over a dozen portfolio projects and hundreds of interactive coding challenges, providing practical experience and a strong portfolio to showcase your skills to potential employers.",

        "⚡ The program is designed to be fully self-paced, allowing students to choose between part-time or full-time study to fit their schedules and personal commitments.",

        "⚡ The curriculum benefits from Mozilla MDN's extensive resources, including over 12,000 pages of documentation on HTML, CSS, JavaScript, and other technologies, ensuring that learners have access to comprehensive guides, tutorials, and interactive examples.",

        "⚡ Learners become part of a vibrant community, benefiting from a network of contributors and the shared goal of maintaining high-quality resources and translations, enhancing the learning experience.",
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
        "⚡ Software Development and Programming• Languages: Python, Java, JavaScript, C++• Web technologies: HTML5, CSS3, React.js, Node.js• Version control: Git, GitHub• IDEs: Visual Studio Code, IntelliJ IDEA",
        "⚡ Database Management and Data Analysis• Relational databases: MySQL, PostgreSQL• NoSQL databases: MongoDB, Cassandra• Big data technologies: Hadoop, Apache Spark• Data visualization: Tableau, D3.js",
        "Networking and Cybersecurity• Network protocols: TCP/IP, HTTP/HTTPS, DNS• Network tools: Wireshark, Nmap• Security practices: Encryption, firewalls, intrusion detection systems• Cybersecurity frameworks: NIST, ISO 27001",
        "⚡ Cloud Computing and DevOps• Cloud platforms: AWS (EC2, S3, Lambda), Microsoft Azure• Containerization: Docker, Kubernetes• CI/CD tools: Jenkins, GitLab CI• Infrastructure as Code: Terraform, Ansible",
        "⚡ Emerging Technologies and Software Engineering Practices• Machine Learning libraries: TensorFlow, scikit-learn• Agile methodologies: Scrum, Kanban• API development: RESTful APIs, GraphQL• AI",
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
    "With over a decade of diverse experience, I've made significant contributions across various sectors. As the founder of Pemanju IT Consultancy Services, I offer fullstack development expertise to clients. My portfolio includes project management and digital skills training for NGOs, as well as tech support and data analysis for both private and public organizations. I'm also actively involved in open-source projects, leveraging my skills as a developer and consultant to drive innovation. This multifaceted background allows me to bring a unique blend of technical prowess and strategic insight to every project I undertake.",
  header_image_path: "experience.svg",
  sections: [
    {
      title: "Work",
      work: true,
      experiences: [
        {
          title: "Project Assistant",
          company: "Finn Church Aid",
          company_url:
            "https://www.linkedin.com/company/finn-church-aid/mycompany/",
          logo_path: "fca.png",
          duration: "January 2022 - Present",
          location: "Nairobi, Kenya",
          description:
            " I lead and coordinate a team of 6 technical coaches to deliver comprehensive digital skills training to project participants. I facilitate smooth project operations by ensuring alignment between coaching efforts and project goals, while also providing hands-on technical support to participants to enhance their learning experience. Through proactive collaboration and problem-solving, I continuously improve the effectiveness and efficiency of the digital skills training program.",
          color: "#000000",
        },
        {
          title: "Fullstack Developer",
          company: "Pemanju IT Consulting Services",
          company_url:
            "https://www.linkedin.com/company/pemanju-it-consultancy-services/",
          logo_path: "pemanju.jpeg",
          duration: "May 2018 - Oct 2018",
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
    "My projects makes use of vast variety of latest technology tools. My best experience is to create Data Science projects and deploy them to web applications using cloud infrastructure.",
  avatar_image_path: "projects_image.svg",
};

const publicationsHeader = {
  title: "Publications",
  description: "Some of my published Articles, Blogs and Research.",
  avatar_image_path: "projects_image.svg",
};

const publications = {
  data: [
    {
      id: "neuro-symbolic-sudoku-solver",
      name: "Neuro-Symbolic Sudoku Solver",
      createdAt: "2023-07-02T00:00:00Z",
      description: "Paper published in KDD KiML 2023",
      url: "https://arxiv.org/abs/2307.00653",
    },
    {
      id: "mdp-diffusion",
      name: "MDP-Diffusion",
      createdAt: "2023-09-19T00:00:00Z",
      description: "Blog published in Paperspace",
      url: "https://blog.paperspace.com/mdp-diffusion/",
    },
    {
      id: "consistency-models",
      name: "Consistency Models",
      createdAt: "2023-10-12T00:00:00Z",
      description: "Blog published in Paperspace",
      url: "https://blog.paperspace.com/consistency-models/",
    },
  ],
};

// Contact Page
const contactPageData = {
  contactSection: {
    title: "Contact Me",
    profile_image_path: "animated_ashutosh.png",
    description:
      "I am available on almost every social media. You can message me, I will reply within 24 hours. I can help you with ML, AI, React, Android, Cloud and Opensource Development.",
  },
  blogSection: {
    title: "Blogs",
    subtitle:
      "I like to document some of my experiences in professional career journey as well as some technical knowledge sharing.",
    link: "https://blogs.ashutoshhathidara.com/",
    avatar_image_path: "blogs_image.svg",
  },
  addressSection: {
    title: "Address",
    subtitle: "Saratoga Ave, San Jose, CA, USA 95129",
    locality: "San Jose",
    country: "USA",
    region: "California",
    postalCode: "95129",
    streetAddress: "Saratoga Avenue",
    avatar_image_path: "address_image.svg",
    location_map_link: "https://maps.app.goo.gl/NvYZqa34Wye4tpS17",
  },
  phoneSection: {
    title: "",
    subtitle: "",
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
