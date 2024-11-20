module.exports = {
  resolve: {
    fallback: {
      path: require.resolve("path-browserify"),
      url: require.resolve("url/"),
      querystring: require.resolve("querystring-es3"),
      crypto: require.resolve("crypto-browserify"),
      os: require.resolve("os-browserify/browser"),
      https: require.resolve("https-browserify"),
      stream: require.resolve("stream-browserify"),
      fs: false, // fs is not available in the browser
    },
  },
};