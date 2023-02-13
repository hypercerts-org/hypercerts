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
      type: 'doc',
      id: 'intro',
    },
    {
      type: 'doc',
      id: 'further-resources',
    },
    {
      type: 'category',
      label: 'Docusaurus',
      items: [
        {
          type: 'doc',
          id: 'whitepaper-intro',
        },
        {
          type: 'doc',
          id: 'ifs',
        },
      ],
    },
  ],
};

module.exports = sidebars;
