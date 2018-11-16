const models = require('../models');

const Sticker = models.Sticker;


const makerPage = (req, res) => {
  Sticker.StickerModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), stickers: docs });
  });
};



const gamblePage = (req, res) => {
  Sticker.StickerModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.render('gamble', { csrfToken: req.csrfToken(), stickers: docs });
  });
};


const makeSticker = (req, res) => {
  if (!req.body.name || !req.body.rarity) {
    return res.status(400).json({ error: 'Both name and rarity are required' });
  }
	
  let pattern = new RegExp(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/);
  if(pattern.test(req.body.name) || pattern.test(req.body.rarity)){
	  return res.status(400).json({ error: 'No special characters allowed in names!' });
  }

  const stickerData = {
    name: req.body.name,
    rarity: req.body.rarity,
	tradable: false,
    owner: req.session.account._id,
  };

  const newSticker = new Sticker.StickerModel(stickerData);

  const stickerPromise = newSticker.save();

  stickerPromise.then(() => res.json({ redirect: '/maker' }));

  stickerPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Sticker already exists.' });
    }

    return res.status(400).json({ error: 'An error occured' });
  });
  return stickerPromise;
};

const getStickers = (request, response) => {
	const req = request;
	const res = response;
	
	return Sticker.StickerModel.findByOwner(req.session.account._id, (err, docs) => {
		if(err) {
			console.log(err);
			return res.status(400).json({ error: 'An error occured' });
		}

		return res.json({ stickers: docs });
	});
};

const getSticker = (request, response) => {
	const req = request;
	const res = response;
	//parsing URL to obtain the string 
	//Get rid of the URL and isolate variables
	var reqId = req.url.split("?");
	//Take only the first variable as it's the domoId
	reqId = reqId[1].split("&");
	console.log(reqId[0]);
	
	return Sticker.StickerModel.findByID(reqId[0], (err, docs) => {
		if(err) {
			console.log(err);
			return res.status(400).json({ error: 'An error occured' });
		}
		console.dir(JSON.stringify(docs));
		docs.owner = undefined;
		return res.json({ sticker: docs });
	});
};

const toggleTradeSticker =  (request, response) => {
	const req = request;
	const res = response;
	//parsing URL to obtain the string 
	//Get rid of the URL and isolate variables
	var reqId = req.url.split("?");
	console.log(req.url);
	//Take only the first variable as it's the domoId
	reqId = reqId[1].split("&");
	console.log(reqId[1]);
	let changedModel = {};
	let parsedModel = {};
	
	Sticker.StickerModel.findByID(reqId[0], (err, docs) => {
		if(err) {
			console.log(err);
			return res.status(400).json({ error: 'An error occured' });
		}
		changedModel = JSON.stringify(docs);
		changedModel = JSON.parse(changedModel);
		changedModel.tradable = !(changedModel.tradable);
		docs.tradable = changedModel.tradable;
		//const toggledSticker = new Sticker.StickerModel(changedModel);
		const stickerPromise = docs.save();

  		stickerPromise.then(() => res.json({ redirect: '/maker' }));
		
		stickerPromise.catch((err) => {
    		console.log(err);
    		if (err.code === 11000) {
      			return res.status(400).json({ error: 'Sticker already exists.' });
    		}

    		return res.status(400).json({ error: 'An error occured' });
  		});
		return stickerPromise;
	});
	
	/*return Sticker.StickerModel.toggleTradable(reqId[0], reqId[1], (err, docs) => {
		if(err) {
			console.log(err);
			return res.status(400).json({ error: 'An error occured' });
		}
		
		return res.json({ sticker: docs });
	}); */
};


module.exports.makerPage = makerPage;
module.exports.gamblePage = gamblePage;
module.exports.getStickers = getStickers;
module.exports.getSticker = getSticker;
module.exports.make = makeSticker;
module.exports.toggleTrade = toggleTradeSticker;
