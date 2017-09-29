var mongoose = require('mongoose');

var CounterSchema = new mongoose.Schema({
    id: {type: String, required: true},
    seq: { type: Number }
},
{
  timestamps: { createdAt: 'olusturmaTarih', updatedAt: 'guncellemeTarih' } ,
  collection: 'counters'
});
module.exports = mongoose.model('Counter', CounterSchema);
