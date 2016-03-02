var express = require('express')
var router = express.Router()
var Writer = require('../modules/writer.prototype.js');


/* GET writer info */
router.get('/:id', function(req, res, next) {  
  var id = req.params.id
  var mb = require('../modules/musicbrainz')
  mb.request( '/artist/'+ id +'?inc=artist-rels+work-rels', function(xmlError, xmlResponse, xmlBody) {
    if (!xmlError && xmlResponse.statusCode == 200) {
      var w = new Writer( id, xmlBody )     
      
      if (req.query.output == 'raw') { res.send(w.data); return }

      res.render('writer', { writer: w })
      
    } else {
      res.send('Request error: ' + xmlResponse.statusCode + ' (' + xmlError + ')')
      console.log('Request error')
      console.log(xmlResponse.statusCode)
    } 




  }) //mb.request
}) // router.get

module.exports = router
