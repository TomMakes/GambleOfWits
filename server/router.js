const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getStickers', mid.requiresLogin, controllers.Sticker.getStickers);
  app.get('/getSticker', mid.requiresLogin, controllers.Sticker.getSticker);
  app.get('/toggleTrade', mid.requiresLogin, controllers.Sticker.toggleTrade);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/gamble', mid.requiresLogin, controllers.Sticker.gamblePage);
  app.get('/maker', mid.requiresLogin, controllers.Sticker.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.Sticker.make);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
