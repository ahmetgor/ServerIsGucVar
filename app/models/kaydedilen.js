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

KaydedilenSchema.index({ ozgecmis: 1, kaydedilen: 1}, { unique: true });

module.exports = mongoose.model('Kaydedilen', KaydedilenSchema);
