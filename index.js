const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const {keys} = require('./keys/keys');
require('./services/passport');
const {routes} = require('./routes/authRoutes');
const { User, Record, Subject, TimeTable } = require('./models/models');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://srijanreddy98:chintu98@ds161336.mlab.com:61336/iimindoredb');
const app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(__dirname+'/dist'));
// app.use(express.static('dist'));
app.use(
  cookieSession({
    maxAge: 30 * 24 * 3600 * 1000,
    keys: [keys.cookieKey]
  })
);
// app.get('/client/*', function (req, res) {
// res.sendFile(path.join(__dirname+'/dist','index.html'));
// });
// catch 404 and forward to error handler
// app.use(function(req, res, next) {
// var err = new Error('Not Found It');
// err.status = 404;
// next(err);
// });
app.use(passport.initialize());
app.use(passport.session());
routes(app);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is up on port:${PORT}`));
