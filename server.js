var bodyParser = require('body-parser')
var fs = require('fs')
var http = require('http')
var express = require('express')
var app = express()
var handlebars = require('./helpers/handlebars_helper')
var articles = require('./articles/articles.json')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static(__dirname + '/client'))
app.use('/favicon.ico', express.static(__dirname + '/client/images/favicon.ico'))

app.get('/', function(req, res){
  var data = require('./data/pokemon_data.json')
  handlebars.loadPage('pokedex.handlebars', {pokemon: data}, (data)=>{
    res.send(data)
    res.end()
  })
})

app.get('/pokemon/:pokemon', function(req, res){
  var data = require('./data/pokemon_data.json')
  var pokemon = false
  if(req.params.hasOwnProperty('pokemon')){
    for(var i in data){
      if(data[i].name.toLowerCase() == req.params['pokemon'].toLowerCase()){
        pokemon = data[i]
        break
      }
    }
  }
  if(pokemon != false){
    handlebars.loadPage('pokemon.handlebars', pokemon, (data)=>{
      res.send(data)
      res.end()
    })
  } else {
    res.send(404)
    res.end()
  }
})

app.get('/article/:article_name', function(req, res){
  var file = false
  for(var category in articles){
    for(var article_item in articles[category]['articles']){
      var item = articles[category]['articles'][article_item]
      if(item.slug == req.params['article_name']){
        file = item
        break
      }
    }
    if(file != false)
      break
  }
  articles[req.params['article_name']]
  if(file != false) {
    fs.readFile('./articles/text/'+file.slug+'.html',(err, article_data)=>{
      file.content = article_data
      handlebars.loadPage('article.handlebars', file, (data)=>{
        res.send(data)
        res.end()
      })
    })
  } else {
    res.send(404)
    res.end()
  }
})

app.get('*', function(req, res){
  res.send(404)
  res.end()
})

var server = http.createServer(app)
server.listen(process.env.PORT || 3000)