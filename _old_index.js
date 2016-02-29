// basic def
var express = require('express')
// http://expressjs.com/en/guide/using-middleware.html
var app = express()
// https://github.com/request/request#requestoptions-callback
var request = require('request')
// https://github.com/Leonidas-from-XIV/node-xml2js
var xml2js = require('xml2js')
var parser = new xml2js.Parser();

// setup express
app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

// use for logging etc
var initDebug = function(req, res, next){
  console.log('Request init')
  console.log('------------')
  console.log('Type: ' + req.method)
  console.log('------------')
  next()
}
//app.use(initDebug)


///////////// request object musicbrainz //////////////
var mbRequest = request.defaults({
  method: 'GET',
  headers: {
//    'Accept': 'application/json',
    'User-Agent': 'sia-0.0.1 (pontus@psu.se)'
  },
  baseUrl: 'http://beta.musicbrainz.org/ws/2/'
})
var mbArtistQuery = '/artist/?query=artist:'

///////////// ////////////////////////// //////////////



///////////// search router //////////////

app.use('/writer/', function(req, res, next) {
  console.log('Search URL:', req.originalUrl)
  next()
})

app.get('/writer/', function (req, res, next) {

  var searchTerm = (req.params.term)? req.params.term: req.query.q
  
  // request mb with term
  mbRequest(mbArtistQuery + searchTerm, function(reqError, response, body) {    
  
    if (!reqError) {
      // parse xml result from mb
      var mbResponse = {}
      parser.parseString(body, function (xmlError, result) {
        if (!xmlError) {
          mbResponse = result;
        } else {
          console.log(xmlError)
          res.send('xml parser error');
        }
      });  
    } // !reqError
  
    if (response.statusCode == 200) {
      var mbArtists = mbResponse['metadata']['artist-list'][0]['artist']

//      console.log(mbArtists);
      
      var output = 'Search result <ul>'
      for (i=0; i<mbArtists.length; i++) {
        output += '<li><a href="/artist/'+ mbArtists[i]['$']['id'] +'">' + mbArtists[i]['name'][0] + '</a></li>'
      }      
      output += '</ul>'
      res.send(output);
      
    } else {
      res.send( 'Search failed: ' + mbResponse['error']['text'][0] )
    }

  }) // mbRequest


})

///////////// //////////// //////////////



// default /
app.get('/', function(req, res){
  res.send('Search writer: <form action="/writer/"><input type="text" name="q" /><input type="submit" value=" Search " /></form>')
})

// listen
app.listen(app.get('port'), function(){
  console.log('SIA app on port', app.get('port'))
})