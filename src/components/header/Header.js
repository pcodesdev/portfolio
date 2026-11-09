import React, { Component } from "react";
import "./Header.css";
import { Fade } from "../motion/Reveal";
import { NavLink, Link } from "react-router-dom";
import { settings } from "../../portfolio.js";
import SeoHeader from "../seoHeader/SeoHeader";
import logoImage from "../../assests/images/pn-monogram.svg";

const onMouseEnter = (event, backgroundColor, color) => {
  event.currentTarget.style.backgroundColor = backgroundColor;
  event.currentTarget.style.color = color;
};

const onMouseOut = (event, color) => {
  event.currentTarget.style.backgroundColor = "transparent";
  event.currentTarget.style.color = color;
};

class Header extends Component {
  state = { menuOpen: false };

  toggleMobileMenu = () => {
    this.setState((state) => ({ menuOpen: !state.menuOpen }));
  };

  closeMobileMenu = () => {
    this.setState({ menuOpen: false });
  };

  render() {
    const theme = this.props.theme;
    const link = settings.isSplash ? "/splash" : "/home";
    return (
      <Fade top duration={1000} distance="20px">
        <SeoHeader />
        <div>
          <header className="header">
            <NavLink to={link} tag={Link} className="logo">
              <img
                src={logoImage}
                alt="Peter Njuguna PN monogram"
                className="logo-image"
              />
            </NavLink>
            <button
              className="menu-icon"
              type="button"
              aria-label="Toggle navigation"
              aria-expanded={this.state.menuOpen}
              aria-controls="primary-navigation"
              onClick={this.toggleMobileMenu}
              style={{ "--navicon-color": theme.text }}
            >
              <span className="navicon"></span>
            </button>
            <nav
              id="primary-navigation"
              className={`menu${this.state.menuOpen ? " open" : ""}`}
              aria-label="Primary navigation"
              style={{ backgroundColor: theme.body }}
            >
              <ul className="menu-list">
                <li>
                  <NavLink
                    to="/home"
                    tag={Link}
                    activeStyle={{ fontWeight: "bold" }}
                    style={{ color: theme.text }}
                    onClick={this.closeMobileMenu}
                    onMouseEnter={(event) =>
                      onMouseEnter(event, theme.dark, theme.body)
                    }
                    onFocus={(event) =>
                      onMouseEnter(event, theme.dark, theme.body)
                    }
                    onMouseOut={(event) => onMouseOut(event, theme.text)}
                    onBlur={(event) => onMouseOut(event, theme.text)}
                  >
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/about"
                    tag={Link}
                    activeStyle={{ fontWeight: "bold" }}
                    style={{ color: theme.text }}
                    onClick={this.closeMobileMenu}
                    onMouseEnter={(event) =>
                      onMouseEnter(event, theme.dark, theme.body)
                    }
                    onFocus={(event) =>
                      onMouseEnter(event, theme.dark, theme.body)
                    }
                    onMouseOut={(event) => onMouseOut(event, theme.text)}
                    onBlur={(event) => onMouseOut(event, theme.text)}
                  >
                    About
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/expertise"
                    tag={Link}
                    activeStyle={{ fontWeight: "bold" }}
                    style={{ color: theme.text }}
                    onClick={this.closeMobileMenu}
                    onMouseEnter={(event) =>
                      onMouseEnter(event, theme.dark, theme.body)
                    }
                    onFocus={(event) =>
                      onMouseEnter(event, theme.dark, theme.body)
                    }
                    onMouseOut={(event) => onMouseOut(event, theme.text)}
                    onBlur={(event) => onMouseOut(event, theme.text)}
                  >
                    Expertise
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/projects"
                    tag={Link}
                    activeStyle={{ fontWeight: "bold" }}
                    style={{ color: theme.text }}
                    onClick={this.closeMobileMenu}
                    onMouseEnter={(event) =>
                      onMouseEnter(event, theme.dark, theme.body)
                    }
                    onFocus={(event) =>
                      onMouseEnter(event, theme.dark, theme.body)
                    }
                    onMouseOut={(event) => onMouseOut(event, theme.text)}
                    onBlur={(event) => onMouseOut(event, theme.text)}
                  >
                    Featured Projects
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/experience"
                    tag={Link}
                    activeStyle={{ fontWeight: "bold" }}
                    style={{ color: theme.text }}
                    onClick={this.closeMobileMenu}
                    onMouseEnter={(event) =>
                      onMouseEnter(event, theme.dark, theme.body)
                    }
                    onFocus={(event) =>
                      onMouseEnter(event, theme.dark, theme.body)
                    }
                    onMouseOut={(event) => onMouseOut(event, theme.text)}
                    onBlur={(event) => onMouseOut(event, theme.text)}
                  >
                    Professional Experience
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/education"
                    tag={Link}
                    activeStyle={{ fontWeight: "bold" }}
                    style={{ color: theme.text }}
                    onClick={this.closeMobileMenu}
                    onMouseEnter={(event) =>
                      onMouseEnter(event, theme.dark, theme.body)
                    }
                    onFocus={(event) =>
                      onMouseEnter(event, theme.dark, theme.body)
                    }
                    onMouseOut={(event) => onMouseOut(event, theme.text)}
                    onBlur={(event) => onMouseOut(event, theme.text)}
                  >
                    Education & Certifications
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/opensource"
                    tag={Link}
                    activeStyle={{ fontWeight: "bold" }}
                    style={{ color: theme.text }}
                    onClick={this.closeMobileMenu}
                    onMouseEnter={(event) =>
                      onMouseEnter(event, theme.dark, theme.body)
                    }
                    onFocus={(event) =>
                      onMouseEnter(event, theme.dark, theme.body)
                    }
                    onMouseOut={(event) => onMouseOut(event, theme.text)}
                    onBlur={(event) => onMouseOut(event, theme.text)}
                  >
                    Open Source
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/contact"
                    tag={Link}
                    activeStyle={{ fontWeight: "bold" }}
                    style={{ color: theme.text }}
                    onClick={this.closeMobileMenu}
                    onMouseEnter={(event) =>
                      onMouseEnter(event, theme.dark, theme.body)
                    }
                    onFocus={(event) =>
                      onMouseEnter(event, theme.dark, theme.body)
                    }
                    onMouseOut={(event) => onMouseOut(event, theme.text)}
                    onBlur={(event) => onMouseOut(event, theme.text)}
                  >
                    Contact
                  </NavLink>
                </li>
              </ul>
            </nav>
          </header>
        </div>
      </Fade>
    );
  }
}
export default Header;
