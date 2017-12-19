const passport = require('passport');

var routes = (app) => {
  app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
  })
  );
  app.get(
    '/auth/google/callback',
     passport.authenticate('google'),
    (req, res) => {
      console.log(req);
      res.redirect('/api/current_user');
    }
  );
  app.get('/api/logout', (req, res) => {
    req.logout();
    res.send('Logged Out');
  })
  app.get('/api/current_user', (req, res) => {
    res.send(req.user);
  });
  app.get('/', (req, res) => {
    res.send("Its Working");
  });
}
module.exports = {
  routes
}
