const Request = require('./request');

const DEFAULT_HOST = 'api.spotify.com',
  DEFAULT_PORT = 443,
  DEFAULT_SCHEME = 'https';

module.exports.builder = (accessToken) => {
  return Request.builder()
    .withHost(DEFAULT_HOST)
    .withPort(DEFAULT_PORT)
    .withScheme(DEFAULT_SCHEME)
    .withAuth(accessToken);
};