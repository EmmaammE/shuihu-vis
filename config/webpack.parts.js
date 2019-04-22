var path = require("path");
exports.devServer = ({ host, port } = {}) => ({
  devServer: {
    stats: "errors-only",
    host, // Defaults to `localhost`
    port, // Defaults to 8080
    open: true,
    overlay: true,
    contentBase: path.join(__dirname, "../dist/"),
  },
});

exports.loadCSS = ({ include, exclude } = {}) => ({
  module: {
    rules: [
      {
        test: /\.css$/,
        include,
        exclude,

        use: ["style-loader", "css-loader"],
        // test: /\.scss$/,
        // use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
});