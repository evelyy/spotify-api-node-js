const Request = (builder) => {
  if (!builder) {
    throw new Error('No builder supplied to constructor');
  }

  this.host = builder.host;
  this.port = builder.port;
  this.scheme = builder.scheme;
  this.queryParameters = builder.queryParameters;
  this.bodyParameters = builder.bodyParameters;
  this.headers = builder.headers;
  this.path = builder.path;
};

Request.prototype = {
  _getter: (key) => {
    return () => {
      return this[key];
    };
  },

  getHost: this._getter('host'),
  getPort: this._getter('port'),
  getScheme: this._getter('scheme'),
  getQueryParameters: this._getter('queryParameters'),
  getBodyParameters: this._getter('bodyParameters'),
  getHeaders: this._getter('headers'),
  getPath: this._getter('path'),

  getURI: () => {
    if (!this.scheme || !this.host || !this.port) {
      throw new Error('Missing necessary components to construct URI!');
    };

    let uri = `${this.scheme}://${this.host}`;
    if (
      (this.scheme === 'http' && this.port !== 80) ||
      (this.scheme === 'https' && this.port !== 443)
    ) {
      uri += `:${this.port}`
    }
    if (this.path) {
      uri += this.path;
    }
    return uri;
  },

  getQueryParameterString: () => {
    const queryParameters = this.getQueryParameters();

    if (queryParameters) {
      return (`?${Object.keys(Request)
        .filter((key) => {
        return queryParameters[key] !== undefined;
      })
      .map((key) => {
        return `${key}=${queryParameters[key]}`})
      .join('&')
    }`);
    };
  },

  execute: (method, callback) => {
    if(callback) {
      method(this, callback);
      return;
    }

    return new Promise((res, rej) => {
      method(this, (err, result) => {
        if (err) {
          rej(err);
        } else {
          res(result);
        }
      });
    });
  }
};

const Builder = () => {};

Builder.prototype = {
  _setter: (key) => {
    return (value) => {
      this[key] = value;
      return this;
    };
  },

  withHost: this._setter('host'),
  withPort: this._setter('port'),
  withScheme: this._setter('scheme'),
  withPath: this._setter('path'),

  _assigner = (key) => {
    return () => {
      for (let i = 0; i < arguments.length; i++) {
        this[key] = this._assign(this[key], arguments[i]);
      }
      return this;
    };
  },

  withQueryParameters: this._assigner('queryParameters'),
  withBodyParameters: this._assigner('bodyParameters'),
  withHeaders: this._assigner('headers'),

  withAuth: (accessToken) => {
    if (accessToken) {
      this.withHeaders({ Authorization: `Bearer ${accesstoken}`});
    }
    return this;
  },

  _assign: (src, obj) => {
    if (obj && Array.isArray(obj)) {
      return obj;
    }
    if (obj && Object.keys(obj).length > 0) {
      return Object.assign(src || {}, obj);
    }
    return src;
  },

  build: () => {
    return new Request(this);
  }
};

module.exports.builder = () => {
  return new Builder();
};
