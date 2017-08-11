var Ilan = require('../models/ilan');
var mongoose = require('mongoose');

exports.getIlanlar = function(req, res, next){

  var st = new RegExp(req.query.term, "i")
  var kayit = JSON.parse(req.query.kayit);

  if (kayit.tecrube!=undefined && kayit.tecrube.length > 0) {
    var tecrube = {tecrube:{ $in :kayit.tecrube }};
    console.log('OK');
  }
  else {
    console.log('NOK');
    var tecrube = {};
  }

  if (kayit.egitim!=undefined && kayit.egitim.length > 0) {
    var egitim = {egitim:{ $in :kayit.egitim }};
    console.log('OK');
  }
  else {
    console.log('NOK');
    var egitim = {};
  }

  if (kayit.firma)
  var firma = {firma: kayit.firma};
  else var firma = {};

  // var firma = new RegExp(kayit.firma, "i");
  // var firma = null;
  var olusturan = kayit.olusturan ? new RegExp("^"+kayit.olusturan+"$", "i") : new RegExp(kayit.olusturan)
  // var olusturan = kayit.olusturan
  var order = JSON.parse(req.query.orderBy);
  var il = new RegExp(kayit.il, "i");
  console.log(kayit.tecrube+'tecrube');
  // console.log(JSON.stringify(order)+'order');
  console.log(JSON.stringify(kayit.il)+'il');

    Ilan.find(
      {
    $and : [ firma, tecrube, egitim, {il: il}, {olusturan: olusturan},
      { $or: [{baslik: st}, {aciklama: st}, {firma: st} ] }
    ]
}
,function(err, kayitlar) {

        if (err)  {res.send(err);
        }

        res.json(kayitlar);

    }).skip(parseInt(req.query.skip)*parseInt(req.query.limit)).limit(parseInt(req.query.limit))
      .sort({_id: -1});
}

  exports.getIlan = function(req, res, next){

      Ilan.findOne({ _id: req.params.kayit_id }, function(err, kayit) {

          if (err){
              res.send(err);
          }
          console.log(kayit._id.getTimestamp().getTime());
          console.log(kayit.id);
          res.json(kayit);
      });
//     Ilan.find(function(err, kayitlar) {
//       console.log('/'+req.query.term+'/');
//
//       if (err){
//           res.send(err);
//       }
//       kayitlar.forEach(function(kayitloop){
//         for (var key in kayitloop) {
//           // console.log(kayitlar[key]);
//           // console.log('hebe');
//           console.log(kayitloop[key]);
//           if (/req.query.term/.test(kayitloop[key]) )
//          printjson(kayitloop);
//     }
// });
// res.json(kayitlar);
// });
}
