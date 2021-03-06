var Ozgecmis = require('../models/ozgecmis');
var AvatarsIO = require('avatars.io');
var Basvuru = require('../models/basvuru');
var mongoose = require('mongoose');
var Ilan = require('../models/ilan');
var async = require('async');
var cloudinary = require('cloudinary');
var User = require('../models/user');

exports.getOzgecmis = function(req, res, next){
      Ozgecmis.findOne({ _id: req.params.ozgecmis_id }, function(err, kayit) {

          if (err){
            return  res.send(err);
          }
          res.json(kayit);
      });
}

exports.updateOzgecmis = function(req, res, next){
    // console.log(req.body);
    // console.log(param_name+'    '+req.params.ozgecmis_id) ;
    // console.log(param_name+'    '+JSON.stringify(req.body)) ;
    var param_name = JSON.parse('{"'+req.params.param_name+'":'+JSON.stringify(req.body)+'}');
    console.log(JSON.stringify(param_name));

    Ozgecmis.findOneAndUpdate({ _id: req.params.ozgecmis_id }, param_name, {new: true}, function(err, kayit) {
      if (err){
        return  res.send(err);
      }
      console.log(JSON.stringify(kayit));
        res.json(kayit);
    });
}

exports.updateOzgecmisAll = function(req, res, next){
    // console.log(req.body);
    if(req.body.resim && req.body.resim.includes("data:image"))
    {
      cloudinary.v2.uploader.upload(req.body.resim, {timeout:120000}, function(err,result) {
        console.log(JSON.stringify(result)+'result');
        console.log(JSON.stringify(err)+'err');
        if (err){
          return res.status(422).send({error: 'cloudinary'});
        }

    req.body.guncellemeTarih = Date.now();
    req.body.resim = result.secure_url;
    Ozgecmis.findOneAndUpdate({ _id: req.params.ozgecmis_id }, req.body, {new: true}, function(err, kayit) {

      if (err){
        return  res.send(err);
      }
        res.json(kayit);
    });
  });
  }
  else {

    Ozgecmis.findOneAndUpdate({ _id: req.params.ozgecmis_id }, req.body, {new: true}, function(err, kayit) {
      if (err){
        return  res.send(err);
      }
        res.json(kayit);
    });
  }
}

