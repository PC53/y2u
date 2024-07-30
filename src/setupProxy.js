const proxy = require('http-proxy-middleware');

module.exports = (app) => {
    app.use(proxy('/functions', {
        target: 'http://localhost:5000',
        pathRewrite: {
            "^\\.netlify/functions": ""
        }
    }));
}