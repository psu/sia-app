var express = require('express')
var router = express.Router()
var xml = require('../modules/parse-xml')
var mb = require('../modules/musicbrainz')

/* GET search results */
router.get('/', function(req, res, next) {

  if (req.query.q != '') {
    var searchTerm = req.query.q
  } else {
    res.redirect('/')
    return
  }
  
  // request mb with term
  mb.request('/artist/?query=artist:'+searchTerm, function(reqError, response, body) {    
  
    if (!reqError) mbResponse = xml.parse(body)  
    if (response.statusCode == 200 && !mbResponse['error']) {

      var mbCount = mbResponse['metadata']['artist-list'][0]['$']['count']
      var mbOffset = mbResponse['metadata']['artist-list'][0]['$']['offset']
      var mbArtists = mbResponse['metadata']['artist-list'][0]['artist']
      
      var output = ''
      if (mbCount > 0) {
        output += 'Search result <ul>'
        for (i=0; i<mbArtists.length; i++) {
          output += '<li><a href="/writer/'+ mbArtists[i]['$']['id'] +'">' + mbArtists[i]['name'][0] + '</a></li>'
        }      
        output += '</ul>'
      } else {
        output += 'Nothing found'
      }
      res.send(output);
      
    } else {
      res.send( 'Error: ' + mbResponse['error']['text'][0] )
    }

  }) // mbRequest

})

module.exports = router