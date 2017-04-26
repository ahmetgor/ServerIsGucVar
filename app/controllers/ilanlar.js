var Ilan = require('../models/ilan');

exports.getIlanlar = function(req, res, next){

  var st = new RegExp(req.query.term, "i")
  var kayit = JSON.parse(req.query.kayit);

  if (kayit.tecrube!=undefined && kayit.tecrube.length > 0) {
    // var tecrube = JSON.parse("{tecrube:{ $in:"+JSON.stringify(kayit.tecrube)+" }}");
    var tecrube = {tecrube:{ $in :kayit.tecrube }};
    console.log('OK');
  }
  else {
    console.log('NOK');
    var tecrube = {};
  }

  if (kayit.egitim!=undefined && kayit.egitim.length > 0) {
    // var tecrube = JSON.parse("{tecrube:{ $in:"+JSON.stringify(kayit.tecrube)+" }}");
    var egitim = {egitim:{ $in :kayit.egitim }};
    console.log('OK');
  }
  else {
    console.log('NOK');
    var egitim = {};
  }

  var firma = new RegExp(kayit.firma, "i")
  var order = JSON.parse(req.query.orderBy);
  // console.log(req.query.orderBy);
  // console.log(JSON.stringify(order)+'order');
  // console.log(firma+'firma');
  // console.log(JSON.stringify(egitim)+'egitim');
  // console.log(JSON.stringify(tecrube)+'tecrube');
  // console.log(kayit.egitim+'egitim query');
  // console.log(st+'st');
    Ilan.find(
      {
    $and : [ {firma: firma}, tecrube, egitim,
      { $or: [{isim: st}, {aciklama: st}, {firma: st} ] }
    ]
}
,function(err, kayitlar) {

        if (err)  {res.send(err);
        }
        res.json(kayitlar);

    }).sort(order);
}

  exports.getIlan = function(req, res, next){

      Ilan.findOne({ _id: req.params.kayit_id }, function(err, kayit) {

          if (err){
              res.send(err);
          }
          res.json(kayit);
      });

    Ilan.find(function(err, kayitlar) {
      console.log('/'+req.query.term+'/');

      if (err){
          res.send(err);
      }
      kayitlar.forEach(function(kayitloop){
        for (var key in kayitloop) {
          // console.log(kayitlar[key]);
          // console.log('hebe');
          console.log(kayitloop[key]);
          if (/req.query.term/.test(kayitloop[key]) )
         printjson(kayitloop);
    }
});
res.json(kayitlar);
});
}
