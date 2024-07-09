const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function proxyMiddleware(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://', 
      changeOrigin: true,
    })
  );
};
