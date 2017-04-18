var mongoose = require('mongoose');

var KaydedilenSchema = new mongoose.Schema({

  ozgecmis: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ozgecmis'
  },

    kaydedilen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ilan'
    }

}, {
    timestamps: { createdAt: 'olusturmaTarih', updatedAt: 'guncellemeTarih' } ,
    collection: 'kaydedilen'
  });

  module.exports = mongoose.model('Kaydedilen', KaydedilenSchema);
