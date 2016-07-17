var fs = require('fs')
var handlebars = require('handlebars')

module.exports = {
  loadTemplate: function(filename, params){
    if(typeof params == 'undefined') params = {}
    var data = fs.readFileSync('./templates/' + filename, 'utf8')
    var template = handlebars.compile(data)
    return template(params)
  }
};