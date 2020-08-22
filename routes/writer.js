var express = require('express')
var router = express.Router()
var Writer = require('../modules/writer.prototype.js');

router.get('/', function(req, res, next) {
  res.render('writer', { writer: {name: 'Testperson'} })
})

/* GET writer info */
router.get('/:id', function(req, res, next) {  
  var w = new Writer(req.params.id)
  res.end()
}) // router.get

module.exports = router
