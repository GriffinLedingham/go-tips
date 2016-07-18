var fs = require('fs')
var handlebars = require('handlebars')
var articles = require('../articles/articles.json')

module.exports = {
  loadTemplate: function(filename, params, cb){
    if(typeof params == 'undefined') params = {}
    fs.readFile('./templates/' + filename, 'utf8', (err, data)=>{
      var template = handlebars.compile(data)
      cb(template(params))
    })
  },

  loadPage: function(filename, params, cb){
    if(typeof params == 'undefined') params = {}
    fs.readFile('./templates/' + filename, 'utf8', (err, data)=>{
      var template = handlebars.compile(data)

      this.loadTemplate('left_nav.handlebars',{data:articles},(left_nav)=>{
        params.left_nav = left_nav
        this.loadTemplate('header.handlebars',{},(header)=>{
          params.header = header
          this.loadTemplate('footer.handlebars',{data:articles},(footer)=>{
            params.footer = footer
            cb(template(params))
          })
        })
      })
    })
  }
};