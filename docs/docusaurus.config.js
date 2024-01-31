import { themes } from "prism-react-renderer";

export default async function createConfigAsync() {
  // Use a dynamic import instead of require('esm-lib')
  const mdx_mermaid = await import("mdx-mermaid");

  return {
    title: "Hypercerts",
    tagline: "Accounting and rewarding impact with hypercerts",
    url: "https://hypercerts-org.github.io/",
    baseUrl: "/docs/",
    onBrokenLinks: "log",
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

    plugins: [
      [
        "docusaurus-plugin-typedoc",
        {
          // TypeDoc options
          entryPoints: ["../sdk/src/index.ts"],
          tsconfig: "../sdk/tsconfig.json",

          // Plugin options
          out: "developer/api/sdk",
          sidebar: {
            categoryLabel: "API SDK",
            collapsed: false,
            position: 0,
            fullNames: true,
          },
        },
      ],
    ],

    presets: [
      [
        "classic",
        /** @type {import('@docusaurus/preset-classic').Options} */
        {
          blog: false, // Optional: disable the blog plugin
          docs: {
            routeBasePath: "/", // Serve the docs at the site's root
            sidebarPath: "./sidebars.js",
            // Please change this to your repo.
            // Remove this to remove the "edit this page" links.
            remarkPlugins: [mdx_mermaid],
            editUrl: "https://github.com/hypercerts-org/hypercerts",
          },
          theme: {
            customCss: "./src/css/custom.css",
          },
        },
      ],
    ],

    markdown: {
      mermaid: true,
      format: "detect",
    },
    themes: ["@docusaurus/theme-mermaid"],
    themeConfig: {
      algolia: {
        // The application ID provided by Algolia
        appId: "KEI1L137BU",

        // Public API key: it is safe to commit it
        apiKey: "3c28007b9532f79a8f326cc2a07f1721",

        indexName: "hypercerts",

        insights: true,
      },
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
          {
            type: "docsVersionDropdown",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        copyright: `Copyright © 2023 Hypercerts Foundation. Built with Docusaurus.`,
      },
      prism: {
        theme: themes.github,
        darkTheme: themes.dracula,
      },
      mermaid: {
        theme: { light: "neutral", dark: "dark" },
      },
    },
  };
}
