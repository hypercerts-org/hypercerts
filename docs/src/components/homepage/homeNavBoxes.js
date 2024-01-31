import React from "react";
import clsx from "clsx";
import styles from "./homeNavBoxes.module.css";

const FeatureList = [
  {
    title: "Introduction",
    icon: "img/icons/hypercerts_logo_green.png",
    items: [
      { url: "1.4.1/intro", text: "What are hypercerts?" },
      { url: "1.4.1/about", text: "About the Hypercerts Foundation" },
      { url: "1.4.1/faq", text: "Frequently Asked Questions" },
      { url: "1.4.1/further-resources", text: "Further Resources" },
    ],
  },
  {
    title: "Vision & Whitepaper",
    icon: "img/icons/hypercerts_logo_beige.png",
    items: [
      { url: "1.4.1/whitepaper/whitepaper-intro", text: "Introduction" },
      { url: "whitepaper/ifs", text: "Impact Funding Systems (IFSs)" },
      {
        url: "1.4.1/whitepaper/hypercerts-intro",
        text: "Hypercerts: a New Primitive",
      },
      { url: "1.4.1/whitepaper/impact-space", text: "A Consistent Impact Space" },
      { url: "1.4.1/whitepaper/evaluations", text: "Open Impact Evaluations" },
      {
        url: "1.4.1/whitepaper/retrospective-funding",
        text: "Retrospective Impact Funding",
      },
    ],
  },
  {
    title: "Minting Guide",
    icon: "img/icons/hypercerts_logo_red.png",
    items: [
      { url: "1.4.1/minting-guide/minting-guide-start", text: "Getting Started" },
      { url: "1.4.1/minting-guide/step-by-step", text: "Step-by-step Instructions" },
      {
        url: "1.4.1/minting-guide/gitcoin-round",
        text: "Gitcoin Alpha Round Instructions",
      },
    ],
  },
  {
    title: "Developers",
    icon: "img/icons/hypercerts_logo_yellow.png",
    items: [
      { url: "1.4.1/developer", text: "Developer docs" },
      { url: "1.4.1/implementation/token-standard", text: "Token Standard" },
      { url: "1.4.1/implementation/metadata", text: "Metadata Standard" },
      { url: "1.4.1/implementation/glossary", text: "Glossary" },
    ],
  },
];

function FeatureItem({ url, text }) {
  return (
    <li>
      <a className={styles.listContainerLink} href={url}>
        {text}
      </a>
    </li>
  );
}

function Feature({ title, icon, items }) {
  return (
    <article className={clsx("col col--4")}>
      <div className={styles.homecard}>
        <img src={icon} className={styles.homeIcon}></img>
        <h2>{title}</h2>
        <div className={styles.listContainer}>
          <ul>
            {items.map((props, idx) => (
              <FeatureItem key={idx} {...props} />
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <ul className={styles.grid3col}>
        {FeatureList.map((props, idx) => (
          <Feature key={idx} {...props} />
        ))}
      </ul>
    </section>
  );
}
