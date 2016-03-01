var xml2js = require('xml2js')
var parser = new xml2js.Parser()

exports.parse = function(body){
  // https://github.com/Leonidas-from-XIV/node-xml2js
  var returnObj = {}
  parser.parseString(body, function (xmlError, result) {
    if (!xmlError)
      returnObj = result
    else
      returnObj = {'error': xmlError}
  })
  return returnObj
}