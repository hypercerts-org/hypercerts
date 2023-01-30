const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: {
    'batch-mint-claims-from-allowlists': "./src/auto-tasks/batch-mint-claims-from-allowlists.ts",
    'on-allowlist-created': "./src/auto-tasks/on-allowlist-created.ts"
  },
  target: "node",
  mode: "production",
  module: {
    rules: [{ test: /\.tsx?$/, use: "ts-loader", exclude: /node_modules/ }],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  externals: [
    // List here all dependencies available on the Autotask environment
    /axios/,
    /apollo-client/,
    /defender-[^\-]+-client/,
    /ethers/,
    /web3/,
    /@ethersproject\/.*/,
    /aws-sdk/,
    /aws-sdk\/.*/,
  ],
  externalsType: "commonjs2",
  plugins: [
    // List here all dependencies that are not run in the Autotask environment
    new webpack.IgnorePlugin({ resourceRegExp: /dotenv/ }),
  ],
  output: {
    filename: "[name]/index.js",
    path: path.resolve(__dirname, "build", "relay"),
    sourceMapFilename: '[file].map',
    library: { type: "commonjs2" },
  },
};
