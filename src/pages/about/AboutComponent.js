import React, { Component } from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import TopButton from "../../components/topButton/TopButton";
import { Fade } from "../../components/motion/Reveal";
import { aboutPageData } from "../../portfolio";
import biographyIllustration from "../../assests/images/push-to-production.svg";
import "../profilePages.css";

class AboutComponent extends Component {
  render() {
    const theme = this.props.theme;
    const data = aboutPageData;

    return (
      <div className="about-main">
        <Header theme={theme} />
        <main className="profile-page" style={{ color: theme.text }}>
          <Fade bottom duration={400}>
            <header className="profile-page-heading">
              <h1>{data.title}</h1>
              <p style={{ color: theme.secondaryText }}>
                A professional story shaped by ICT, project coordination,
                digital skills programme implementation, technology-enabled
                learning, and software development.
              </p>
            </header>
          </Fade>

          <Fade bottom duration={430} delay={40}>
            <section
              className="profile-section about-biography"
              aria-labelledby="about-biography-heading"
            >
              <h2 id="about-biography-heading">Professional biography</h2>
              <div className="about-biography-layout">
                <div className="about-biography-copy">
                  {data.biography.map((paragraph) => (
                    <p key={paragraph} style={{ color: theme.secondaryText }}>
                      {paragraph}
                    </p>
                  ))}
                </div>
                <figure className="about-biography-image">
                  <img
                    src={biographyIllustration}
                    alt="Illustration of a technology professional preparing a web application for production"
                    width="888"
                    height="880"
                    loading="lazy"
                    decoding="async"
                  />
                  <figcaption style={{ color: theme.secondaryText }}>
                    “Push to Production” illustration by{" "}
                    <a
                      href="https://undraw.co/illustrations"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      unDraw
                    </a>
                  </figcaption>
                </figure>
              </div>
            </section>
          </Fade>

          <Fade bottom duration={430}>
            <section
              className="profile-section"
              aria-labelledby="professional-journey-heading"
            >
              <h2 id="professional-journey-heading">Professional journey</h2>
              <ol className="journey-list">
                {data.journey.map((step) => (
                  <li className="journey-item" key={step.title}>
                    <h3>{step.title}</h3>
                    <p style={{ color: theme.secondaryText }}>{step.detail}</p>
                  </li>
                ))}
              </ol>
            </section>
          </Fade>

          <Fade bottom duration={430}>
            <section
              className="profile-section"
              aria-labelledby="programme-heading"
            >
              <h2 id="programme-heading">{data.programme.title}</h2>
              <div className="programme-panel">
                <p style={{ color: theme.secondaryText }}>
                  {data.programme.description}
                </p>
                <h3>From learning to livelihood</h3>
                <ol className="programme-pathway">
                  {data.programme.pathway.map((stage) => (
                    <li key={stage}>{stage}</li>
                  ))}
                </ol>
                <h3>Learning areas</h3>
                <ul className="programme-tracks">
                  {data.programme.tracks.map((track) => (
                    <li key={track}>{track}</li>
                  ))}
                </ul>
              </div>
            </section>
          </Fade>

          <Fade bottom duration={430}>
            <section
              className="profile-section"
              aria-labelledby="selected-impact-heading"
            >
              <h2 id="selected-impact-heading">
                Selected programme and technical impact
              </h2>
              <ul className="impact-list">
                {data.selectedImpact.map((item) => (
                  <li className="impact-item" key={item.label}>
                    <strong>{item.label}</strong>
                    <p style={{ color: theme.secondaryText }}>{item.detail}</p>
                  </li>
                ))}
              </ul>
            </section>
          </Fade>

          <Fade bottom duration={430}>
            <section
              className="profile-section edtech-planning"
              aria-labelledby="edtech-planning-heading"
            >
              <h2 id="edtech-planning-heading">{data.edtechPlanning.title}</h2>
              <p style={{ color: theme.secondaryText }}>
                {data.edtechPlanning.description}
              </p>
              <ul>
                {data.edtechPlanning.considerations.map((consideration) => (
                  <li
                    key={consideration}
                    style={{ color: theme.secondaryText }}
                  >
                    {consideration}
                  </li>
                ))}
              </ul>
              <p className="expertise-level">{data.edtechPlanning.status}</p>
            </section>
          </Fade>

          <Fade bottom duration={430}>
            <section
              className="profile-section"
              aria-labelledby="professional-value-heading"
            >
              <h2 id="professional-value-heading">Professional value</h2>
              <p
                className="value-statement"
                style={{ color: theme.secondaryText }}
              >
                {data.value}
              </p>
            </section>
          </Fade>
        </main>
        <Footer theme={theme} />
        <TopButton theme={theme} />
      </div>
    );
  }
}

export default AboutComponent;
