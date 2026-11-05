import React, { Component } from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import TopButton from "../../components/topButton/TopButton";
import { expertiseAreas } from "../../portfolio";
import { Fade } from "../../components/motion/Reveal";
import TechnologySkills from "../../components/technologySkills/TechnologySkills";
import "../profilePages.css";

class ExpertiseComponent extends Component {
  render() {
    const theme = this.props.theme;

    return (
      <div className="expertise-main">
        <Header theme={theme} />
        <main className="profile-page" style={{ color: theme.text }}>
          <Fade bottom duration={400}>
            <header className="profile-page-heading">
              <h1>Capabilities in practice</h1>
              <p style={{ color: theme.secondaryText }}>
                I apply project management, digital learning, programme
                delivery, data systems, software engineering, and cloud
                fundamentals in practical work, with evidence and experience
                stage made explicit.
              </p>
            </header>
          </Fade>

          <section
            className="expertise-grid"
            aria-label="Professional capability areas"
          >
            {expertiseAreas.map((area, index) => (
              <Fade
                bottom
                duration={430}
                delay={(index % 2) * 80}
                key={area.number}
              >
                <article className="expertise-area">
                  <header className="expertise-area-header">
                    <span className="expertise-number">{area.number}</span>
                    <h2>{area.title}</h2>
                  </header>
                  <p style={{ color: theme.secondaryText }}>{area.summary}</p>
                  {area.level && (
                    <p className="expertise-level">{area.level}</p>
                  )}
                  <ul className="expertise-capabilities">
                    {area.capabilities.map((capability) => (
                      <li
                        key={capability}
                        style={{ color: theme.secondaryText }}
                      >
                        {capability}
                      </li>
                    ))}
                  </ul>
                  {area.impact ? (
                    <ul
                      className="expertise-impact"
                      aria-label={`${area.title} evidence`}
                    >
                      {area.impact.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                  <p
                    className="expertise-evidence"
                    style={{ color: theme.secondaryText }}
                  >
                    <strong>In practice:</strong> {area.evidence}
                  </p>
                </article>
              </Fade>
            ))}
          </section>
          <TechnologySkills theme={theme} />
        </main>
        <Footer theme={theme} />
        <TopButton theme={theme} />
      </div>
    );
  }
}

export default ExpertiseComponent;
