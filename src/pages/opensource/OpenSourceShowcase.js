import React from "react";
import PublicationCard from "../../components/publicationsCard/PublicationCard";
import Button from "../../components/button/Button";
import {
  contactPageData,
  publicationsHeader,
  publications,
} from "../../portfolio.js";
import { limitFeaturedItems } from "../../shared/featuredItems";
import "./OpenSourceShowcase.css";

export function ArticlesSection({ theme }) {
  const articles = limitFeaturedItems(publications.data);
  if (!articles.length) return null;
  return (
    <section
      id="articles"
      className="showcase-section showcase-section--articles"
      aria-labelledby="articles-heading"
      style={{ backgroundColor: `${theme.text}0d` }}
    >
      <div className="opensource-section-heading">
        <h2 id="articles-heading">{publicationsHeader.title}</h2>
        <p style={{ color: theme.secondaryText }}>
          {publicationsHeader.description}
        </p>
      </div>
      <div className="showcase-grid showcase-grid--articles">
        {articles.map((pub) => (
          <PublicationCard key={pub.id} pub={pub} theme={theme} />
        ))}
      </div>
      <Button
        text="Read more on Medium"
        className="showcase-more"
        href={contactPageData.blogSection.link}
        newTab={true}
        theme={theme}
      />
    </section>
  );
}

export default function OpenSourceShowcase({ theme }) {
  return <ArticlesSection theme={theme} />;
}
