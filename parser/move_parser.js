var data = require('../data/pokemon.json')
var jsonfile = require('jsonfile')

var move_data = []

for(var i in data){
  if(data[i].hasOwnProperty('Move')){
    var move = data[i]['Move']
    var name = data[i]['TemplateId'].split('MOVE_')[1].toLowerCase().replace('_fast','').replace(/_/, ' ')
    var id = parseInt(data[i]['TemplateId'].split('_MOVE')[0].replace('V',''))
    var type = move['Type'].split('TYPE_')[1].toLowerCase()
    var accuracy = move['AccuracyChance']
    var crit = move['CriticalChance']
    var duration = move['DurationMs']
    var energy = move['EnergyDelta']
    var power = move['Power']
    var energy_array = false

    if(energy < 0){
      console.log(energy)
      var abs_energy = Math.abs(energy)
      energy_array = []
      for(var i = 0;i<Math.floor(100/abs_energy);i++){
        energy_array.push({id: i, percent: (150*(abs_energy/100))-10})
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
      energy: energy
    }
    if(energy_array != false)
      output.energy_array = energy_array
    move_data.push(output)
  }
}
jsonfile.writeFileSync('../data/move_data.json', move_data)