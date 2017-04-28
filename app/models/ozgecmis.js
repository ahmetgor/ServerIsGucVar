var mongoose = require('mongoose');

var OzgecmisSchema = new mongoose.Schema({

  id: {
      type: Number,
      required: true
  },

    isim: {
        type: String,
        required: true
    },

    soyisim: {
        type: String,
        required: true
    },

    dogumTarihi: {
        type: Date,
        required: true
    },

    tc: {
        type: String,
        enum: ['Evet', 'Hayır'],
        required: true
    },

    egitim: {
      okul: {
        type: String,
        required: true
      },
      bolum: {
        type: String,
      },
      derece: {
        type: String,
        enum: ['Lise', 'Lisans', 'Yüksek Lisans', 'Doktora'],
        required: true
      },
      cikis: {
        type: Date,
        required: true
      },
      sehir: {
        type: String,
        required: true
      },
      ulke: {
        type: String,
        required: true
      }
    },

    tecrube: {
      firma: {
        type: String,
        required: true
      },
      pozisyon: {
        type: String,
      },
      giris: {
        type: Date,
        required: true
      },
      cikis: {
        type: Date,
        required: true
      },
      sehir: {
        type: String,
        required: true
      },
      ulke: {
        type: String,
        required: true
      },
      isTanimiKisa: {
        type: String,
        required: true
      },
      detay: {
        type: String,
      }
    },

    yabanciDil: {
      dil: {
        type: String,
        required: true
      },
      seviye: {
        type: String,
        enum: ['Orta', 'İyi', 'Çok İyi', 'Mükemmel'],
        required: true
      }
    },

    sertifika: {
      ad: {
        type: String,
        required: true
      },
      cikis: {
        type: Date,
        required: true
      },
      kurum: {
        type: String,
        required: true
      }
    },

    egitimdurum: {
      type: String,
      enum: ['Lise', 'Lisans', 'Yüksek Lisans', 'Doktora'],
      required: true
    },

    tecrubedurum: {
      type: [String],
      enum: ['Az Tecrübeli (Junior)', 'Orta Tecrübeli (Midlevel)', 'Çok Tecrübeli (Senior)', 'Yönetici (Manager)', 'Stajyer', 'Hizmet Personeli & İşçi'],
      required: true
    },

    ehliyet: {
        type: String
    },

    askerlik: {
      type: String,
      enum: ['Yapıldı & Muaf', 'Yapılmadı & Tecilli'],
      required: true
    },

    medeni: {
      type: String,
      enum: ['Evli', 'Bekar'],
      required: true
    },

    telefon: {
        type: Number,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    adres: {
        type: String,
        required: true
    },

    bilgisayar: {
        type: String,
        required: true
    }

}, {
    timestamps: { createdAt: 'olusturmaTarih', updatedAt: 'guncellemeTarih' } ,
    collection: 'ozgecmis'
  });

module.exports = mongoose.model('Ozgecmis', OzgecmisSchema);
