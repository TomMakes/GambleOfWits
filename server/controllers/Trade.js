const models = require('../models');

const Sticker = models.Sticker;

const tradePage = (req, res) => {
  Sticker.StickerModel.findByTradable(true, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.render('trade', { csrfToken: req.csrfToken(), stickers: docs });
  });
};