SpotifyApi.prototype = {

  /**
   * 
   * @param {string} playlistID The playlist's ID
   * @param {string} image Base64 encoded JPEG image data, maximum size 256 KB
   */
  changePlaylistCover: function(playlistID, file) {

    return WebApiRequest.builder(this.getAccessToken())
      .withPath

  }
}