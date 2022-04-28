const mongoose = require('mongoose');

const UserSchema =mongoose.Schema({
    email: {
        type: String,
        requied: true,
        trim: true,
        unique: 1,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    username: {
        type: String,
        required: true,
        maxlength: 25,
        unique: 1,
    },
    token: {
        type: String,
    },
});

UserSchema.pre("save", function (next) {
    var user = this;
  
    if (user.isModified("password")) {
      bcrypt.genSalt(SALT_I, function (err, salt) {
        if (err) {
          return next(err);
        } 
        bcrypt.hash(user.password, salt, function (err, hash) {
          if (err) {
            return next(err);
          } 
          user.password = hash;
          next();
        });
      });
    } else {
      next();
    }
  });

  UserSchema.methods.comparePasswords = function (password, callback) {
    var user = this;
    bcrypt.compare(candidatePassword, user.password, function (err, isMatch) {
      if (err) {
        return callback(err);

      }
      callback(null, isMatch);
    });
  };

  UserSchema.methods.generateToken = function (cb) {
    let user = this;
    let token = jwt.sign(user._id.toHexString(), config.PERSIST_LOGIN_SECRET);
  
    user.token = token;
    user.save(function (err, user) {
      if (err) {
        return cb(err);
    }
      cb(null, user);
    });
  };

  UserSchema.statics.findByToken = function (token, callback) {
    var user = this;
  
    jwt.verify(token, config.PERSIST_LOGIN_SECRET, function (err, decode) {
     
      user.findOne({ _id: decode, token: token }, function (err, user) {
        if (err) {
          return cb(err);
        } 

        callback(null, user);
      });
    });
  };

  UserSchema.methods.deleteToken = function (token, callback) {
    var user = this;
  
    user.updateOne({ $unset: { token: 1 } }, function (err, user) {
      if (err) {
        return cb(err);
      } 
      callback(null, user);
    });
  };

const User = mongoose.model('users', UserSchema)
module.exports = User;