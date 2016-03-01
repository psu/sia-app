var express = require('express')
var router = express.Router()
var Writer = require('../modules/writer.prototype.js');


/* GET writer info */
router.get('/:id', function(req, res, next) {  
  var id = req.params.id
  var mb = require('../modules/musicbrainz')
  mb.request( '/artist/'+ id +'', function(xmlError, xmlResponse, xmlBody) {
    if (!xmlError && xmlResponse.statusCode == 200) {
      var writer = new Writer( id, xmlBody )     
      if (typeof writer.error === 'undefined') {

        res.write('mbType: ' + writer.getType() +"\n")
        res.write('mbName: ' + writer.getName() +"\n")
        res.write('mbCountry: ' + writer.getCountry() +"\n")
        res.write('mbBorn: ' + writer.getBirth() +"\n")
        res.end()

      } else {
        res.send('Error creating writer object: ' + writer.error)
      }
    } else {
      res.send('Request error: ' + xmlResponse.statusCode + ' (' + xmlError + ')')
      console.log('Request error')
      console.log(xmlResponse.statusCode)
    } 

  }) //mb.request
}) // router.get

module.exports = router
