const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = function override(config, env) {
  config.module.rules.push({
    test: /\.worker\.js$/,
    use: { loader: "worker-loader" },
  });
  config.plugins.push(
    new NodePolyfillPlugin({
      excludeAliases: [
        "assert",
        "console",
        "constants",
        "crypto",
        "domain",
        "events",
        "http",
        "https",
        "os",
        "path",
        "punycode",
        "querystring",
        "_stream_duplex",
        "_stream_passthrough",
        "_stream_transform",
        "_stream_writable",
        "string_decoder",
        "sys",
        "timers",
        "tty",
        "url",
        "util",
        "vm",
        "zlib",
      ],
    })
  );

  config.resolve.fallback = {
    fs: false,
    tls: false,
    net: false,
    http: require.resolve("stream-http"),
    https: false,
    zlib: require.resolve("browserify-zlib"),
    path: require.resolve("path-browserify"),
    stream: require.resolve("stream-browserify"),
    util: require.resolve("util/"),
    crypto: require.resolve("crypto-browserify"),
  };

  return config;
};
