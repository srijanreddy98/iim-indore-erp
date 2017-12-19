const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const {keys} = require('./keys/keys');
require('./services/passport');
const {routes} = require('./routes/authRoutes');
const {User} = require('./models/models');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/iim-indore');
const app = express();
app.use(
  cookieSession({
    maxAge: 30 * 24 * 3600 * 1000,
    keys: [keys.cookieKey]
  })
);
app.use(passport.initialize());
app.use(passport.session());
routes(app);
const PORT = process.env.POST || 3000;
app.listen(PORT, () => console.log(`Server is up on port:${PORT}`));
