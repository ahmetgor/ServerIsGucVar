var mongoose = require('mongoose');
var Counter = require('../models/counter');

var IlanSchema = new mongoose.Schema({

  id: {
      type: Number
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

  IlanSchema.pre('save', function(next){

      var ilan = this;

      Counter.findOneAndUpdate({id: 'ilanid'},
          {$inc: { seq: 1} }, function(error, counter)   {
          if(error)
          return next(error);
          console.log("ilan"+counter.seq)
          ilan.id = counter.seq;
          next();

        });
    });

module.exports = mongoose.model('Ilan', IlanSchema);
