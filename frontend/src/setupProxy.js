const {createProxyMiddleware} = require('http-proxy-middleware');

let djangoProxyLocation = '127.0.0.1:8000';

if (process.env.DJANGO_PROXY_HOST && process.env.DJANGO_PROXY_PORT) {
    djangoProxyLocation = process.env.DJANGO_PROXY_HOST + ":" + process.env.DJANGO_PROXY_PORT;
}

const djangoProxy = {
    target: 'http://' + djangoProxyLocation,
    changeOrigin: true
}

module.exports = function (app) {
    app.use('/api', createProxyMiddleware(djangoProxy));
    app.use('/admin', createProxyMiddleware(djangoProxy));
    app.use('/staticfiles', createProxyMiddleware(djangoProxy));
};