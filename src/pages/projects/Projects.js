import React, { Component } from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import GithubRepoCard from "../../components/githubRepoCard/GithubRepoCard";
import Button from "../../components/button/Button";
import TopButton from "../../components/topButton/TopButton";
import { Fade } from "../../components/motion/Reveal";
import {
  greeting,
  projectsHeader,
  projectCaseStudy,
  projectCaseStudyMeta,
} from "../../portfolio.js";
import ProjectsData from "../../shared/opensource/projects.json";
import { limitFeaturedItems } from "../../shared/featuredItems";
import "./Projects.css";
import ProjectsImg from "./ProjectsImg";

class Projects extends Component {
  render() {
    const theme = this.props.theme;
    return (
      <div className="projects-main">
        <Header theme={theme} />
        <div className="basic-projects">
          <Fade bottom duration={2000} distance="40px">
            <div className="projects-heading-div">
              <div className="projects-heading-img-div">
                <ProjectsImg theme={theme} />
              </div>
              <div className="projects-heading-text-div">
                <h1
                  className="projects-heading-text"
                  style={{ color: theme.text }}
                >
                  {projectsHeader.title}
                </h1>
                <p
                  className="projects-header-detail-text subTitle"
                  style={{ color: theme.secondaryText }}
                >
                  {projectsHeader["description"]}
                </p>
              </div>
            </div>
          </Fade>
        </div>

        <div className="case-study-panel" style={{ color: theme.text }}>
          <div className="case-study-intro">
            <span
              className="case-study-tag"
              style={{ backgroundColor: theme.dark, color: "#ffffff" }}
            >
              {projectCaseStudy.tag}
            </span>
            <h2>{projectCaseStudy.title}</h2>
            <p>{projectCaseStudy.summary}</p>
          </div>

          <div className="case-study-grid">
            <div className="case-study-card">
              <h3>My role</h3>
              <p>{projectCaseStudyMeta.role}</p>
            </div>
            <div className="case-study-card">
              <h3>Current status</h3>
              <p>{projectCaseStudyMeta.status}</p>
            </div>
            <div className="case-study-card">
              <h3>Project overview</h3>
              {projectCaseStudy.overview.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
            <div className="case-study-card">
              <h3>Problem</h3>
              {projectCaseStudy.problem.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
            <div className="case-study-card">
              <h3>Solution</h3>
              {projectCaseStudy.solution.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
            <div className="case-study-card">
              <h3>Architecture</h3>
              <ul>
                {projectCaseStudy.architecture.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="case-study-stack">
            <h3>Technology stack</h3>
            <div className="stack-group">
              <div>
                <h4>Implemented</h4>
                <ul>
                  {projectCaseStudy.stack.implemented.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4>Planned</h4>
                <ul>
                  {projectCaseStudy.stack.planned.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4>Under development</h4>
                <ul>
                  {projectCaseStudy.stack.underDevelopment.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="case-study-card case-study-evidence">
            <h3>Engineering focus</h3>
            {projectCaseStudy.challenges.map((item) => (
              <div key={item.title} className="challenge-item">
                <strong>{item.title}</strong>
                <p>{item.description}</p>
              </div>
            ))}
            <p>{projectCaseStudy.implementation}</p>
            <ul>
              {projectCaseStudy.evidence.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <section
          className="github-repositories"
          aria-labelledby="github-repositories-heading"
        >
          <h2 id="github-repositories-heading">Featured GitHub repositories</h2>
          <div className="repo-cards-div-main">
            {limitFeaturedItems(ProjectsData.data).map((repo, index) => {
              return (
                <GithubRepoCard
                  key={repo.id}
                  repo={repo}
                  theme={theme}
                  revealDelay={(index % 3) * 70}
                />
              );
            })}
          </div>
        </section>
        <Button
          text={"More Projects"}
          className="project-button"
          href={greeting.githubProfile}
          newTab={true}
          theme={theme}
        />

        <Footer theme={this.props.theme} onToggle={this.props.onToggle} />
        <TopButton theme={this.props.theme} />
      </div>
    );
  }
}

export default Projects;
