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

app.get('/moves/special/', function(req, res){
  var data = require('./data/move_data.json')
  var spec_moves = []
  for(var move_in in data){
    if(data[move_in].hasOwnProperty('energy_array')){
      spec_moves.push(data[move_in])
    }
  }
  spec_moves = spec_moves.sort(function(a, b){
    return a.name.localeCompare(b.name);
  });
  handlebars.loadPage('moves.handlebars', {moves: spec_moves}, (data)=>{
    res.send(data)
    res.end()
  })
})

app.get('/moves/basic/', function(req, res){
  var data = require('./data/move_data.json')
  var basic_moves = []
  for(var move_in in data){
    if(!data[move_in].hasOwnProperty('energy_array')){
      basic_moves.push(data[move_in])
    }
  }
  basic_moves = basic_moves.sort(function(a, b){
    return a.name.localeCompare(b.name);
  });
  handlebars.loadPage('moves.handlebars', {moves: basic_moves}, (data)=>{
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

app.get('/article/:article_folder/:article_name', function(req, res){
  var file = false
  for(var category in articles){
    for(var article_item in articles[category]['articles']){
      var item = articles[category]['articles'][article_item]
      if(item.slug == req.params['article_folder']+'/'+req.params['article_name']){
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