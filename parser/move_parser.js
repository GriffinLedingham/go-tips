var data = require('../data/move.json')
var jsonfile = require('jsonfile')

var move_data = []

for(var i in data){

    var move = data[i]
    var name = move['name'].replace(' Fast','')
    var id = move['id']
    var type = move['pokemonType']['name'].toLowerCase()
    var accuracy = move['accuracyChance']
    var crit = move['criticalChance']
    var duration = move['durationMs']/1000
    var energy = move['energyDelta']
    var power = move['power']
    var energy_array = false
    var dps = (power/(duration)).toFixed(2)

    if(energy < 0){
      console.log(energy)
      var abs_energy = Math.abs(energy)
      energy_array = []
      for(var i = 0;i<Math.floor(100/abs_energy);i++){
        energy_array.push({id: i, percent: (150*(abs_energy/100))-10+2})
      }
    }

    var output = {
      name: name,
      id: id,
      type: type,
      power: power,
      accuracy: accuracy,
      crit: crit,
      duration: duration,
      energy: energy,
      dps: dps
    }
    if(energy_array != false)
      output.energy_array = energy_array
    move_data.push(output)

}
jsonfile.writeFileSync('../data/move_data.json', move_data)