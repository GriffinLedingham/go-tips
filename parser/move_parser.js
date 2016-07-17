var data = require('../data/pokemon.json')
var jsonfile = require('jsonfile')

var move_data = []

for(var i in data){
  if(data[i].hasOwnProperty('Move')){
    var move = data[i]['Move']
    var name = data[i]['TemplateId'].split('MOVE_')[1].toLowerCase()
    var id = parseInt(data[i]['TemplateId'].split('_MOVE')[0].replace('V',''))
    var type = move['Type'].split('TYPE_')[1].toLowerCase()
    var accuracy = move['AccuracyChance']
    var crit = move['CriticalChance']
    var duration = move['DurationMs']
    var energy = move['EnergyDelta']

    var output = {
      name: name,
      id: id,
      type: type,
      accuracy: accuracy,
      crit: crit,
      duration: duration,
      energy: energy
    }
    move_data.push(output)
  }
}
jsonfile.writeFileSync('../data/move_data.json', move_data)