var mongoose = require('mongoose');

var BasvuruSchema = new mongoose.Schema({

  ozgecmis: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ozgecmis'
  },

    basvuru: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ilan'
    }

}, {
    timestamps: { createdAt: 'olusturmaTarih', updatedAt: 'guncellemeTarih' } ,
    collection: 'basvuru'
  });

module.exports = mongoose.model('Basvuru', BasvuruSchema);
