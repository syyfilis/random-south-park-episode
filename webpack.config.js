const path = require('path');

module.exports = {
    cache: true,
    devtool: 'source-map',

    entry: {
        app: path.join(__dirname, 'src', 'bootstrap.js')
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'background.js'
    },

    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel'
            }
        ]
    },
    resolve: {
        root: [
            path.join(__dirname, 'src'),
            path.join(__dirname, 'node_modules')
        ],
        extensions: ['', '.js']
    }
};
