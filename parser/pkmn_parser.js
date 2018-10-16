var data = require('../data/pokemon.json')
var moves = require('../data/move_data.json')
var cp_data = require('../data/cp_up.json')
var jsonfile = require('jsonfile')

var pokemon_data = []

for(var i in data){
  // if(data[i].hasOwnProperty('Pokemon')){
    var pokemon = data[i]
    var name = pokemon['id'].toLowerCase()
    var id = pokemon['dex']

    if(!isLive(id)) continue

    var type = []
    for(var typeIn in pokemon['types']) {
      type.push('<span class="pk-mon-type '+pokemon['types'][typeIn]['name'].toLowerCase()+'">'+pokemon['types'][typeIn]['name'].toLowerCase()+'</span>')
    }

    type = type.join().replace(',',' / ')

    var height = pokemon['height']
    var weight = pokemon['weight']

    var encounter = pokemon['encounter']
    var cap_rate = encounter['baseCaptureRate']
    var flee_rate = encounter['baseFleeRate']
    var collision = encounter['collisionRadius']

    var stats = pokemon['stats']
    var stam = stats['baseStamina']
    var atk = stats['baseAttack']
    var def = stats['baseDefense']

    var cp = pokemon['maxCP']

    var quick_moves_encoded = pokemon['quickMoves']
    var quick_moves = []

    for(var qmIn in quick_moves_encoded) {
      var moveId = quick_moves_encoded[qmIn]['id']
      for(var mIn in moves) {
        if(moves[mIn]['id'] == moveId) {
          var tempMove = moves[mIn]
          quick_moves.push({
            name:tempMove['name'],
            type:tempMove['type'].toLowerCase(),
            power:tempMove['power']
          })
          break;
        }
      }
    }

    var cine_moves_encoded = pokemon['cinematicMoves']
    var cine_moves = []

    for(var qmIn in cine_moves_encoded) {
      var moveId = cine_moves_encoded[qmIn]['id']
      for(var mIn in moves) {
        if(moves[mIn]['id'] == moveId) {
          var tempMove = moves[mIn]
          cine_moves.push({
            name:tempMove['name'],
            type:tempMove['type'].toLowerCase(),
            power:tempMove['power'],
            energy_array:tempMove['energy_array']
          })
          break;
        }
      }
    }

    var evolution = false
    var evolution_cost = false

    if(pokemon.hasOwnProperty('evolution') && pokemon['evolution'].hasOwnProperty('futureBranches')){
      evolution = {name: pokemon['evolution']['futureBranches'][0]['name'].toLowerCase(), candy:pokemon['family']['name'].toLowerCase()}
      for(var pkIn in data) {
        if(data[pkIn]['name'].toLowerCase() == pokemon['evolution']['futureBranches'][0]['name'].toLowerCase()) {
          evolution['id'] = pad(data[pkIn]['dex'],3)
          break
        }
      }
      evolution['form'] = getForm(evolution['name'])
      evolution_cost = pokemon['evolution']['futureBranches'][0]['costToEvolve']['candyCost']
    }

    var output = {
      name: jsUcfirst(name.replace('_',' ')),
      name_clean: stripForm(jsUcfirst(name.replace('_',' '))),
      name_cap: name[0].toUpperCase() + name.slice(1),
      id: id,
      form: getForm(jsUcfirst(name.replace('_',' '))),
      id_pad: pad(id,3),
      type: type,
      encounter: {
        flee_rate: parseFloat(flee_rate),
        collision: parseFloat(collision),
        cap_rate: parseFloat(cap_rate) || 0
      },
      stats: {
        hp: stam,
        attack: atk,
        defense: def,
        height: height,
        weight: weight,
        cp: cp
      },
      quick_moves: quick_moves,
      special_moves: cine_moves
    }
    if(evolution != false) {
      output.evolution = evolution
      output.evolution_cost = evolution_cost
    }
    pokemon_data.push(output)
  // }
}
jsonfile.writeFileSync('../data/pokemon_data.json', pokemon_data)

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function jsUcfirst(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getForm(name) {
  var form = '00'
  var n = (name.toLowerCase())
  if(n.indexOf('alola') != -1) {
    form = 61
  } else if(n.indexOf('rainy') != -1) {
    form = 13
  } else if(n.indexOf('sunny') != -1) {
    form = 12
  } else if(n.indexOf('snowy') != -1) {
    form = 14
  }
  return form
}

function stripForm(name) {
  return name
          .replace(' alola', '')
          .replace(' sunny', '')
          .replace(' rainy', '')
          .replace(' snowy', '')
}

function isLive(number) {
  var result = true
  if(number > 386) {
    var liveGen4 = [
      387,
      388,
      389,
      390,
      391,
      392,
      393,
      394,
      395,
      396,
      397,
      398,
      399,
      400,
      401,
      402,
      427,
      428,
      441,
      455
    ]

    if(liveGen4.indexOf(number) == -1) {
      result = false
    }
  }
  return result
}