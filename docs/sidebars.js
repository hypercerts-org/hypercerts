/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  mySidebar: [
    {
      type: "doc",
      id: "intro",
    },
    {
      type: "category",
      label: "Vision & Whitepaper",
      collapsed: true,
      items: [
        {
          type: "doc",
          id: "whitepaper/whitepaper-intro",
        },
        {
          type: "doc",
          id: "whitepaper/ifs",
        },
        {
          type: "doc",
          id: "whitepaper/hypercerts-intro",
        },
        {
          type: "doc",
          id: "whitepaper/impact-space",
        },
        {
          type: "doc",
          id: "whitepaper/evaluation",
        },
        {
          type: "doc",
          id: "whitepaper/retrospective-funding",
        },
      ],
    },
    {
      type: "category",
      label: "Developer Guide",
      collapsed: true,
      items: [
        {
          type: "doc",
          id: "developer/quickstart-javascript",
        },
        {
          type: "doc",
          id: "developer/quickstart-solidity",
        },
        {
          type: "doc",
          id: "developer/minting",
        },
        {
          type: "doc",
          id: "developer/allowlists",
        },
        {
          type: "doc",
          id: "developer/indexing",
        },
        {
          type: "doc",
          id: "developer/split-merge",
        },
        {
          type: "doc",
          id: "developer/supported-networks",
        },
        {
          type: "doc",
          id: "devops/index",
        },
        {
          type: "category",
          label: "API Reference",
          collapsed: true,
          items: [
            {
              type: "category",
              label: "Contracts",
              collapsed: true,
              items: [
                {
                  type: "doc",
                  id: "developer/api/contracts/HypercertMinter",
                },
                {
                  type: "doc",
                  id: "developer/api/contracts/SemiFungible1155",
                },
                {
                  type: "doc",
                  id: "developer/api/contracts/AllowlistMinter",
                },
              ],
            },
            {
              type: "doc",
              id: "developer/api/sdk/modules",
            },
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Minting Guide",
      collapsed: true,
      items: [
        {
          type: "doc",
          id: "minting-guide/minting-guide-start",
        },
        {
          type: "doc",
          id: "minting-guide/step-by-step",
        },
        {
          type: "doc",
          id: "minting-guide/gitcoin-round",
        },
      ],
    },
    {
      type: "category",
      label: "Implementation",
      collapsed: true,
      items: [
        {
          type: "doc",
          id: "implementation/token-standard",
        },
        {
          type: "doc",
          id: "implementation/metadata",
        },
        {
          type: "doc",
          id: "implementation/glossary",
        },
      ],
    },
    {
      type: "doc",
      id: "faq",
    },
    {
      type: "doc",
      id: "further-resources",
    },
  ],
};

module.exports = sidebars;
