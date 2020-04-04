const WebApiRequest = require('./web-api-request');

class SpotifyApi {
  constructor(credentials) {
    this._credentials = credentials || {};
  }
}

SpotifyApi.prototype = {
  setCredentials: (credentials) => {
    for (let key in credentials) {
      if (credentials.hasOwnProperty(key)) {
        this._credentials[key] = credentials[key];
      };
    };
  },



  /**
   * 
   * @param {string} playlistID The playlist's ID
   * @param {string} image Base64 encoded JPEG image data, maximum size 256 KB
   * 
   **/
  changePlaylistCover: function(playlistID, file) {

    return WebApiRequest.builder(this.getAccessToken())
      .withPath

  }
}