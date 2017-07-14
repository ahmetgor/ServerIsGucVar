var Ozgecmis = require('../models/ozgecmis');
var AvatarsIO = require('avatars.io');
var Basvuru = require('../models/basvuru');
var mongoose = require('mongoose');

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
    var segment = {};
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

  var firma = new RegExp(kayit.firma, "i")
  var olusturan = new RegExp(kayit.olusturan, "i")
  var order = JSON.parse(req.query.orderBy);
  var il = new RegExp(kayit.il, "i")
  // var basvuruId = kayit.basvuruId;
  console.log(kayit.tecrube+'tecrube');
  console.log(kayit.basvuruId+'basvuruId');

  // console.log(JSON.stringify(order)+'order');
  console.log(JSON.stringify(segment)+'segment');

    Basvuru.find(
      {
    $and : [ {basvuru: kayit.basvuruId}
      // { $or: [{isim: st}, {unvan: st}, {egitimdurum: st}, {adres: st} ] }
    ]
}
,function(err, kayitlar) {

        if (err)  {res.send(err);
        }
            kayitlar = kayitlar.filter((item) => {
              return (item.ozgecmis != null);
            })
        // console.log(JSON.stringify(kayitlar));
        res.json(kayitlar);

    }).populate({ path: 'ozgecmis', match: {$and : [ segment,
          { $or: [{isim: st}, {unvan: st}, {egitimdurum: st}, {sehir: st} ] }
        ]}})
      // .populate('begen')
      .skip(parseInt(req.query.skip)*parseInt(req.query.limit)).limit(parseInt(req.query.limit))
      .sort({_id: -1});
}

exports.begenOzgecmis = function(req, res, next){

    Ozgecmis.update({ _id: req.params.ozgecmis_id }, param_name, function(err, kayit) {

      if (err){
          res.send(err);
      }
      console.log(JSON.stringify(kayit));
        res.json(kayit);
    });
}
