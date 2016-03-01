// https://github.com/request/request#requestoptions-callback
var request = require('request')

exports.request = request.defaults({
  method: 'GET',
  headers: {
//    'Accept': 'application/json',
    'User-Agent': 'sia-0.0.1 (pontus@psu.se)'
  },
  baseUrl: 'http://beta.musicbrainz.org/ws/2/'
})