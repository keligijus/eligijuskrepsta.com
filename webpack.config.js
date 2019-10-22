const path = require("path");
const glob = require("glob-all");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const PurgecssPlugin = require("purgecss-webpack-plugin");

// list all the pages here
const pages = ["index", "portfolio", "contact"];

/**
 * Custom PurgeCSS Extractor
 * https://github.com/FullHuman/purgecss
 * https://github.com/FullHuman/purgecss-webpack-plugin
 */
class TailwindExtractor {
  static extract(content) {
    return content.match(/[A-z0-9-:\/]+/g);
  }
}

module.exports = {
  entry: "./src/css/tailwind.src.css",
  mode: process.env.NODE_ENV,
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
            { loader: "css-loader", options: { importLoaders: 1 } },
            "postcss-loader"
          ]
        })
      }
    ]
  },
  plugins: [
    ...pages.map(
      page =>
        new HtmlWebpackPlugin({
          filename: `${page}.html`,
          template: `src/${page}.html`
        })
    ),
    new ExtractTextPlugin("styles.css", {
      disable: process.env.NODE_ENV === "development"
    }),
    // new HtmlWebpackPlugin({
    //   filename: "index.html",
    //   template: "src/index.html"
    // }),
    // new HtmlWebpackPlugin({
    //   filename: "portfolio.html",
    //   template: "src/portfolio.html"
    // }),
    /// Enable images folder
    new CopyWebpackPlugin([
      {
        from: "src/img",
        to: "img"
      }
    ]),
    () =>
      process.env.NODE_ENV === "development"
        ? null
        : new PurgecssPlugin({
            paths: glob.sync([path.join(__dirname, "src/**/*.html")]),
            extractors: [
              {
                extractor: TailwindExtractor,
                extensions: ["html", "js"]
              }
            ]
          })
  ]
};