exports.getOzgecmisler = function(req, res, next){

  var st = new RegExp(req.query.term, "i")
  var kayit = JSON.parse(req.query.kayit);
  var ObjectId = mongoose.Types.ObjectId(kayit.userId);
  var ilanlar = [];
  var ozgecmisler = [];

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
  if (kayit.basvuruId!=undefined && kayit.basvuruId.length > 0) {
    var id = { _id:kayit.basvuruId };
    console.log('OK'+kayit.basvuruId);
  }
  else {
    console.log('NOKbas'+kayit.basvuruId);
    var id = {};
  }
  if (kayit.firma!=undefined && kayit.firma.length > 0 && kayit.firma != "t" ) {
    var firma = { firma:kayit.firma };
    console.log('OK'+kayit.firma);
  }
  else {
    console.log('NOKbas'+kayit.firma);
    var firma = {};
  }

  // var firma = new RegExp(kayit.firma, "i")
  // var firma = kayit.firma||kayit.firma != 't' ? kayit.firma : mongoose.Types.ObjectId(kayit.firma);
  // console.log("firma  "+kayit.firma)
  var olusturan = kayit.olusturan ? new RegExp(kayit.olusturan, "i") : new RegExp(kayit.olusturan);
  // var order = JSON.parse(req.query.orderBy);
  var sehir = kayit.sehir ? new RegExp("^"+kayit.sehir+"$", "i") : new RegExp(kayit.sehir);
  var unvan = new RegExp(kayit.unvan, "i");
  var isim = new RegExp(kayit.isim, "i");
  var dil = kayit.dil ? new RegExp("^"+kayit.dil+"$", "i") : new RegExp("");
  // var bilgisayar = kayit.bilgisayar ? new RegExp(kayit.bilgisayar, "i") : new RegExp(kayit.bilgisayar);

// if (kayit.bilgisayar) {
//   var bilgisayar = kayit.bilgisayar.split(',');
//   for (var key in bilgisayar) {
//   bilgisayar[key] = new RegExp(bilgisayar[key].trim(), "i");
//   console.log(key, bilgisayar[key] + 'bilgisayar');
//   }
// }
// else var bilgisayar = [new RegExp("")];

  var yilTecrube = kayit.yilTecrube ? kayit.yilTecrube : -1;
  var egitimdurum = kayit.egitimdurum ? kayit.egitimdurum : -1;
  var seviye = kayit.seviye ? kayit.seviye : -1;
  var dogumTarihi = kayit.dogumTarihi ? kayit.dogumTarihi : -10000000000000;
  var ozgecmisno = isNaN(req.query.term) ? {id: {$lte : -1}} : {id:req.query.term};
  // var basvuruId = new RegExp(kayit.basvuruId, "i");
  // var basvuruId = kayit.basvuruId;
  console.log(olusturan+'olusturan');
  console.log(JSON.stringify(firma)+'firma');
  console.log(JSON.stringify(id)+'id');
  console.log(dil+'dil');
  console.log(egitimdurum+'egitimdurum');
  // console.log(bilgisayar[0]+'bilgisayar');
  console.log(JSON.stringify(segment)+'segment');


  Ilan.find(
    { $and : [ {olusturan: olusturan}, firma, id
      // ,{$or : [ ]}
]}, '_id'
,function(err, kayitlar) {
      // if (err)  {res.send(err);
      // }
    for (var key in kayitlar) {
    console.log(key, kayitlar[key]._id + 'ilan');
    ilanlar.push(kayitlar[key]._id);
    }

    Basvuru.find(
      {
    $and : [  {basvuru: { $in : ilanlar}}
    ]
}, 'ozgecmis'
// [ {
//       $lookup:
//         {
//           from: "ozgecmis",
//           localField: "ozgecmis",
//           foreignField: "_id",
//           as: "ozgecmis"
//         }
//    },
//    { $match: {basvuru: { $in : ilanlar}} },
//    { $group: { _id: "$ozgecmis" } },
//    { $sort: {_id: -1} },
//    { $limit: parseInt(req.query.limit) },
//    { $skip: parseInt(req.query.skip)*parseInt(req.query.limit) }
// ]
,function(err, kayitlar) {
  // console.log(JSON.stringify(kayitlar)+"kayitlar");
        if (err)  {res.send(err);
        }

        for (var key in kayitlar) {
        console.log(key, kayitlar[key].ozgecmis + '   ozgecmis');
        ozgecmisler.push(kayitlar[key].ozgecmis);
      }

      Ozgecmis.find(
        {
        $and : [ {_id: { $in : ozgecmisler}}, segment, {sehir: sehir}, {unvan: unvan}, {isim: isim},
                  {yabanciDil: { $elemMatch: { dil: dil, seviye: { $gte: seviye }}}},
                  { yilTecrube: { $gte: yilTecrube }}, { dogumTarihi: { $gte: dogumTarihi }}, {enabled: true},
                   { egitimdurum: { $gte: egitimdurum }},
                   // {bilgisayar: { $all: bilgisayar}},
                  // { egitimdurum: { $gte: egitimdurum }},
              { $or: [{isim: st}, {unvan: st}, {sehir: st},
                // {bilgisayar: { $all: st}},
                  {egitim: {$elemMatch: {okul:st}}}, {egitim: {$elemMatch: {ulke:st}}}, {egitim: {$elemMatch: {bolum:st}}},
                  {tecrube: {$elemMatch: {pozisyon:st}}}, {tecrube: {$elemMatch: {firma:st}}},
                  {tecrube: {$elemMatch: {isTanimiKisa:st}}}, {tecrube: {$elemMatch: {ulke:st}}},
                  ozgecmisno
                ] }
            ]
     },
     function(err, kayitlar) {
             // console.log(JSON.stringify(kayitlar)+"kayitlar");
             if (err)  {
               return res.send(err);
             }
                 // kayitlar = kayitlar.filter((item) => {
                 //   return (item.ozgecmis != null);
                 // })
            //  console.log(kayitlar);
             res.json(kayitlar);
        // console.log(JSON.stringify(kayitlar));
        // res.json(kayitlar);

    })
      .skip(parseInt(req.query.skip)*parseInt(req.query.limit)).limit(parseInt(req.query.limit))
      .sort({enabled: -1, _id: -1});
    // TODO: egitim, tecrübe, egitimdurum, yaş, tecrübe
    // .populate({ path: 'ozgecmis', match: { $and : [ segment, {sehir: sehir}, {unvan: unvan}, {isim: isim},
    //           {yabanciDil: { $elemMatch: { dil: dil}}}, { yilTecrube: { $gte: yilTecrube }}, { dogumTarihi: { $gte: dogumTarihi }},
    //       { $or: [{isim: st}, {unvan: st}, {egitimdurum: st}, {sehir: st}, {enabled: true} ] }
    //     ]}})
    //   .skip(parseInt(req.query.skip)*parseInt(req.query.limit)).limit(parseInt(req.query.limit))
    //   .sort({_id: -1})
    //   .aggregate(
    // [
    //     { "$group": { "_id": "$ozgecmis" } }
    // ],
    // function(err,results) {
    // });
      // .exec(

          });
  });
}

exports.begenOzgecmis = function(req, res, next){
  var begenObject = req.body.userId;
  // console.log(JSON.stringify(begenObject)+"begenObject");

  var not = {};
  not.aciklama = req.body.firma + ' sizi beğenilenler listesine ekledi.';
  not.notTarih = Date.now();
  not.okundu = 'N';

  switch(req.body.segment) {
    case 'okundu':
    var segment = { $push: { okundu: begenObject }};
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
  // console.log(JSON.stringify(not)+"not");

    Ozgecmis.update({ _id: req.params.ozgecmis_id }, segment,  function(err, kayit) {

      User.findOneAndUpdate({ ozgecmis : req.params.ozgecmis_id}, {$push: {not: not}},
        // { runValidators: true, context: 'query' },
        function(err, user) {

          console.log(user);

      if (err){
        return  res.send(err);
      }
        res.json(kayit);
    });
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
        return  res.send(err);
      }
        res.json(kayit);
    });
}
