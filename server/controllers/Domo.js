const models = require('../models');

const Domo = models.Domo;


const makerPage = (req, res) => {
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), domos: docs });
  });
};

const gamblePage = (req, res) => {
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.render('gamble', { csrfToken: req.csrfToken(), domos: docs });
  });
};


const makeDomo = (req, res) => {
  if (!req.body.name || !req.body.rarity) {
    return res.status(400).json({ error: 'RAWR! Both name and rarity are required' });
  }

  const domoData = {
    name: req.body.name,
    rarity: req.body.rarity,
	tradable: false,
    owner: req.session.account._id,
  };

  const newDomo = new Domo.DomoModel(domoData);

  const domoPromise = newDomo.save();

  domoPromise.then(() => res.json({ redirect: '/maker' }));

  domoPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists.' });
    }

    return res.status(400).json({ error: 'An error occured' });
  });
  return domoPromise;
};

const getDomos = (request, response) => {
	const req = request;
	const res = response;
	
	return Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
		if(err) {
			console.log(err);
			return res.status(400).json({ error: 'An error occured' });
		}
		
		return res.json({ domos: docs });
	});
};

const getDomo = (request, response) => {
	const req = request;
	const res = response;
	//parsing URL to obtain the string 
	//Get rid of the URL and isolate variables
	var reqId = req.url.split("?");
	//Take only the first variable as it's the domoId
	reqId = reqId[1].split("&");
	console.log(reqId[0]);
	
	return Domo.DomoModel.findById(reqId[0], (err, docs) => {
		if(err) {
			console.log(err);
			return res.status(400).json({ error: 'An error occured' });
		}
		
		return res.json({ domos: docs });
	});
};


module.exports.makerPage = makerPage;
module.exports.gamblePage = gamblePage;
module.exports.getDomos = getDomos;
module.exports.getDomo = getDomo;
module.exports.make = makeDomo;
