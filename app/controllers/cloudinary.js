var cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: 'isgucvar',
  api_key: '139222621445761',
  api_secret: 'MgNsTRvxidEy0HaIARj4Ip7Txq0'
});

exports.getAvatar = function(req, res, next){

cloudinary.uploader.upload(req.url, function(result) {
  console.log(result);
  res.json(result);
});
}
