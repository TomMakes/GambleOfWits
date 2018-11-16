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

const getTradeStickers = (request, response) => {
	const req = request;
	const res = response;
	
	return Sticker.StickerModel.findByTradable(true, (err, docs) => {
		if(err) {
			console.log(err);
			return res.status(400).json({ error: 'An error occured' });
		}

		return res.json({ stickers: docs });
	});
};

module.exports.tradePage = tradePage;
module.exports.getTradeStickers = getTradeStickers;
