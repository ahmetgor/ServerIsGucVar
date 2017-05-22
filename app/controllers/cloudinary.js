var cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: 'isgucvar',
  api_key: '139222621445761',
  api_secret: 'MgNsTRvxidEy0HaIARj4Ip7Txq0'
});

exports.postAvatar = function(req, res, next){
  // console.log(JSON.stringify(req.body.resim)+'body');
  // console.log(JSON.stringify(req.body.resim)+'body');

cloudinary.uploader.upload(req.body.resim, function(err,result) {
  console.log(JSON.stringify(result)+'result');
  console.log(JSON.stringify(err)+'err');

  res.json(result);
});
}
