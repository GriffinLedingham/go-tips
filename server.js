var bodyParser = require('body-parser')
var fs = require('fs')
var http = require('http')
var express = require('express')
var app = express()
var handlebars = require('./helpers/handlebars_helper')

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

app.get('*', function(req, res){
  res.send(404)
  res.end()
})

var server = http.createServer(app)
server.listen(process.env.PORT || 3000)