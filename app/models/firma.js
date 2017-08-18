var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var FirmaSchema = new mongoose.Schema({

    email: {
        type: String,
        // lowercase: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    enabled: {
        type: Boolean
      },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  activateToken: String,
  firma: {
    type: String
    },
  firmaPass: {
    type: String
    },
  },
  {
      timestamps: { createdAt: 'olusturmaTarih', updatedAt: 'guncellemeTarih' } ,
      collection: 'firma'
    });

FirmaSchema.pre('save', function(next){

    var firmaUser = this;
    var SALT_FACTOR = 5;

    if(!firmaUser.isModified('password') &&  !firmaUser.isModified('password')){
        return next();
    }

if(firmaUser.isModified('password')) {
    bcrypt.genSalt(SALT_FACTOR, function(err, salt){

        if(err){
            return next(err);
        }

        bcrypt.hash(firmaUser.password, salt, null, function(err, hash){

            if(err){
                return next(err);
            }

            firmaUser.password = hash;
            next();
        });
    });
  }
  if(firmaUser.isModified('firmaPass')) {
      bcrypt.genSalt(SALT_FACTOR, function(err, salt){

          if(err){
              return next(err);
          }

          bcrypt.hash(firmaUser.firmaPass, salt, null, function(err, hash){

              if(err){
                  return next(err);
              }

              firmaUser.password = hash;
              next();
          });
      });
    }
});

FirmaSchema.pre('update', function(next){

    var firmaUser = this;
    var SALT_FACTOR = 5;

    if(!firmaUser.isModified('password') &&  !firmaUser.isModified('password')){
        return next();
    }

if(firmaUser.isModified('password')) {
    bcrypt.genSalt(SALT_FACTOR, function(err, salt){

        if(err){
            return next(err);
        }

        bcrypt.hash(firmaUser.password, salt, null, function(err, hash){

            if(err){
                return next(err);
            }

            firmaUser.password = hash;
            next();
        });
    });
  }
  if(firmaUser.isModified('firmaPass')) {
      bcrypt.genSalt(SALT_FACTOR, function(err, salt){

          if(err){
              return next(err);
          }

          bcrypt.hash(firmaUser.firmaPass, salt, null, function(err, hash){

              if(err){
                  return next(err);
              }

              firmaUser.password = hash;
              next();
          });
      });
    }
});

FirmaSchema.methods.comparePassword = function(passwordAttempt, cb){

    bcrypt.compare(passwordAttempt, this.password, function(err, isMatch){

        if(err){
            return cb(err);
        } else {
            cb(null, isMatch);
        }
    });
}

FirmaSchema.methods.compareFirmaPass = function(passwordAttempt, cb){

    bcrypt.compare(passwordAttempt, this.firmaPass, function(err, isMatch){

        if(err){
            return cb(err);
        } else {
            cb(null, isMatch);
        }
    });
}

module.exports = mongoose.model('Firma', FirmaSchema);
