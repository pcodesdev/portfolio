import React from "react";
import "./Contact.css";
import SocialMedia from "../../components/socialMedia/SocialMedia";
import { contactPageData } from "../../portfolio";

export default function Contact() {
  const { contactSection } = contactPageData;
  return (
    <div className="main contact-margin-top" id="contact">
      <div className="contact-div-main">
        <div className="contact-header">
          <h1 className="heading contact-title">{contactSection.title}</h1>
          <p className="subTitle contact-subtitle contact-description-padding">
            {contactSection.description}
          </p>

          <div className="contact-text-div">
            {contactSection.phone && (
              <>
                <a
                  className="contact-detail"
                  href={"tel:" + contactSection.phone}
                >
                  {contactSection.phone}
                </a>
                <br />
                <br />
              </>
            )}
            <a
              className="contact-detail-email"
              href={"mailto:" + contactSection.email}
            >
              {contactSection.email}
            </a>
            <br />
            <br />
            <SocialMedia />
          </div>
        </div>
        <div className="contact-image-div">
          <img
            alt="Peter Working"
            src={require(`../../assests/images/${contactSection.profile_image_path}`)}
          ></img>
        </div>
      </div>
    </div>
  );
}
