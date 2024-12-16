const { createProxyMiddleware } = require("http-proxy-middleware");
const { getProxyOptions } = require("../services/proxyService");

const proxyRequest = (service) => {
    return createProxyMiddleware(getProxyOptions(service));
};

module.exports = {
    proxyRequest,
};
