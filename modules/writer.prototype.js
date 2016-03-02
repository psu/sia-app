var Writer = function(id, xml) {
  var xmlParser = require('../modules/parse-xml')
  
  this.id = id
  this.data = xmlParser.parse( xml )
  
  // get basic artist info  
  if ( typeof this.data['metadata']['artist'][0]['name'] !== 'undefined' )
    this.name = this.data['metadata']['artist'][0]['name'][0]

  if ( typeof this.data['metadata']['artist'][0]['disambiguation'] !== 'undefined' )
    this.disambiguation = this.data['metadata']['artist'][0]['disambiguation'][0]

  if ( typeof this.data['metadata']['artist'][0] !== 'undefined' )
    this.type = this.data['metadata']['artist'][0]['$']['type']


  if ( typeof this.data['metadata']['artist'][0]['area'] !== 'undefined' )
    this.country = this.data['metadata']['artist'][0]['area'][0]['name'][0]

  if ( typeof this.data['metadata']['artist'][0]['life-span'] !== 'undefined' )
    this.birth = this.data['metadata']['artist'][0]['life-span'][0]['begin'][0].slice(0, 4)

  // first relation-list with target-type=artist
  if ( this.data['metadata']['artist'][0]['relation-list'][0]['$']['target-type'] == 'artist' && 
       typeof this.data['metadata']['artist'][0]['relation-list'][0]['relation'] !== 'undefined' ) {
  
    var artistRelations = []
    for (var i=0; i<this.data['metadata']['artist'][0]['relation-list'][0]['relation'].length; i++) {
      artistRelations[ i ] ={
        type     : this.data['metadata']['artist'][0]['relation-list'][0]['relation'][ i ]['$']['type'], 
        name     : this.data['metadata']['artist'][0]['relation-list'][0]['relation'][ i ]['artist'][0]['name'][0], 
        id       : this.data['metadata']['artist'][0]['relation-list'][0]['relation'][ i ]['target'][0]
      }
    }
    this.relations = artistRelations    
      
  } // target-type=artist
    
}

module.exports = Writer