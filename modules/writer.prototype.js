var Writer = function(id) {
  this.id = id

  this.request(function() {
    console.log('callback')  
  })

}

Writer.prototype.request = function(callback) {
  var mb = require('../modules/musicbrainz')
  //request mb with id, 3 times
  
  
/*
  mb.request( '/artist/'+ id +'?inc=works+artist-rels+work-rels+recording-rels', function(xmlError, xmlResponse, xmlBody) {
    if (!xmlError && xmlResponse.statusCode == 200) {

      if (req.query.output == 'raw') { res.send(w.data); return }
      res.render('writer', { writer: w })

    } else {
      res.send('Request error: ' + xmlError + ' (' + xmlResponse.statusCode + ')')
      console.log('-- Request error --')
      console.log(xmlResponse.statusCode)
    }

  }) //mb.request

*/  
  
  
  callback()
}

module.exports = Writer