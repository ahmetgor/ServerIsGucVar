var mongoose = require('mongoose');

var NotSchema = new mongoose.Schema({

  ozgecmis: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ozgecmis'
  },

  aciklama: {
      type: String
  },

  okundu: {
      type: String
  },

}, {
    timestamps: { createdAt: 'olusturmaTarih', updatedAt: 'guncellemeTarih' } ,
    collection: 'not'
  });

// NotSchema.index({ ozgecmis: 1, kaydedilen: 1}, { unique: true });

module.exports = mongoose.model('Not', NotSchema);
