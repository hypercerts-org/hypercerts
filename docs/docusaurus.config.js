// @ts-check
/* eslint-disable @typescript-eslint/no-var-requires */
const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Hypercerts",
  tagline: "Accounting and rewarding impact with hypercerts",
  url: "https://hypercerts-org.github.io/",
  baseUrl: "/docs/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  trailingSlash: false,

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "Hypercerts Foundation", // Usually your GitHub org/user name.
  projectName: "hypercerts", // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        blog: false, // Optional: disable the blog plugin
        docs: {
          routeBasePath: "/", // Serve the docs at the site's root
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          remarkPlugins: [require("mdx-mermaid")],
          editUrl: "https://github.com/hypercerts-org/hypercerts",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  markdown: {
    mermaid: true,
  },
  themes: ["@docusaurus/theme-mermaid"],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      docs: {
        sidebar: {
          hideable: true,
          autoCollapseCategories: false,
        },
      },
      navbar: {
        title: "hypercerts",
        items: [
          {
            type: "doc",
            docId: "intro",
            position: "left",
            label: "Docs",
          },
          {
            type: "dropdown",
            label: "Intro",
            position: "left",
            items: [
              {
                type: "doc",
                docId: "intro",
                label: "What are hypercerts?",
              },
              {
                type: "doc",
                docId: "faq",
                label: "Frequently Asked Questions",
              },
              {
                type: "doc",
                docId: "further-resources",
                label: "Further Resources",
              },
            ],
          },
          {
            type: "dropdown",
            label: "Vision & Whitepaper",
            position: "left",
            items: [
              {
                type: "doc",
                docId: "whitepaper/whitepaper-intro",
                label: "Introduction",
              },
              {
                type: "doc",
                docId: "whitepaper/ifs",
                label: "Impact Funding Systems",
              },
              {
                type: "doc",
                docId: "whitepaper/hypercerts-intro",
                label: "Hypercerts: a New Primitive",
              },
              {
                type: "doc",
                docId: "whitepaper/impact-space",
                label: "A Consistent Impact Space",
              },
              {
                type: "doc",
                docId: "whitepaper/evaluation",
                label: "Open Impact Evaluations",
              },
              {
                type: "doc",
                docId: "whitepaper/retrospective-funding",
                label: "Retrospective Impact Funding",
              },
            ],
          },
          {
            type: "dropdown",
            label: "Minting Guide",
            position: "left",
            items: [
              {
                type: "doc",
                docId: "minting-guide/minting-guide-start",
                label: "Getting Started",
              },
              {
                type: "doc",
                docId: "minting-guide/step-by-step",
                label: "Step-by-step implementation",
              },
              {
                type: "doc",
                docId: "minting-guide/gitcoin-round",
                label: "Gitcoin Alpha Round Instructions",
              },
            ],
          },
          {
            type: "dropdown",
            label: "Implementation",
            position: "left",
            items: [
              {
                type: "doc",
                docId: "implementation/token-standard",
                label: "Token Standard",
              },
              {
                type: "doc",
                docId: "implementation/metadata",
                label: "Metadata Standard",
              },
              {
                type: "doc",
                docId: "implementation/glossary",
                label: "Glossary",
              },
            ],
          },
          {
            type: "doc",
            docId: "about",
            position: "right",
            label: "About",
          },
          {
            type: "dropdown",
            label: "Community",
            position: "right",
            items: [
              {
                label: "Twitter",
                href: "https://twitter.com/hypercerts",
              },
              {
                label: "Telegram Group",
                href: "https://t.me/+YF9AYb6zCv1mNDJi",
              },
            ],
          },
          {
            href: "https://github.com/hypercerts-org/hypercerts",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        copyright: `Copyright © ${new Date().getFullYear()} Hypercerts Foundation. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      mermaid: {
        theme: { light: "neutral", dark: "dark" },
      },
    }),
};

module.exports = config;
