var Ozgecmis = require('../models/ozgecmis');
var AvatarsIO = require('avatars.io');
var Basvuru = require('../models/basvuru');
var mongoose = require('mongoose');
var Ilan = require('../models/ilan');
var async = require('async');

exports.getOzgecmis = function(req, res, next){
      Ozgecmis.findOne({ _id: req.params.ozgecmis_id }, function(err, kayit) {

          if (err){
              res.send(err);
          }
          res.json(kayit);
      });
}

exports.updateOzgecmis = function(req, res, next){
    // console.log(req.body);
    var param_name = JSON.parse('{"'+req.params.param_name+'":'+JSON.stringify(req.body)+'}');
    // var name = JSON.parse(req.params.param_name);
    // console.log(param_name+'    '+req.params.ozgecmis_id) ;
    // console.log(param_name+'    '+JSON.stringify(req.body)) ;
    // console.log(param_name);
    console.log(JSON.stringify(param_name));
    Ozgecmis.update({ _id: req.params.ozgecmis_id }, param_name, function(err, kayit) {

      if (err){
          res.send(err);
      }
      console.log(JSON.stringify(kayit));
        res.json(kayit);
    });
}

exports.updateOzgecmisAll = function(req, res, next){
    // console.log(req.body);
    Ozgecmis.update({ _id: req.params.ozgecmis_id }, req.body, function(err, kayit) {

      if (err){
          res.send(err);
      }
        res.json(kayit);
    });
}

exports.getOzgecmisler = function(req, res, next){

  var st = new RegExp(req.query.term, "i")
  var kayit = JSON.parse(req.query.kayit);
  var ObjectId = mongoose.Types.ObjectId(kayit.userId);
  var ilanlar = [];

  switch(kayit.segment) {
    case 'okundu':
    var segment = {okundu: ObjectId};
    console.log("hebe1");
    break;
    case 'begen':
    var segment = {begen: ObjectId};
    console.log("hebe");
    break;
    case 'cokbegen':
    var segment = {cokbegen: ObjectId};
    break;
    default:
    var segment = { okundu: { $ne: ObjectId }, begen: { $ne: ObjectId }, cokbegen: { $ne: ObjectId } };
  }

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
  // var firma = new RegExp(kayit.firma, "i")
  var firma = kayit.firma ? new RegExp("^"+kayit.firma+"$", "i") : new RegExp(kayit.firma);
  var olusturan = kayit.olusturan ? new RegExp("^"+kayit.olusturan+"$", "i") : new RegExp(kayit.olusturan);
  var order = JSON.parse(req.query.orderBy);
  var sehir = kayit.sehir ? new RegExp("^"+kayit.sehir+"$", "i") : new RegExp(kayit.sehir);
  var unvan = new RegExp(kayit.unvan, "i");
  var isim = new RegExp(kayit.isim, "i");
  var dil = kayit.dil ? new RegExp("^"+kayit.dil+"$", "i") : new RegExp(kayit.dil);

  var yilTecrube = kayit.yilTecrube ? kayit.yilTecrube : -1;
  var dogumTarihi = kayit.dogumTarihi ? kayit.dogumTarihi : -100000;
  var basvuruId = new RegExp(kayit.basvuruId, "i");
  // var basvuruId = kayit.basvuruId;
  console.log(kayit.olusturan+'olusturan');
  console.log(kayit.firma+'firma');
  // console.log(JSON.stringify(order)+'order');
  console.log(JSON.stringify(segment)+'segment');

  Ilan.find(
    {
  $and : [ {firma: firma}, {olusturan: olusturan}]
}, '_id'
,function(err, kayitlar) {
      // if (err)  {res.send(err);
      // }
    for (var key in kayitlar) {
    console.log(key, kayitlar[key]._id);
    ilanlar.push(kayitlar[key]._id);
    }
    // console.log(basvuruId+" basvuruid");
    // console.log(kayit.basvuruId+" kayit.basvuruid");
    // console.log(JSON.stringify(ilanlar)+"ilanlarinner");

    Basvuru.find(
      {
    $or : [  {basvuru: { $in : ilanlar}}
      // ["58ecf27d59cf2ca65d4e0871","59089a0a4be8d6e2c51b7e22","59089a234be8d6e2c51b7e23","58ecf27d59cf2ca65d4e0873","58ecf27d59cf2ca65d4e0872"]}}
      // { $or: [{isim: st}, {unvan: st}, {egitimdurum: st}, {adres: st} ] }
    ]
}
,function(err, kayitlar) {
  // console.log(JSON.stringify(kayitlar)+"kayitlar");
        if (err)  {res.send(err);
        }
            kayitlar = kayitlar.filter((item) => {
              return (item.ozgecmis != null);
            })
        // console.log(JSON.stringify(kayitlar));
        res.json(kayitlar);

    })
    // TODO: egitim, tecrübe, egitimdurum, yaş, tecrübe
    .populate({ path: 'ozgecmis', match: { $and : [ segment, {sehir: sehir}, {unvan: unvan}, {isim: isim},
              {yabanciDil: { $elemMatch: { dil: dil}}}, { yilTecrube: { $gte: yilTecrube }}, { dogumTarihi: { $gte: dogumTarihi }},
          { $or: [{isim: st}, {unvan: st}, {egitimdurum: st}, {sehir: st}, {enabled: true} ] }
        ]}})
      // .populate('begen')
      .skip(parseInt(req.query.skip)*parseInt(req.query.limit)).limit(parseInt(req.query.limit))
      .sort({_id: -1});
  });

}

exports.begenOzgecmis = function(req, res, next){
  var begenObject = req.body.userId;
  // var begenObject = mongoose.Types.ObjectId(req.body.userId);
  switch(req.body.segment) {
    case 'okundu':
    var segment = { $push: { okundu: begenObject } };
    break;
    case 'begen':
    var segment = { $push: { begen: begenObject } };
    break;
    case 'cokbegen':
    var segment = { $push: { cokbegen: begenObject } };
    break;
    default:
    var segment = {};
  }
  // console.log(JSON.stringify(segment)+"segment");
    Ozgecmis.update({ _id: req.params.ozgecmis_id }, segment,  function(err, kayit) {

      if (err){
          res.send(err);
      }
        res.json(kayit);
    });
}

exports.begenmeOzgecmis = function(req, res, next){
  var begenObject = req.body.userId;
  // var begenObject = mongoose.Types.ObjectId(req.body.userId);
  switch(req.body.segment) {
    case 'okundu':
    var segment = { $pull: { okundu: begenObject } };
    break;
    case 'begen':
    var segment = { $pull: { begen: begenObject } };
    break;
    case 'cokbegen':
    var segment = { $pull: { cokbegen: begenObject } };
    break;
    default:
    var segment = {};
  }
    Ozgecmis.update({ _id: req.params.ozgecmis_id }, segment, function(err, kayit) {

      if (err){
          res.send(err);
      }
        res.json(kayit);
    });
}
