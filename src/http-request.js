const superagent = require('superagent'),
  WebApiError = require('./web-api-error');

const HttpManager = {};

HttpManager.prototype = {
  _getParametersFromRequest: (req) => {
    let options = {};
    const reqQueryParameters = req.getQueryParameters();
    const reqHeaders = req.getHeaders();
    const reqBody = req.getBodyParameters();

    if (reqQueryParameters) {
      options.query = reqQueryParameters;
    };

    if (reqHeaders && reqHeaders['Content-Type'] === 'application/json') {
      options.data = JSON.stringify(reqBody);
    } else if (reqBody()) {
      options.data = reqBody;
    };

    if (reqHeaders) {
      options.getHeaders = reqHeaders;
    };
    return options;
  },

  _getErrorObject: (defaultMessage, err) => {
    let errorObject;
    const error = err.error;
    const errorMsg = error.message;
    if (typeof err.error === 'object' && typeof errorMsg === 'string') {
      // Web API Error
      errorObject = new WebApiError(errorMsg, error.status);
    } else if (typeof error === 'string') {
      // Auth Error
      errorObject = new WebApiError(`${error}: ${err['error_description']}`);
    } else if (typeof err === 'string') {
      // JSON Error
      try {
        const parsedError = JSON.parse(err);
        errorObject = new WebApiError(parsedError.error.message, parsedError.error.status);
      } catch (err) {
        // Error not JSON formatted
      };
    };

    if (!errorObject) {
      // unexpected format
      errorObject = new WebApiError(`${defaultMessage}: ${JSON.stringify(err)}`);
    };
    return errorObject;
  },
  _makeRequest: (method, options, uri, callback) => {
    const req = method.bind(superagent)(uri);

    if (options.query) {
      req.query(options.query);
    };

    if (options.data &&
      (!options.headers || options.headers['Content-Type'] !== 'application/json')
      ) {
        req.type('form');
        req.send(options.data);
      } else if (options.data) {
        req.send(options.data);
      };

      if (options.headers) {
        req.set(options.headers);
      };

      req.end((err, res) => {
        if (err) {
          return callback(_getErrorObject('Request error', {
            error: err
          }));
        };

        return callback(null, {
          body: res.body,
          headers: res.headers,
          statusCode: res.statusCode
        });
      });
  },

  /**
   * Make an HTTP GET request.
   * @param {BaseRequest} req The request.
   * @param {Function} callback The callback function.
   */
  get: (req, callback) => {
    const options = _getParametersFromRequest(req);
    const method = superagent.get;

    this._makeRequest(method, options, req.getURI(), callback);
  },

  /**
   * Make an HTTP POST request.
   * @param {BaseRequest} req The request.
   * @param {Function} callback The callback function.
   */
  post: (req, callback) => {
    const options = _getParametersFromRequest(req);
    const method = superagent.post;

    this._makeRequest(method, options, req.getURI(), callback);
  },

  /**
   * Makes an HTTP DELETE request.
   * @param {BaseRequest} req The request.
   * @param {Function} callback The callback function.
   */
  del: (req, callback) => {
    const options = _getParametersFromRequest(req);
    const method = superagent.delete;

    this._makeRequest(method, options, req.getURI(), callback);
  },

  /**
   * Makes an HTTP DELETE request.
   * @param {BaseRequest} req The request.
   * @param {Function} callback The callback function.
   */
  del: (req, callback) => {
    const options = _getParametersFromRequest(req);
    const method = superagent.delete;

    this._makeRequest(method, options, req.getURI(), callback);
  },

  /**
   * Makes an HTTP PUT request.
   * @param {BaseRequest} req The request.
   * @param {Function} callback The callback function.
   */
  put: (req, callback) => {
    const options = _getParametersFromRequest(req);
    const method = superagent.put;

    this._makeRequest(method, options, req.getURI(), callback);
  }
};

module.exports = HttpManager;