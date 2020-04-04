class WebApiError {
  constructor(message, statusCode) {
    this.name = 'WebApiError',
    this.message = message || '',
    this.statusCode = statusCode;
  };
};