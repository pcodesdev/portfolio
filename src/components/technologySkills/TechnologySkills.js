import React from "react";
import { Fade } from "../motion/Reveal";
import { technologySkillCategories } from "../../technologySkills";
import "./TechnologySkills.css";

export default function TechnologySkills({ theme }) {
  const sectionRef = React.useRef(null);

  React.useEffect(() => {
    if (window.Iconify && typeof window.Iconify.scanDOM === "function") {
      window.Iconify.scanDOM(sectionRef.current);
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      className="technology-skills-section"
      aria-labelledby="technology-skills-heading"
    >
      <Fade bottom duration={420}>
        <header className="technology-skills-heading">
          <h2 id="technology-skills-heading">
            Technologies, Tools &amp; Professional Skills
          </h2>
          <p style={{ color: theme.secondaryText }}>
            A practical overview of technologies, delivery methods, and tools
            related to my work. Inclusion indicates familiarity, not equal
            proficiency, certification, or production experience.
          </p>
        </header>
      </Fade>

      <div className="technology-categories">
        {technologySkillCategories.map((category, categoryIndex) => (
          <Fade
            bottom
            duration={440}
            delay={(categoryIndex % 2) * 70}
            key={category.id}
          >
            <section
              className="technology-category"
              aria-labelledby={`technology-category-${category.id}`}
              style={{ borderColor: `${theme.text}2e` }}
            >
              <header className="technology-category-heading">
                <h3 id={`technology-category-${category.id}`}>
                  {category.title}
                </h3>
                {category.description ? (
                  <p style={{ color: theme.secondaryText }}>
                    {category.description}
                  </p>
                ) : null}
              </header>

              {category.groups.map((group, groupIndex) => (
                <div
                  className="technology-group"
                  key={`${category.id}-${group.title}`}
                >
                  {category.groups.length > 1 ? <h4>{group.title}</h4> : null}
                  <ul className="technology-icon-grid" aria-label={group.title}>
                    {group.items.map((item, itemIndex) => {
                      const tooltipId = `technology-tooltip-${category.id}-${groupIndex}-${itemIndex}`;
                      const accessibleName = `${item.name}${
                        item.kind === "competency"
                          ? " professional competency"
                          : item.kind === "tool"
                          ? " tool"
                          : " technology"
                      }`;
                      return (
                        <li className="technology-icon-item" key={item.name}>
                          <span
                            className="technology-icon-tile"
                            role="img"
                            tabIndex={0}
                            aria-label={accessibleName}
                            aria-describedby={tooltipId}
                            title={item.name}
                            style={{
                              color: theme.text,
                              backgroundColor: theme.body,
                              borderColor: `${theme.text}30`,
                              "--technology-icon-color":
                                item.color || theme.dark,
                              "--technology-tooltip-bg": theme.dark,
                            }}
                          >
                            <span
                              className="iconify technology-icon-graphic"
                              data-icon={item.icon}
                              data-inline="false"
                              aria-hidden="true"
                            />
                            <span className="technology-icon-name">
                              {item.name}
                            </span>
                            <span
                              className="technology-icon-tooltip"
                              id={tooltipId}
                              role="tooltip"
                            >
                              {item.name}
                            </span>
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </section>
          </Fade>
        ))}
      </div>
    </section>
  );
}
