var Ilan = require('../models/ilan');
var mongoose = require('mongoose');
var FirmaUser = require('../models/firmauser');
var Firma = require('../models/firma');

exports.getIlanlar = function(req, res, next){

  var st = new RegExp(req.query.term, "i")
  var kayit = JSON.parse(req.query.kayit);

  if (kayit.tecrube!=undefined && kayit.tecrube.length > 0) {
    var tecrube = {tecrube:{ $in :kayit.tecrube }};
  }
  else {
    var tecrube = {};
  }

  if (kayit.egitim!=undefined && kayit.egitim.length > 0) {
    var egitim = {egitim:{ $in :kayit.egitim }};
  }
  else {
    var egitim = {};
  }

  if (kayit.firma)
  var firma = {firma: kayit.firma};
  else var firma = {firma: new RegExp("", "i")};

  // var firma = new RegExp(kayit.firma, "i");
  // var firma = null;
  var olusturan = kayit.olusturan ? new RegExp("^"+kayit.olusturan+"$", "i") : new RegExp(kayit.olusturan);
  // var enabled = kayit.enabled ? new RegExp("^"+kayit.enabled+"$", "i") : new RegExp(kayit.enabled);
  if (kayit.enabled)
  var enabled = {enabled: kayit.enabled};
  else var enabled = {};

  var order = JSON.parse(req.query.orderBy);
  var il = new RegExp(kayit.il, "i");
  console.log(tecrube);
  // console.log(JSON.stringify(order)+'order');
  console.log(JSON.stringify(kayit.il)+'il');

    Ilan.find(
      {
    $and : [ tecrube, egitim, {il: il}, {olusturan: olusturan}, enabled    ]
}
,function(err, kayitlar) {

        if (err)  {res.send(err);
          console.log(err);
        }
        console.log(req.query.term+"st");
        // console.log(kayitlar);
        var filtered = kayitlar.filter((ilan) => {
          // console.log(ilan.firma.firma);
              if(!ilan) return;
              else  return ilan.firma.firma.match(st) || ilan.baslik.match(st) || ilan.aciklama.match(st);
            });
        res.json(filtered);
    })
    .populate({ path: 'firma', match: { $or: [ firma]
    }})
    .skip(parseInt(req.query.skip)*parseInt(req.query.limit)).limit(parseInt(req.query.limit))
      .sort({_id: -1});


}

  exports.getIlan = function(req, res, next){
    console.log(req.params.kayit_id );

      Ilan.findOne({ _id: req.params.kayit_id }, function(err, kayit) {

          if (err){
              res.send(err);
          }
          // console.log(kayit._id);
          res.json(kayit);
      })
      .populate({ path: 'firma', match: {}});
    }

  exports.updateIlan = function(req, res, next){
        console.log(req.body);
        console.log(req.body.id+"body");
        console.log(req.params.ilan_id+"params");

        Ilan.findOneAndUpdate({ _id: req.params.ilan_id}, req.body, {new: true}, function(err, kayit) {

          if (err){
              res.send(err);
          }
          console.log(JSON.stringify(kayit)+"kayit");
            res.json(kayit);
        });
    }

    exports.createIlan = function(req, res, next){
      console.log(JSON.stringify(req.body)+'create');
      console.log(req.body.firma+"firma")
      // Firma.findOne({firma: new RegExp("^"+req.body.firma+"$", "i")}, function(err, existingFirma){
      //   if(err){
      //       return next(err);
      //   }
      //   req.body.firma = existingFirma._id;
        Ilan.create(req.body, function(err, kayit) {

            if (err){
              console.log(JSON.stringify(err)+'err');
                res.send(err);
            }
            res.json(kayit);
        });
      // });
    }

    exports.getUsers = function(req, res, next){
      console.log(req.params.firma_id );

        FirmaUser.find({ firmaObj: req.params.firma_id }, function(err, kayit) {

            if (err){
                res.send(err);
            }
            // console.log(kayit._id);
            res.json(kayit);
        });
      }
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
