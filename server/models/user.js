const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SALT_I = 10;

require('dotenv').config();

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        required: true,
        minLength: 5,
    },
    first_name: {
        type: String,
        required: true,
        maxLength: 100
    },
    last_name: {
        type: String,
        required: true,
        maxLength: 100
    },
    cart: {
        type: Array,
        default: []
    },
    history: {
        type: Array,
        default: []
    },
    role: {
        type: Number,
        default: 0
    },
    token: {
        type: String
    }
});

userSchema.pre('save', function (next) {


    // this === user


    if (this.isModified('password')) {

        bcrypt.genSalt(SALT_I, (err, salt) => {
            if (err) return next(err);

            bcrypt.hash(this.password, salt, (err, hash) => {
                if (err) return next(err);

                this.password = hash;
                next();
            })
        })

    } else {
        next();
    }

});


userSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch)
    })
};


userSchema.methods.generateToken = function (cb) {

    // this === user

    // user.id + password
    this.token = jwt.sign(this._id.toHexString(), process.env.SECRET);

    this.save((err, user) => {
        if (err) return cb(err);
        cb(null, user)
    })


};


userSchema.statics.findByToken = function (token, cb) {

    // this === user

    jwt.verify(token, process.env.SECRET, (err, decode) => {
        this.findOne({"_id": decode, "token": token}, (err, user) => {
            if (err) return cb(err);
            cb(null, user)
        })
    })

};

const User = mongoose.model('UserLayout', userSchema);
module.exports = {User};
