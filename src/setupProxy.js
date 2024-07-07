const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function proxyMiddleware(app) {
  app.use(
    '/api/industry',
    createProxyMiddleware({
      target: 'https://ysgy.cqgcc.gov.cn', // 演示环境
      changeOrigin: true,
    })
  );
};
