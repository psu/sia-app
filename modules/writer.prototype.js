var Writer = function(id, xml) {
  var xmlParser = require('../modules/parse-xml')
  this.id = id
  this.xml = xml
  this.data = xmlParser.parse( xml )
}

Writer.prototype.getType = function() {
  if ( typeof this.type !== 'undefined' ) return this.type
  if ( typeof this.error === 'undefined' && 
       typeof this.data['metadata']['artist'][0] !== 'undefined' ) {
    return this.type = this.data['metadata']['artist'][0]['$']['type']
  } else {
    return ''
  }
}

Writer.prototype.getName = function() {
  if ( typeof this.name !== 'undefined' ) return this.name
  if ( typeof this.error === 'undefined' && 
       typeof this.data['metadata']['artist'][0] !== 'undefined' ) {
    return this.name = this.data['metadata']['artist'][0]['name'][0]
  } else {
    return ''
  }
}

Writer.prototype.getCountry = function() {
  if ( typeof this.country !== 'undefined' ) return this.country
  if ( typeof this.error === 'undefined' && 
       typeof this.data['metadata']['artist'][0]['country'] !== 'undefined' ) {
    return this.country = this.data['metadata']['artist'][0]['country'][0]
  } else {
    return ''
  }
}

Writer.prototype.getBirth = function() {
  if ( typeof this.birth !== 'undefined' ) return this.birth
  if ( typeof this.error === 'undefined' && 
       typeof this.data['metadata']['artist'][0]['life-span'] !== 'undefined' ) {
    return this.birth = this.data['metadata']['artist'][0]['life-span'][0]['begin'][0].slice(0, 4)
  } else {
    return ''
  }
}

/*
  if (typeof this.error !== 'undefined') {

  var mbArtist = this.data['metadata']['artist'][0]

  var mbWorkList = mbArtist['work-list'][0]
  var mbWorkCount = mbWorkList['$']['count']
  var mbWorks = mbWorkList['work']
*/

// PROPERTIES
// ----------
// id      -- writer id
// error   -- defined if error, contains error message
// writerXml     -- raw xml info
// writerData

// METHODS
// -------
// loadWriter(id)

module.exports = Writer