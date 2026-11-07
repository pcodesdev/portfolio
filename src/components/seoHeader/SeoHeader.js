import React from "react";
import { Helmet } from "react-helmet";
import {
  greeting,
  seo,
  socialMediaLinks,
  experience,
  contactPageData,
  certifications,
  projectCaseStudy,
} from "../../portfolio.js";

function SeoHeader() {
  const pathname = window.location.hash.slice(1).split("?")[0] || "/";
  const canonicalUrl = seo?.og?.url || "https://pcodesdev.github.io/";
  const routeMetadata = {
    "/": {
      title: seo.title,
      description: seo.description,
      keywords: seo.keywords,
    },
    "/home": {
      title: seo.title,
      description: seo.description,
      keywords: seo.keywords,
    },
    "/about": {
      title: "About | Peter Njuguna, Digital Skills & EdTech Kenya",
      description:
        "My professional story spans ICT, digital skills programme delivery, technology implementation, software development, and an EdTech solution currently at the planning stage for remote and underserved learners.",
      keywords:
        "Peter Njuguna Kenya, digital skills professional Kenya, EdTech planning Kenya, digital learning Kenya, technology programme implementation",
    },
    "/expertise": {
      title:
        "Digital Skills, EdTech & Software Expertise | Peter Njuguna Kenya",
      description:
        "Evidence-based capabilities in digital learning implementation, conceptual EdTech planning for underserved learners, digital skills and workforce development, full-stack software, and foundational cloud solutions.",
      keywords:
        "EdTech and digital learning Kenya, digital skills Kenya, workforce development, full-stack developer Kenya, cloud solutions",
    },
    "/projects": {
      title: "Featured Software Projects | Peter Njuguna, Full-Stack Kenya",
      description:
        "Explore my featured software work, including Pemanju Farm Manager, an offline-first livestock records application, alongside selected web projects and technical writing.",
      keywords:
        "Full-Stack Developer Kenya, software developer Kenya, Pemanju Farm Manager, offline-first software, React TypeScript projects",
    },
    "/experience": {
      title: "Digital Skills & Technology Programme Experience | Peter Njuguna",
      description:
        "My professional experience includes digital skills programme implementation at Finn Church Aid Kenya, technology-enabled learning coordination, software development, and IT support.",
      keywords:
        "Digital Skills Professional in Kenya, Technology Programme Officer Kenya, digital learning implementation, workforce development Kenya",
    },
    "/education": {
      title: "Education & Certifications | Peter Njuguna Kenya",
      description:
        "Education, professional learning, and verified certifications.",
      keywords:
        "Peter Njuguna education, ICT Kenya, technology certifications, cloud learning",
    },
    "/opensource": {
      title: "Open Source & GitHub Projects | Peter Njuguna",
      description:
        "View my public GitHub profile and software repositories, including selected work relevant to web development and practical technology solutions.",
      keywords:
        "Peter Njuguna GitHub, software developer Kenya, open-source software, GitHub projects",
    },
    "/contact": {
      title: "Contact Peter Njuguna | Digital Transformation & EdTech Kenya",
      description:
        "Contact me about digital transformation, digital skills and workforce development, EdTech planning, technology programme implementation, and software development.",
      keywords:
        "Contact Peter Njuguna, Digital Transformation Kenya, EdTech Kenya, Digital Skills Kenya, Full-Stack Developer Kenya",
    },
  };
  const metadata = routeMetadata[pathname] || {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
  };
  const sameAs = [
    ...new Set(
      socialMediaLinks
        .filter(
          (media) =>
            !media.link.startsWith("tel:") &&
            !media.link.startsWith("mailto:") &&
            media.link.startsWith("https://")
        )
        .map((media) => media.link)
    ),
  ];
  const mail = socialMediaLinks
    .find((media) => media.link.startsWith("mailto:"))
    ?.link.split(":")[1];
  const job = experience.sections
    ?.find((section) => section.work)
    ?.experiences?.at(0);
  const personId = `${canonicalUrl}#person`;
  const websiteId = `${canonicalUrl}#website`;
  const credentials = certifications.certifications
    .filter(
      (certification) => certification.title && certification.certificate_link
    )
    .map((certification) => ({
      "@type": "EducationalOccupationalCredential",
      url: certification.certificate_link,
      name: certification.title,
      description: certification.subtitle,
    }));
  const projectStructuredData =
    pathname === "/projects"
      ? [
          {
            "@type": "CreativeWork",
            "@id": `${canonicalUrl}#pemanju-farm-manager`,
            name: projectCaseStudy.title,
            description: projectCaseStudy.summary,
            creator: { "@id": personId },
            about: "Offline-first livestock records and farm operations",
            keywords:
              "React, TypeScript, IndexedDB, Dexie, Excel import and export",
          },
        ]
      : [];
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: canonicalUrl,
        name: "Peter Njuguna Portfolio",
        publisher: { "@id": personId },
        inLanguage: "en",
      },
      {
        "@type": "ProfilePage",
        "@id": `${canonicalUrl}#profilepage`,
        url: canonicalUrl,
        name: metadata.title,
        description: metadata.description,
        isPartOf: { "@id": websiteId },
        mainEntity: { "@id": personId },
        inLanguage: "en",
      },
      {
        "@type": "Person",
        "@id": personId,
        name: greeting.title,
        url: canonicalUrl,
        description: seo.description,
        email: mail,
        telephone: contactPageData.phoneSection?.subtitle,
        sameAs,
        jobTitle: greeting.nickname,
        worksFor: job
          ? { "@type": "Organization", name: job.company }
          : undefined,
        address: {
          "@type": "PostalAddress",
          addressLocality: contactPageData.addressSection?.locality,
          addressRegion: contactPageData.addressSection?.region,
          addressCountry: contactPageData.addressSection?.country,
        },
        knowsAbout: [
          "Digital transformation",
          "Digital skills programme delivery",
          "EdTech solution planning",
          "Digital learning implementation",
          "Full-stack software development",
          "Cloud computing fundamentals",
        ],
        hasCredential: credentials,
      },
      ...projectStructuredData,
    ],
  };
  return (
    <Helmet>
      <title>{metadata.title}</title>
      <meta
        name="description"
        content={metadata.description}
        data-react-helmet="true"
      />
      <meta
        name="keywords"
        content={metadata.keywords}
        data-react-helmet="true"
      />
      <meta
        property="og:title"
        content={metadata.title}
        data-react-helmet="true"
      />
      <meta
        property="og:description"
        content={metadata.description}
        data-react-helmet="true"
      />
      <meta
        property="og:type"
        content={seo?.og?.type}
        data-react-helmet="true"
      />
      <meta property="og:url" content={canonicalUrl} data-react-helmet="true" />
      <meta
        property="og:site_name"
        content="Peter Njuguna Portfolio"
        data-react-helmet="true"
      />
      <meta name="twitter:card" content="summary" data-react-helmet="true" />
      <meta
        name="twitter:title"
        content={metadata.title}
        data-react-helmet="true"
      />
      <meta
        name="twitter:description"
        content={metadata.description}
        data-react-helmet="true"
      />
      <link rel="canonical" href={canonicalUrl} data-react-helmet="true" />
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
}

export default SeoHeader;
