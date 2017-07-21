var mongoose = require('mongoose');

var BasvuruSchema = new mongoose.Schema({

  ozgecmis: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ozgecmis'
  },

  basvuru: {
      type: String,
      ref: 'Ilan'
    }

}, {
    timestamps: { createdAt: 'olusturmaTarih', updatedAt: 'guncellemeTarih' } ,
    collection: 'basvuru'
  });

BasvuruSchema.index({ ozgecmis: 1, basvuru: 1}, { unique: true });

module.exports = mongoose.model('Basvuru', BasvuruSchema);
