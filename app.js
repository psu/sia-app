var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// https://github.com/request/request#requestoptions-callback
var request = require('request')
// https://github.com/Leonidas-from-XIV/node-xml2js
var xml2js = require('xml2js')
var parser = new xml2js.Parser();


var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('node-compass')({mode: 'expanded'}));
app.use(express.static(path.join(__dirname, 'public')));

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


///////////// routes //////////////

app.use('/', routes);
app.use('/users', users);

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



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
