const webpackConfig = require("./webpack.config.js");

// Karma watches for entry points so we clear webpack entry point
webpackConfig.entry = {};

// Remove plugins (unit tests don't need copying of files)
webpackConfig.plugins = [];

module.exports = function(config) {
    config.set({
        basePath: "",
        frameworks: ["jasmine"],
        browsers: ["PhantomJS"],
        webpack: webpackConfig,
        files: ["test/bundle.js"],
        preprocessors: {
            "test/bundle.js": ["webpack", "sourcemap"]
        },
        reporters: ["progress", "jasmine-diff"],

        // keeps webpack from spamming the console, shows only warnings and errors
        webpackMiddleware: {
            noInfo: true
        },
        jasmineDiffReporter: {
            pretty: 4 // Indent the data structure with 4-space steps
        }
    });
};
