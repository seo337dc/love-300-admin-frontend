const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = (app) => {
  console.log("apiurl: ", process.env.REACT_APP_API_URL);
  app.use(
    createProxyMiddleware(["/api"], {
      target:
        process.env.REACT_APP_API_URL ?? "https://admin-api.one-q.finance",
      changeOrigin: true,
    })
  );
};
