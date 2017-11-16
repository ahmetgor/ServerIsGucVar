var Basvuru = require('../models/basvuru');
var Kaydedilen = require('../models/kaydedilen');
var Ilan = require('../models/ilan');

exports.getBasvurular = function(req, res, next){
  // var st = new RegExp(req.query.term, "i")
  var ilanlar = [];

  console.log(req.query.skip+'   '+req.query.limit);
    Basvuru.find(
      { ozgecmis: req.query.ozgecmis
    // $and : [ query, {owner: owner},
    //   { $or: [{baslik: st}, {firma:st}, {durum:st}, {makina:st}, {olusturan:st}, {guncelleyen:st} ] }
    // ]
}, 'basvuru'
,function(err, kayitlar) {

      if (err){
          return res.send(err);
      }
      // console.log(kayitlar);
      // res.json(kayitlar);
      for (var key in kayitlar) {
      console.log(key, kayitlar[key].basvuru + 'ilan');
      ilanlar.push(kayitlar[key].basvuru);
      }

      Ilan.find(
        {
      $and : [  {_id: { $in : ilanlar}}, {enabled: true}
      ]
  },
  function(err, kayitlar) {
          if (err)  {
            console.log('getbasvurular error');
            return res.send(err);
          }
          console.log(kayitlar);
          res.json(kayitlar);

 })
.populate({ path: 'firma' })
// .exec(
.sort({guncellemeTarih: -1})
.skip(parseInt(req.query.skip)*parseInt(req.query.limit)).limit(parseInt(req.query.limit));
});   //basvuru find
}

exports.getKaydedilenler = function(req, res, next){
  var kaydedilen = [];
    Kaydedilen.find(
      { ozgecmis: req.query.ozgecmis
    // $and : [ query, {owner: owner},
    //   { $or: [{baslik: st}, {firma:st}, {durum:st}, {makina:st}, {olusturan:st}, {guncelleyen:st} ] }
    // ]
}
,function(err, kayitlar) {

      if (err){
          return res.send(err);
      }
      for (var key in kayitlar) {
      console.log(key, kayitlar[key].kaydedilen + 'ilan');
      kaydedilen.push(kayitlar[key].kaydedilen);
      }

      Ilan.find(
        {
      $and : [  {_id: { $in : kaydedilen}}, {enabled: true}
      ]
    },
    function(err, kayitlar) {
          if (err)  {
            console.log('getkaydedilenler error');
            return res.send(err);
          }
          console.log(kayitlar);
          res.json(kayitlar);
      })
.populate({ path: 'firma' }
// .exec(
).sort({guncellemeTarih: -1}).skip(parseInt(req.query.skip)*parseInt(req.query.limit)).limit(parseInt(req.query.limit));
    // .sort({guncellemeTarih: -1});
  });
}

exports.getBasvurularList = function(req, res, next){
  // var st = new RegExp(req.query.term, "i")
    Basvuru.find(
      { ozgecmis: req.query.ozgecmis
    // $and : [ query, {owner: owner},
    //   { $or: [{baslik: st}, {firma:st}, {durum:st}, {makina:st}, {olusturan:st}, {guncelleyen:st} ] }
    // ]
}, function(err, kayitlar) {

        if (err){
          console.log('getbasvurularlist error');
            return res.send(err);
        }
        res.json(kayitlar);
    });
    // .sort({guncellemeTarih: -1});
}

exports.getKaydedilenlerList = function(req, res, next){
  // var st = new RegExp(req.query.term, "i")
    Kaydedilen.find(
      { ozgecmis: req.query.ozgecmis
    // $and : [ query, {owner: owner},
    //   { $or: [{baslik: st}, {firma:st}, {durum:st}, {makina:st}, {olusturan:st}, {guncelleyen:st} ] }
    // ]
}, function(err, kayitlar) {

        if (err){
          console.log('getkaydedilenlist error');
            return res.send(err);
        }
        res.json(kayitlar);
    });
    // .sort({guncellemeTarih: -1});
}

  exports.getBasvuru = function(req, res, next){

        Basvuru.findOne({ _id: req.params.basvuru_id }, function(err, kayit) {

            if (err){
                return res.send(err);
            }
            res.json(kayit);
        });
}

exports.createBasvuru = function(req, res, next){
  console.log(JSON.stringify(req.body)+'create');

    Basvuru.create(req.body, function(err, kayit) {

        if (err){
            return res.send(err);
        }
        res.json(kayit);
    });
}

exports.deleteBasvuru = function(req, res, next){
  console.log(JSON.stringify(req.query.basvuruid)+'delete');
    Basvuru.remove({
        basvuru : req.query.basvuruid,
        ozgecmis : req.query.ozgecmis
    }, function(err, kayit) {

      if (err){
          return res.send(err);
      }
        res.json(kayit);
    });
}


// exports.getKaydedilenler = function(req, res, next){
//   // var st = new RegExp(req.query.term, "i")
//     Kaydedilen.find(
//       {ozgecmis: req.query.ozgecmis
//     // $and : [ query, {owner: owner},
//     //   { $or: [{baslik: st}, {firma:st}, {durum:st}, {makina:st}, {olusturan:st}, {guncelleyen:st} ] }
//     // ]
// }
// ,function(err, kayitlar) {
//
//         if (err){
//             res.send(err);
//         }
//
//         res.json(kayitlar);
//     }).sort({guncellemeTarih: -1});
// }

  exports.getKaydedilen = function(req, res, next){

        Kaydedilen.findOne({ _id: req.params.kaydedilen_id }, function(err, kayit) {

            if (err){
                return res.send(err);
            }

            res.json(kayit);
        });
}

exports.createKaydedilen = function(req, res, next){
  console.log(JSON.stringify(req.body)+'create');

    Kaydedilen.create(req.body, function(err, kayit) {

        if (err){
            return res.send(err);
        }
        res.json(kayit);
    });

}

exports.deleteKaydedilen = function(req, res, next){
  console.log(JSON.stringify(req.query.kaydedilenid)+'delete');

    Kaydedilen.remove({
        kaydedilen : req.query.kaydedilenid,
        ozgecmis : req.query.ozgecmis
    }, function(err, kayit) {

      if (err){
          return res.send(err);
      }
        res.json(kayit);
    });
}
