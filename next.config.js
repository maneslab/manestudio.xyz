const path = require("path");
const nextTranslate = require("next-translate");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: process.env.ANALYZE === "true",
});

let config = {
    reactStrictMode: true,

    webpack(config, { webpack, isServer, dev }) {
        config.module.rules.push({
            test: /\.svg$/,
            use: ["@svgr/webpack"],
        });

        config.module.rules.push({
            test: /\.md$/,
            use: ["raw-loader"],
        });

        console.log("alias", path.resolve(process.cwd(), "node_modules", "bn.js"));

        config.resolve.alias = {
            ...config.resolve.alias,
            "bn.js": path.resolve(process.cwd(), "node_modules", "bn.js"),
        };

        // if (!isServer) {
        //       config.optimization.splitChunks.cacheGroups.commons.minChunks = 2;
        // }

        if (!isServer) {
            config.resolve.fallback.fs = false;
        }

        return config;
    },
};

module.exports = withBundleAnalyzer(nextTranslate(config));
