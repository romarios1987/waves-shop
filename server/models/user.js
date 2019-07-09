const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const SALT_I = 10;

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

    if (this.isModified('password')) {

        bcrypt.genSalt(SALT_I,  (err, salt) =>{
            if (err) return next(err);

            bcrypt.hash(this.password, salt,  (err, hash) =>{
                if (err) return next(err);

                this.password = hash;
                next();
            })
        })

    } else {
        next();
    }

});

const User = mongoose.model('User', userSchema);


module.exports = {User};
