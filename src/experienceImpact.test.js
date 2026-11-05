import { experience } from "./portfolio";

const workRecords = experience.sections.find((section) => section.work)
  .experiences;
const record = (title) => workRecords.find((item) => item.title === title);

test("FCA Project Officer figures remain attributed to that role", () => {
  const officer = record("Project Officer – Digital Skills");
  const text = officer.achievements.join(" ");

  expect(officer.company).toBe("Finn Church Aid Kenya");
  expect(text).toContain("500+ refugee and host-community youth");
  expect(text).toContain("approximately 70% are women and girls");
  expect(text).toContain(
    "1,800+ junior and senior secondary school learners reached annually"
  );
  expect(text).toContain("12+ trainers, facilitators, and consultants");
  expect(text).toContain("Reported placement success in this role: 50%");
  expect(officer.description).toContain("implementation workplans");
  expect(officer.description).toContain("learner progress");
  expect(officer.description).toContain("prepare reports");
});

test("FCA Project Assistant 600+ learners and 60% rate stay distinct from Officer results", () => {
  const assistant = record("Project Assistant / Digital Skills Trainer");
  const text = assistant.achievements.join(" ");

  expect(assistant.duration).toBe("January 2022 - November 2024");
  expect(text).toContain("600+ learners");
  expect(text).toContain("Reported placement success in this role: 60%");
  expect(text).toContain("separate from the Project Officer’s 50% figure");
  expect(assistant.description).toContain("session planning");
  expect(assistant.description).toContain("assignment tracking");
});

test("Realfield data metrics are attributed to the Data Specialist role", () => {
  const realfield = record("Data Specialist");
  const text = realfield.achievements.join(" ");

  expect(realfield.company).toBe("Realfield Limited");
  expect(realfield.duration).toBe("March 2021 - December 2021");
  expect(text).toContain("500,000+ records");
  expect(text).toContain("99.7% accuracy");
  expect(text).toContain("reduced manual verification time by 80%");
});

test("2021 KPLC ICT Associate remains and the 2017 support role is removed", () => {
  const associate = record("ICT Technical Associate");
  const text = associate.achievements.join(" ");

  expect(associate.company).toBe("Kenya Power and Lighting Company");
  expect(associate.duration).toBe("January 2021 - March 2021");
  expect(text).toContain("50+ non-technical staff");
  expect(text.toLowerCase()).toContain("improved digital-tool adoption by 30%");
  expect(record("IT Technical Support Specialist")).toBeUndefined();
});
