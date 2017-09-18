var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var FirmaUserSchema = new mongoose.Schema({

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
      resim: {
        type: String
        ////required: true
      },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  activateToken: String,
  firmaObj: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Firma'
  },
  firma: {
    type: String
    },
  role: {
    type: String,
    enum: ['Manager', 'Employer']
    },
  },
    {
      timestamps: { createdAt: 'olusturmaTarih', updatedAt: 'guncellemeTarih' } ,
      collection: 'firmauser'
    });

    FirmaUserSchema.pre('save', function(next){

        var firmauser = this;
        var SALT_FACTOR = 5;

        if(!firmauser.isModified('password')){
            return next();
        }

        bcrypt.genSalt(SALT_FACTOR, function(err, salt){

            if(err){
                return next(err);
            }

            bcrypt.hash(firmauser.password, salt, null, function(err, hash){

                if(err){
                    return next(err);
                }

                firmauser.password = hash;
                next();

            });
        });
    });

    FirmaUserSchema.pre('update', function(next){

        var firmauser = this;
        console.log(firmauser.email + "firmauser");
        var SALT_FACTOR = 5;

        if(!firmauser.isModified('password')){
            return next();
        }

        bcrypt.genSalt(SALT_FACTOR, function(err, salt){

            if(err){
                return next(err);
            }

            bcrypt.hash(firmauser.password, salt, null, function(err, hash){

                if(err){
                    return next(err);
                }

                firmauser.password = hash;
                next();

            });
        });
    });

    FirmaUserSchema.methods.comparePassword = function(passwordAttempt, cb){
      bcrypt.genSalt(5, function(err, salt){

          if(err){
              return next(err);
          }
          console.log(this.password+'    qweqweqweqwe     '+passwordAttempt);

          bcrypt.hash(passwordAttempt, salt, null, function(err, hash){

              if(err){
                  return next(err);
              }
              console.log(hash+'    asdasdasdasdasdasd');
          });
      });

        bcrypt.compare(passwordAttempt, this.password, function(err, isMatch){

            if(err){
                return cb(err);
            } else {
                cb(null, isMatch);
            }
        });
    }

    module.exports = mongoose.model('FirmaUser', FirmaUserSchema);
