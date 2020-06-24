// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    createProxyMiddleware('/webapi.htm', {
      target: ' http://9.56.46.168:8080',
      // target: 'http://10.224.148.145:8080',
      // target: 'http://10.215.131.92:8080',
      changeOrigin: true,
      ws: true,
    })
  );
};
