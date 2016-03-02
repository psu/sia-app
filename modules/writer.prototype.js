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
    this.type = this.data['metadata']['artist'][0]['$']['type'].toLowerCase()


  if ( typeof this.data['metadata']['artist'][0]['area'] !== 'undefined' )
    this.country = this.data['metadata']['artist'][0]['area'][0]['name'][0]

  if ( typeof this.data['metadata']['artist'][0]['life-span'] !== 'undefined' )
    this.birth = this.data['metadata']['artist'][0]['life-span'][0]['begin'][0].slice(0, 4)

  // loop through all relation-lists
  var i = 0, a = '', b = [], r = [], s = {}
  while ( typeof this.data['metadata']['artist'][0]['relation-list'][ i ] !== 'undefined' ) {
    
    // relation-list with target-type=artist
    if ( this.data['metadata']['artist'][0]['relation-list'][ i ]['$']['target-type'] == 'artist' ) {
      for (var j=0; j<this.data['metadata']['artist'][0]['relation-list'][ i ]['relation'].length; j++) {
        switch ( this.data['metadata']['artist'][0]['relation-list'][ i ]['relation'][ j ]['$']['type'] ) {
          case 'is person':
            a = {
              name     : this.data['metadata']['artist'][0]['relation-list'][ i ]['relation'][ j ]['artist'][0]['name'][0], 
              id       : this.data['metadata']['artist'][0]['relation-list'][ i ]['relation'][ j ]['target'][0]
            }        
            break
          case 'member of band':
            b[ b.length ] = {
              name     : this.data['metadata']['artist'][0]['relation-list'][ i ]['relation'][ j ]['artist'][0]['name'][0], 
              id       : this.data['metadata']['artist'][0]['relation-list'][ i ]['relation'][ j ]['target'][0]
            }
            break
          default: // collect unknow relations in array r
            r[ r.length ] = {
              type     : this.data['metadata']['artist'][0]['relation-list'][ i ]['relation'][ j ]['$']['type'],
              name     : this.data['metadata']['artist'][0]['relation-list'][ i ]['relation'][ j ]['artist'][0]['name'][0], 
              id       : this.data['metadata']['artist'][0]['relation-list'][ i ]['relation'][ j ]['target'][0]
            }        
            break
        }
      }
    }
    
    // relation-list with target-type=work
    if ( this.data['metadata']['artist'][0]['relation-list'][ i ]['$']['target-type'] == 'work' ) {
      for (var j=0; j<this.data['metadata']['artist'][0]['relation-list'][ i ]['relation'].length; j++) {
        var songId = this.data['metadata']['artist'][0]['relation-list'][ i ]['relation'][ j ]['target'][0]
        if (typeof s[ songId ] !== 'undefined') {
          s[ songId ].type += ', ' + this.data['metadata']['artist'][0]['relation-list'][ i ]['relation'][ j ]['$']['type']
        } else {
          s[ songId ] = {
            type     : this.data['metadata']['artist'][0]['relation-list'][ i ]['relation'][ j ]['$']['type'],
            title    : this.data['metadata']['artist'][0]['relation-list'][ i ]['relation'][ j ][ 'work' ][0]['title'][0], 
            id       : songId
          }
        }  
      }
    }

    // relation-list with target-type=recording
    if ( this.data['metadata']['artist'][0]['relation-list'][ i ]['$']['target-type'] == 'recording' ) {
      for (var j=0; j<this.data['metadata']['artist'][0]['relation-list'][ i ]['relation'].length; j++) {
        var songId = this.data['metadata']['artist'][0]['relation-list'][ i ]['relation'][ j ]['target'][0]
        if (typeof s[ songId ] !== 'undefined') {
          s[ songId ].type += ', ' + this.data['metadata']['artist'][0]['relation-list'][ i ]['relation'][ j ]['$']['type']
        } else {
          s[ songId ] = {
            type     : this.data['metadata']['artist'][0]['relation-list'][ i ]['relation'][ j ]['$']['type'],
            title    : this.data['metadata']['artist'][0]['relation-list'][ i ]['relation'][ j ][ 'recording' ][0]['title'][0], 
            id       : songId
          }
        }  
      }
    }

    i++

  } // while, relation-list
  
  if ( typeof this.data['metadata']['artist'][0]['work-list'] !== 'undefined' ) {
    for (var i=0; i<this.data['metadata']['artist'][0]['work-list'][0]['work'].length; i++) {
      var songId = this.data['metadata']['artist'][0]['work-list'][0]['work'][ i ]['$']['id'] 
      if (typeof s[ songId ] !== 'undefined') {
        // song already found in relation-lists, any reason to do anyting here???
      } else {
        s[ songId ] = {
          title    : this.data['metadata']['artist'][0]['work-list'][0]['work'][ i ]['title'][0], 
          id       : songId
        }
      }  
    }
  } // if, work-list

  // convert s from object to array
  var s2 = Object.keys(s).map(function (key) {return s[key]});

  if (a != '') this.aka = a    
  if (b.length > 0) this.band = b
  if (s2.length > 0) this.songs = s2
  if (r.length > 0) this.relations = r

}

module.exports = Writer