const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {

    app.use(
        createProxyMiddleware('/api', {
            target: 'http://299268k3v5.wicp.vip',
            changeOrigin: true,
            pathRewrite: {
                '/api': '/api/v1',
            },
        })
    )

}