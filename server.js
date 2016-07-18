var bodyParser = require('body-parser')
var fs = require('fs')
var http = require('http')
var express = require('express')
var app = express()
var handlebars = require('./helpers/handlebars_helper')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/favicon.ico', express.static(__dirname + '/client/images/favicon.ico'))

app.use(express.static(__dirname + '/client'))

app.get('/', function(req, res){
  var data = require('./data/pokemon_data.json')
  res.send(handlebars.loadTemplate('pokedex.handlebars', {pokemon: data}))
  res.end()
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
  if(pokemon != false)
    res.send(handlebars.loadTemplate('pokemon.handlebars', pokemon))
  else
    res.send(404)
  res.end()
})

app.get('/tips/:pokemon', function(req, res){
  res.send(handlebars.loadTemplate('tips.handlebars', {pokemon: req.params.pokemon}))
  res.end()
})

app.get('*', function(req, res){
  res.send(404)
  res.end()
})

var server = http.createServer(app)
server.listen(process.env.PORT || 3000)