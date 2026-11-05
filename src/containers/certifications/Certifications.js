import React, { Component } from "react";
import "./Certifications.css";
import { Fade } from "../../components/motion/Reveal";
import { certifications } from "../../portfolio";
import CertificationCard from "../../components/certificationCard/CertificationCard";

class Certifications extends Component {
  render() {
    const theme = this.props.theme;
    return (
      <div className="main" id="certs">
        <div className="certs-header-div">
          <Fade bottom duration={2000} distance="20px">
            <h2 className="certs-header" style={{ color: theme.text }}>
              Certifications
            </h2>
          </Fade>
        </div>
        <div className="certs-body-div">
          {certifications.certifications.map((cert) => {
            return (
              <CertificationCard
                key={cert.certificate_link || cert.title}
                certificate={cert}
                theme={theme}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

export default Certifications;
