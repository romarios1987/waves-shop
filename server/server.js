const express = require(`express`);
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
const mongoose = require(`mongoose`);
require('dotenv').config();

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DATABASE, {useNewUrlParser: true});
mongoose.set('useCreateIndex', true);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());


// Models
const {User} = require('./models/user');
const {Brand} = require('./models/brand');
const {Wood} = require('./models/wood');
const {Product} = require('./models/product');


// Middleware
const {auth} = require('./middleware/auth');
const {admin} = require('./middleware/admin');

/**********************************
 * ***************PRODUCTS***********
 ***********************************/

// by ARRIVAL
// /articles?sort_by=createdAt&order=desc&limit=2

// by SELL
// /articles?sort_by=sold&order=desc&limit=50

app.get('/api/product/articles', (req, res) => {
    console.log(req.query);
    let order = req.query.order ? req.query.order : 'asc';
    let sortBy = req.query.sort_by ? req.query.sort_by : '_id';
    let limit = req.query.limit ? parseInt(req.query.limit) : 100;


    Product
        .find()
        .populate('brand')
        .populate('wood')
        .sort([sortBy, order])
        .limit(limit)
        .exec((err, articles) => {
            if (err) return res.status(400).send(err);

            res.send(articles)
        })

});


// /api/product/articles_by_id?id=5d2591abbefe1e4517ff9e5a,5d2597ac42dbc65325351b1a&type=array

app.get('/api/product/articles_by_id', (req, res) => {
    let type = req.query.type;

    let items = req.query.id;


    if (type === 'array') {
        let ids = req.query.id.split(',');
        items = [];
        items = ids.map((item) => {
            return mongoose.Types.ObjectId(item)
        })
    }

    Product
        .find({'_id': {$in: items}})
        .populate('brand')
        .populate('wood')
        .exec((err, docs) => {
            return res.status(200).send(docs)
        })
});


app.post('/api/product/article', auth, admin, (req, res) => {
    const product = new Product(req.body);

    product.save((err, doc) => {
        if (err) return res.json({success: false, err});

        res.status(200).json({
            success: true,
            article: doc
        })
    })
});


/**********************************
 * ***************WOODS***********
 ***********************************/

app.post('/api/product/wood', auth, admin, (req, res) => {
    const wood = new Wood(req.body);

    wood.save((err, doc) => {
        if (err) return res.json({success: false, err});

        res.status(200).json({
            success: true,
            wood: doc
        })
    })
});


app.get('/api/product/woods', (req, res) => {

    Wood.find({}, (err, woods) => {
        if (err) return res.status(400).send(err);

        res.status(200).send(woods)
    });
});


/**********************************
 * ***************BRAND***********
 ***********************************/

app.post('/api/product/brand', auth, admin, (req, res) => {
    const brand = new Brand(req.body);

    brand.save((err, doc) => {
        if (err) return res.json({success: false, err});

        res.status(200).json({
            success: true,
            brand: doc
        })
    })
});


app.get('/api/product/brands', (req, res) => {

    Brand.find({}, (err, brands) => {
        if (err) return res.status(400).send(err);

        res.status(200).send(brands)
    });
});


/**********************************
 * ***************USERS***********
 ***********************************/

app.get('/api/users/auth', auth, (req, res) => {
    res.status(200).json({
        // user: req.user
        isAdmin: req.user.role !== 0,
        isAuth: true,
        email: req.user.email,
        last_name: req.user.last_name,
        first_name: req.user.first_name,
        role: req.user.role,
        cart: req.user.cart,
        history: req.user.history
    })
});


app.get('/api/users/logout', auth, (req, res) => {
    User.findOneAndUpdate(
        {_id: req.user._id},
        {token: ''},
        (err, doc) => {
            if (err) return res.json({logoutSuccess: false, err});

            return res.status(200).send({
                logoutSuccess: true,
                message: 'Logout Success'
            })
        }
    )
});


app.post('/api/users/register', (req, res) => {
    const user = new User(req.body);

    user.save((err, doc) => {
        if (err) return res.json({success: false, err});
        res.status(200).json({
            registerSuccess: true,
            // user_data: doc
        })


    })
});


app.post('/api/users/login', (req, res) => {

    // find email
    User.findOne({'email': req.body.email}, (err, user) => {
        if (!user) return res.json({loginSuccess: false, message: 'Auth fail, email not found'});

        // check password
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch) return res.json({loginSuccess: false, message: 'Wrong password'});


            // generate token
            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);

                res.cookie('x_auth', user.token).status(200).json({loginSuccess: true, message: 'Login Success'})

            })
        })
    })


});


const port = process.env.PORT || 3002;

app.listen(port, () => {
    console.log(`Server running at ${port}`);
});
