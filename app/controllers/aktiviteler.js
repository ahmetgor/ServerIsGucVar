var Basvuru = require('../models/basvuru');
var Kaydedilen = require('../models/kaydedilen');

exports.getBasvurular = function(req, res, next){
  // var st = new RegExp(req.query.term, "i")
    Basvuru.find(
      { ozgecmis: req.query.ozgecmis
    // $and : [ query, {owner: owner},
    //   { $or: [{baslik: st}, {firma:st}, {durum:st}, {makina:st}, {olusturan:st}, {guncelleyen:st} ] }
    // ]
}).populate({ path: 'basvuru', options: { sort: { guncellemeTarih: -1 }}})
.exec(function(err, kayitlar) {

        if (err){
            res.send(err);
        }

        res.json(kayitlar);
    });
    // .sort({guncellemeTarih: -1});
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
            res.send(err);
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
            res.send(err);
        }

        res.json(kayitlar);
    });
    // .sort({guncellemeTarih: -1});
}

  exports.getBasvuru = function(req, res, next){

        Basvuru.findOne({ _id: req.params.basvuru_id }, function(err, kayit) {

            if (err){
                res.send(err);
            }

            res.json(kayit);
        });
}

exports.createBasvuru = function(req, res, next){

    Basvuru.create(req.body, function(err, kayit) {

        if (err){
            res.send(err);
        }
        res.json(kayit);
    });

}

exports.deleteBasvuru = function(req, res, next){

    Basvuru.remove({
        _id : req.params.basvuru_id
    }, function(err, kayit) {

      if (err){
          res.send(err);
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
                res.send(err);
            }

            res.json(kayit);
        });
}

exports.createKaydedilen = function(req, res, next){

    Kaydedilen.create(req.body, function(err, kayit) {

        if (err){
            res.send(err);
        }
        res.json(kayit);
    });

}

exports.deleteKaydedilen = function(req, res, next){

    Kaydedilen.remove({
        _id : req.params.kaydedilen_id
    }, function(err, kayit) {

      if (err){
          res.send(err);
      }
        res.json(kayit);
    });
}
