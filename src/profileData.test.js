import {
  aboutPageData,
  expertiseAreas,
  greeting,
  homeHighlights,
  projectCaseStudyMeta,
  seo,
} from "./profileData";

test("professional identity includes AI engineering and project management alongside core specializations", () => {
  expect(greeting.nickname).toBe(
    "Digital Transformation & Technology Solutions Professional"
  );
  expect(seo.title).toContain(
    "Digital Transformation, Digital Skills & EdTech Kenya"
  );
  expect(seo.og.url).toBe("https://ashutoshhathidara.com/");
  expect(homeHighlights).toEqual([
    "Project Management",
    "AI Engineering & Implementation",
    "EdTech & Digital Learning",
    "Digital Skills & Workforce Development",
    "Full-Stack Development",
    "Cloud Solutions",
  ]);
});

test("expertise defines project management and distinguishes the technical and learning areas", () => {
  expect(expertiseAreas.map((area) => area.title)).toEqual([
    "Project Management",
    "AI Engineering & Implementation",
    "EdTech & digital learning solutions",
    "EdTech solution planning for underserved learners",
    "Digital skills & workforce development",
    "Full-stack development",
    "Data systems & technology solutions",
    "Digital transformation & technology training",
    "Cloud solutions",
  ]);
  expect(expertiseAreas[0].capabilities).toEqual(
    expect.arrayContaining([
      "Project planning and implementation",
      "Workplan development and scheduling",
      "Stakeholder, partner, team, and trainer coordination",
      "Monitoring, evaluation, and reporting",
      "Risk identification and mitigation",
      "Resource coordination",
      "Deliverable and milestone tracking",
    ])
  );
  expect(expertiseAreas[0].evidence).toContain("12+ trainers");
  expect(expertiseAreas[0].evidence).toContain("1,800+ secondary learners");
  expect(expertiseAreas[1].capabilities).toEqual(
    expect.arrayContaining([
      "AI Engineering",
      "AI Implementation & Integration",
      "AI-Assisted Software Development",
      "AI-Powered Workflow Automation",
      "AI Solutions Development",
      "AI Applications in EdTech & Digital Learning",
    ])
  );
  expect(expertiseAreas[3].level).toContain("Planning / conceptual stage");
  expect(expertiseAreas[3].summary).toContain("resource-efficient");
  expect(expertiseAreas[6].evidence).toContain("500,000+");
  expect(expertiseAreas[7].evidence).toContain("50+ non-technical staff");
  expect(expertiseAreas[8].level).toContain("Foundational knowledge");
  expect(expertiseAreas[8].evidence).toContain("remains planned");
});

test("About retains the illustration-supported narrative and avoids unsupported outcome counts", () => {
  expect(aboutPageData.biography.join(" ")).toContain(
    "Digital Transformation & Technology Solutions"
  );
  expect(aboutPageData.biography.join(" ")).toContain("workforce development");
  expect(aboutPageData.biography.join(" ")).toContain(
    "I bring project coordination, AI engineering and implementation"
  );
  expect(aboutPageData.biography.join(" ")).toContain(
    "AI engineering and implementation"
  );
  expect(aboutPageData.value).toContain("programme delivery");
  expect(aboutPageData.biography.join(" ")).not.toMatch(
    /\b\d+\s*(?:learners|participants|placements|percent|%)/i
  );
});

test("remote-area EdTech concept is first-person and explicitly not implemented", () => {
  expect(aboutPageData.edtechPlanning.description).toMatch(
    /I am also in the planning stage/
  );
  expect(aboutPageData.edtechPlanning.description).toMatch(
    /remote and underserved areas/
  );
  expect(aboutPageData.edtechPlanning.description).toMatch(
    /limited or unreliable internet connectivity/
  );
  expect(aboutPageData.edtechPlanning.status).toMatch(
    /planning\/conceptual stage only/i
  );
  expect(aboutPageData.edtechPlanning.status).toMatch(
    /not an implemented or deployed platform/
  );
  expect(aboutPageData.edtechPlanning.status).toMatch(
    /learners are not yet using it/
  );
});

test("About narrative uses first person outside the identity and SEO name fields", () => {
  const narrative = [
    ...aboutPageData.biography,
    aboutPageData.programme.description,
    aboutPageData.value,
  ].join(" ");
  expect(narrative).toMatch(/\bI\b/);
  expect(narrative).toContain("I apply project management");
  expect(narrative).not.toMatch(/\bPeter(?: Njuguna)?\b|\bhe\b|\bhis\b/i);
});

test("SEO configuration targets the configured custom domain and requested Kenya search phrases", () => {
  expect(seo.og.url).toBe("https://ashutoshhathidara.com/");
  expect(seo.title).toBe(
    "Peter Njuguna | Digital Transformation, Digital Skills & EdTech Kenya"
  );
  expect(seo.keywords).toContain("Peter Njuguna Digital Skills");
  expect(seo.keywords).toContain("Digital Learning Solutions Kenya");
  expect(seo.keywords).toContain("Software Developer Kenya");
});

test("Pemanju case study separates verified role and implemented work from planned deployment", () => {
  expect(projectCaseStudyMeta.role).toContain("As Full-Stack Developer");
  expect(projectCaseStudyMeta.status).toContain("Offline-first local records");
  expect(projectCaseStudyMeta.status).toContain("remain planned, not deployed");
});

test("About impact highlights retain employer-specific participant, data, and adoption figures", () => {
  expect(
    new Set(aboutPageData.selectedImpact.map((item) => item.label)).size
  ).toBe(aboutPageData.selectedImpact.length);
  const impact = aboutPageData.selectedImpact
    .map((item) => `${item.label}: ${item.detail}`)
    .join(" ");
  expect(impact).toContain("FCA Kenya | Project Officer – Digital Skills");
  expect(impact).toContain("500+ refugee and host-community youth");
  expect(impact).toContain("approximately 70% of participants");
  expect(impact).toContain("1,800+ secondary learners annually");
  expect(impact).toContain("12+ trainers");
  expect(impact).toContain("reported 50% placement success rate");
  expect(impact).toContain("600+ learners");
  expect(impact).toContain("separate 60% placement success rate");
  expect(impact).toContain("500,000+ records at 99.7% accuracy");
  expect(impact).toContain("reduced manual verification time by 80%");
  expect(impact).toContain("50+ non-technical staff");
  expect(impact).toContain("digital-tool adoption by 30%");
});
