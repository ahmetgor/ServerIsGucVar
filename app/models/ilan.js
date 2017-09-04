var mongoose = require('mongoose');

var IlanSchema = new mongoose.Schema({

  id: {
      type: Number,
      get: v => _id.getTimestamp().getTime()
  },

    baslik: {
        type: String,
        required: true
    },

    firma: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Firma'
    },

    aciklama: {
        type: String,
        required: true
    },

    il: {
        type: String,
        required: true
    },

    tip: {
        type: String,
        enum: ['Yarı Z.', 'Tam Z.', 'Proje Bazlı', 'Günlük', 'Staj'],
        required: true
    },

    egitim: {
      type: [String],
      enum: ['Lise', 'Lisans', 'Yüksek Lisans', 'Doktora'],
      required: true
    },

    tecrube: {
      type: [String],
      enum: ['Az Tecrübeli (Junior)', 'Orta Tecrübeli (Midlevel)', 'Çok Tecrübeli (Senior)', 'Yönetici (Manager)', 'Stajyer', 'Hizmet Personeli & İşçi'],
      required: true
    },

    ehliyet: {
        type: String
    },

    askerlik: {
      type: String,
      enum: ['Yapıldı/Muaf', 'Yapılmadı/Tecilli'],
    },

    goruntulenme: {
        type: Number
    },

    basvurulma: {
        type: Number
    },

    olusturan: {
      type: String
    },

    guncelleyen: {
      type: String
    },

    enabled: {
        type: Boolean
    }

}, {
    timestamps: { createdAt: 'olusturmaTarih', updatedAt: 'guncellemeTarih' } ,
    collection: 'ilan'
  });

module.exports = mongoose.model('Ilan', IlanSchema);
