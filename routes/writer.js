var express = require('express')
var router = express.Router()
var xml = require('sia-app/parse-xml')
var mb = require('sia-app/musicbrainz')

/* GET writer info */
router.get('/:id', function(req, res, next) {  
  var writerId = req.params.id

  // request mb with writer id
  mb.request('/artist/'+writerId+'?inc=works', function(reqError, response, body) {    
    if (!reqError) mbResponse = xml.parse(body)
    if (response.statusCode == 200 && !mbResponse['error']) {
//        res.send(mbResponse)
        
        var mbArtist = mbResponse['metadata']['artist'][0]
        var mbType = mbArtist['$']['type']
        var mbName = mbArtist['name'][0]
        var mbCountry = mbArtist['country'][0]
        var mbBorn = mbArtist['life-span'][0]['begin'][0].slice(0,4)
        
        var mbWorkList = mbArtist['work-list'][0]
        var mbWorkCount = mbWorkList['$']['count']
        var mbWorks = mbWorkList['work']
        
        res.write('mbType: ' + mbType +"\n")
        res.write('mbName: ' + mbName +"\n")
        res.write('mbCountry: ' + mbCountry +"\n")
        res.write('mbmbBornName: ' + mbBorn +"\n")
        res.write('mbWorkCount: ' + mbWorkCount +"\n")
        res.write('mbWorks: ' + mbWorks +"\n")
        res.end()
        

    } else {
      res.send('Error: ' + mbResponse['error']['text'][0])
    }

//      var mbCount = mbResponse['metadata']['artist-list'][0]['$']['count']
//      var mbOffset = mbResponse['metadata']['artist-list'][0]['$']['offset']
//      var mbArtists = mbResponse['metadata']['artist-list'][0]['artist']
      
//      var output = ''
//      if (mbCount > 0) {
//        output += 'Search result <ul>'
//        for (i=0; i<mbArtists.length; i++) {
//          output += '<li><a href="/writer/'+ mbArtists[i]['$']['id'] +'">' + mbArtists[i]['name'][0] + '</a></li>'
//        }      
//        output += '</ul>'
//      } else {
//        output += 'Nothing found'
//      }
//      res.send(output);
//      
//    } else {
//      res.send( 'Search failed: ' + mbResponse['error']['text'][0] )
//    }

  }) // mbRequest


})

module.exports = router
