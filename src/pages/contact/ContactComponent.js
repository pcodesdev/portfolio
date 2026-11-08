import React, { Component } from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import TopButton from "../../components/topButton/TopButton";
import SocialMedia from "../../components/socialMedia/SocialMedia";
import { Fade } from "../../components/motion/Reveal";
import "./ContactComponent.css";
import { contactPageData } from "../../portfolio.js";

const ContactData = contactPageData.contactSection;
const formSubmitId = "fd0f16a5813fab5fc42aa4d5668cb7c6";

class Contact extends Component {
  state = { isSubmitting: false, status: "", statusMessage: "" };

  componentDidUpdate(previousProps, previousState) {
    if (previousState.statusMessage !== this.state.statusMessage) {
      clearTimeout(this.statusTimeout);
      if (this.state.statusMessage) {
        this.statusTimeout = setTimeout(() => {
          this.setState({ status: "", statusMessage: "" });
        }, 60000);
      }
    }
  }

  componentWillUnmount() {
    clearTimeout(this.statusTimeout);
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (this.state.isSubmitting || !form.reportValidity()) return;

    this.setState({ isSubmitting: true, status: "", statusMessage: "" });

    try {
      const response = await fetch(
        `https://formsubmit.co/ajax/${formSubmitId}`,
        {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
        }
      );
      const result = await response.json();
      const accepted = result.success === true || result.success === "true";

      if (!response.ok || !accepted) {
        throw new Error(
          result.message || "The form provider did not accept the message."
        );
      }

      form.reset();
      this.setState({
        isSubmitting: false,
        status: "success",
        statusMessage: "Your message has been sent. Thank you!",
      });
    } catch (error) {
      this.setState({
        isSubmitting: false,
        status: "error",
        statusMessage: `Your message couldn't be sent. Please try again or email Peter directly at ${ContactData.email}.`,
      });
    }
  };

  render() {
    const theme = this.props.theme;
    const phone = contactPageData.contactSection.phone;

    return (
      <div className="contact-main">
        <Header theme={theme} />
        <main className="basic-contact">
          <Fade bottom duration={1000} distance="24px">
            <section className="contact-intro">
              <h1
                className="contact-heading-text"
                style={{ color: theme.text }}
              >
                {ContactData.title}
              </h1>
              <p
                className="contact-header-detail-text subTitle"
                style={{ color: theme.secondaryText }}
              >
                {ContactData.description}
              </p>
              <div className="contact-direct-links">
                <a href={`mailto:${ContactData.email}`}>{ContactData.email}</a>
                <a href={`tel:${phone}`}>{phone}</a>
              </div>
              <SocialMedia theme={theme} />
            </section>
          </Fade>

          <section className="contact-form-section">
            <h2 style={{ color: theme.text }}>Send a message</h2>
            <form
              className="contact-form"
              action={`https://formsubmit.co/${formSubmitId}`}
              method="POST"
              onSubmit={this.handleSubmit}
            >
              <input type="hidden" name="_template" value="table" />
              <label className="contact-honeypot" aria-hidden="true">
                Leave this field empty
                <input
                  type="text"
                  name="_honey"
                  tabIndex="-1"
                  autoComplete="off"
                />
              </label>
              <label className="contact-field" htmlFor="contact-name">
                Name
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  maxLength="100"
                  required
                  style={{ color: theme.text, backgroundColor: theme.body }}
                />
              </label>
              <label className="contact-field" htmlFor="contact-email">
                Email address
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  maxLength="254"
                  required
                  style={{ color: theme.text, backgroundColor: theme.body }}
                />
              </label>
              <label
                className="contact-field contact-field-wide"
                htmlFor="contact-subject"
              >
                Subject
                <input
                  id="contact-subject"
                  name="_subject"
                  type="text"
                  maxLength="150"
                  required
                  style={{ color: theme.text, backgroundColor: theme.body }}
                />
              </label>
              <label
                className="contact-field contact-field-wide"
                htmlFor="contact-message"
              >
                Message
                <textarea
                  id="contact-message"
                  name="message"
                  rows="7"
                  maxLength="5000"
                  required
                  style={{ color: theme.text, backgroundColor: theme.body }}
                />
              </label>
              <button
                type="submit"
                className="contact-submit"
                disabled={this.state.isSubmitting}
                style={{ "--contact-submit-bg": theme.dark }}
              >
                {this.state.isSubmitting ? "Sending..." : "Send Message"}
              </button>
              <div role="status" aria-live="polite" aria-atomic="true" className="contact-status-region">
                {this.state.statusMessage ? (
                  <p
                    className={`contact-form-status ${this.state.status}`}
                    role={this.state.status === "error" ? "alert" : undefined}
                    style={{ color: theme.text }}
                  >
                    {this.state.statusMessage}
                  </p>
                ) : null}
              </div>
            </form>
          </section>
        </main>
        <Footer theme={theme} onToggle={this.props.onToggle} />
        <TopButton theme={theme} />
      </div>
    );
  }
}

export default Contact;
