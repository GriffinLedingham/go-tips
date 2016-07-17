var bodyParser = require('body-parser')
var fs = require('fs')
var http = require('http')
var express = require('express')
var app = express()
var handlebars = require('./helpers/handlebars_helper')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static(__dirname + '/client'))

app.get('/', function(req, res){
  res.send(handlebars.loadTemplate('home.handlebars'))
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
server.listen(3000)