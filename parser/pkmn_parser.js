var data = require('../data/pokemon.json')
var jsonfile = require('jsonfile')

var pokemon_data = []

for(var i in data){
  if(data[i].hasOwnProperty('Pokemon')){
    var pokemon = data[i]['Pokemon']
    var name = pokemon['UniqueID'].split('POKEMON_')[1].toLowerCase()
    var id = parseInt(pokemon['UniqueID'].split('_POKEMON')[0].replace('V',''))
    var type = []
    if(pokemon.hasOwnProperty('Type1')){
      type.push(pokemon['Type1'].split('TYPE_')[1].toLowerCase())
    }
    if(pokemon.hasOwnProperty('Type2')){
      type.push(pokemon['Type2'].split('TYPE_')[1].toLowerCase())
    }

    var encounter = pokemon['Encounter']
    var cap_rate = encounter['BaseCaptureRate']
    var flee_rate = encounter['BaseFleeRate']
    var collision = encounter['CollisionRadiusM']

    var stats = pokemon['Stats']
    var stam = stats['BaseStamina']
    var atk = stats['BaseAttack']
    var def = stats['BaseDefense']

    var quick_moves_encoded = pokemon['QuickMoves']
    var quick_moves = []

    if(quick_moves_encoded.indexOf('\\001') != -1){
      var move_arr = quick_moves_encoded.split('\\001')
      for(var j in move_arr){
        if(move_arr[j] != ''){
          var item = move_arr[j]
          move_arr[j] = parseInt(item.replace('\\',''),8)
          quick_moves.push(move_arr[j])
        }
      }
    } else {
      var octal_moves = quick_moves_encoded.match(/\\[0-9]+/g)
      quick_moves_encoded = quick_moves_encoded.replace(/\\[0-9]+/g, '')
      if(octal_moves != null){
        for(var j = 0;j<octal_moves.length;j++){
          quick_moves.push(parseInt(octal_moves[j].replace('\\',''),8))
        }
      }
      for(var j = 0;j<quick_moves_encoded.length;j++){
        quick_moves.push(parseInt(quick_moves_encoded[j].charCodeAt(0).toString(16),16))
      }
    }

    var cine_moves_encoded = pokemon['CinematicMoves']
    var cine_moves = []

    if(cine_moves_encoded.indexOf('\\001') != -1){
      var move_arr = cine_moves_encoded.split('\\001')
      for(var j in move_arr){
        if(move_arr[j] != ''){
          var item = move_arr[j]
          move_arr[j] = parseInt(item.replace('\\',''),8)
          cine_moves.push(move_arr[j])
        }
      }
    } else {
      var octal_moves = cine_moves_encoded.match(/\\[0-9]+/g)
      cine_moves_encoded = cine_moves_encoded.replace(/\\[0-9]+/g, '')
      if(octal_moves != null){
        for(var j = 0;j<octal_moves.length;j++){
          cine_moves.push(parseInt(octal_moves[j].replace('\\',''),8))
        }
      }
      for(var j = 0;j<cine_moves_encoded.length;j++){
        cine_moves.push(parseInt(cine_moves_encoded[j].charCodeAt(0).toString(16),16))
      }
    }

    for(var j = 0;j<quick_moves.length;j++){
      var move_id = quick_moves[j]
      for(var k = 0;k<data.length;k++){
        if(data[k].hasOwnProperty('Move')){
          if(data[k]['TemplateId'].indexOf(move_id) != -1){
            var move_name = data[k]['TemplateId'].split('MOVE_')[1].toLowerCase()
            quick_moves[j] = {id: move_id, name: move_name.replace(/\_/g,' ').replace(' fast', '')}
            break
          }
        }
      }
    }

    for(var j = 0;j<cine_moves.length;j++){
      var move_id = cine_moves[j]
      for(var k = 0;k<data.length;k++){
        if(data[k].hasOwnProperty('Move')){
          if(data[k]['TemplateId'].indexOf(move_id) != -1){
            var move_name = data[k]['TemplateId'].split('MOVE_')[1].toLowerCase()
            cine_moves[j] = {id: move_id, name: move_name.replace(/\_/g,' ').replace(' fast', '')}
            break
          }
        }
      }
    }

    var evolution = false
    if(pokemon.hasOwnProperty('Evolution')){
      var evolution_encoded = pokemon['Evolution']
      if(evolution_encoded.indexOf('\\001') == -1){
        if(evolution_encoded.indexOf('\\') != -1){
          evolution = parseInt(evolution_encoded.replace('\\',''),8)
        } else {
          evolution = parseInt(evolution_encoded.charCodeAt(0).toString(16),16)
        }
        for(var k = 0;k<data.length;k++){
          if(data[k].hasOwnProperty('Pokemon')){
            if(data[k]['TemplateId'].indexOf(evolution) != -1){
              var poke_name = data[k]['TemplateId'].split('POKEMON_')[1].toLowerCase()
              evolution = {id: evolution, name: poke_name}
              break
            }
          }
        }
      } else {
        var evo_array = pokemon['Evolution'].split('\\001')
        evolution = []
        for(var z = 0;z<evo_array.length;z++){
          if(evo_array[z] != '') {
            var temp_evolution = parseInt(evo_array[z].replace('\\',''),8)
            for(var k = 0;k<data.length;k++){
              if(data[k].hasOwnProperty('Pokemon')){
                if(data[k]['TemplateId'].indexOf(temp_evolution) != -1){
                  var poke_name = data[k]['TemplateId'].split('POKEMON_')[1].toLowerCase()
                  evolution.push({id: temp_evolution, name: poke_name})
                  break
                }
              }
            }
          }
        }
      }
    }

    var output = {
      name: name,
      id: id,
      type: type,
      encounter: {
        flee_rate: parseFloat(flee_rate),
        collision: parseFloat(collision),
        cap_rate: parseFloat(cap_rate) || 0
      },
      stats: {
        hp: stam,
        attack: atk,
        defense: def
      },
      quick_moves: quick_moves,
      special_moves: cine_moves
    }
    if(evolution != false) {
      output.evolution = evolution
      output.evolution_cost = pokemon['CandyToEvolve']
    }
    pokemon_data.push(output)
  }
}
jsonfile.writeFileSync('../data/pokemon_data.json', pokemon_data)