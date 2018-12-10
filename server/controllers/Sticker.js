const models = require('../models');

// Require the account controlled in order to directly use functions
const accountController = require('./Account.js');

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

const upgradePage = (req, res) => {
  return res.render('upgrade', { csrfToken: req.csrfToken() });
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

  const pattern = new RegExp();
	// depricated for now /[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/
  if (pattern.test(req.body.name) || pattern.test(req.body.rarity)) {
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
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.json({ stickers: docs });
  });
};

const getSticker = (request, response) => {
  const req = request;
  const res = response;
  // parsing URL to obtain the string
  // Get rid of the URL and isolate variables
  let reqId = req.url.split('?');
  // Take only the first variable as it's the domoId
  reqId = reqId[1].split('&');
  console.log(reqId[0]);

  return Sticker.StickerModel.findByID(reqId[0], (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    const idInfo = docs;
    idInfo.owner = undefined;
    return res.json({ sticker: idInfo });
  });
};

const generateStickers = (req, res) => {
  // parsing URL to obtain the string
  // Get rid of the URL and isolate variables
  let reqId = req.url.split('?');
  console.log(req.url);
  // Take only the first variable as it's the pack name
  reqId = reqId[1].split('&');
  
  // Run the set algorithms for each card pack
  const pickedSet = Math.floor(Math.random() * (5 - 0) + 0);

  // Create a number of possible sticker packs the user can recieve
  const sets = [[1, 2, 3, 4, 9], [2, 4, 6, 8, 10],
				[1, 3, 5, 7, 9], [3, 5, 6, 7, 8], [2, 3, 4, 8, 10]];
  let names;
  let rarities;
  let url;
  console.dir(reqId);
  // If it is the firstPack
  if (reqId[0] === 'firstPack') {
    console.log("First pack is picked");
    // Make array of the names and rarities of possible stickers.
    names = ['Mailbox', 'Tire', 'Teacup', 'Car', 'Plane', 'Coffee',
      'Domo', 'Clippy', 'Dragon', 'Horse'];
    rarities = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5];
  
    url = ['mailbox.png', 'tyre.png', 'Teacup.png',
      'electric-car.png', 'DdOo-Paper-plane.png',
      'coffe.png', 'domofaceNo.jpeg', 'clippy.png',
      'GlitchSimplifiedCuteDragon.png', 'blackhorse.png'];
  }

  // If it is the animal pack
  if (reqId[0] === 'animalPack') {
    // Make array of the names and rarities of possible stickers.
    names = ['Water Turtle', 'Bunbun', 'Toy Bear',
             'Gerald', 'Angry Dog', 'Christmas Bear',
      'Ascended Cat', 'Evil Cat', 'Bunny', 'Cute Turtle'];
    rarities = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5];

    url = ['animalPack/Anonymous-turtle.png',
      'animalPack/pitr-bunny-icon.png', 'animalPack/toy-bear.png',
      'animalPack/Gerald-Dog.png', 'animalPack/angry-dog.png',
      'animalPack/Christmas-Bear.png', 'animalPack/winke-winke.png', 'animalPack/cat-smile.png',
      'animalPack/Bunny.png', 'animalPack/turtle.png'];
  }


	// Grab the specific array
  const choice = sets[pickedSet];
  console.dir(names[choice[1]]);

	// Create the stickers for user in database
  for (let i = 0; i < choice.length; i++) {
    const stickerData = {
      name: names[ (choice[i] - 1) ],
      rarity: rarities[ (choice[i] - 1) ],
      url: "assets/img/" + url[ (choice[i] - 1) ],
      tradable: false,
      owner: req.session.account._id,
    };
    const newSticker = new Sticker.StickerModel(stickerData);

    const stickerPromise = newSticker.save();

    // stickerPromise.then(() => res.json({ redirect: '/maker' }));

    stickerPromise.catch((err) => {
      console.log(err);
      if (err.code === 11000) {
        return res.status(400).json({ error: 'Sticker already exists.' });
      }

      return res.status(400).json({ error: 'An error occured' });
    });
  }

  return getStickers(req, res);
};

const toggleTradeSticker = (request, response) => {
  const req = request;
  const res = response;
  // parsing URL to obtain the string
  // Get rid of the URL and isolate variables
  let reqId = req.url.split('?');
  // Take only the first variable as it's the domoId
  reqId = reqId[1].split('&');
  let changedModel = {};

  Sticker.StickerModel.findByID(reqId[0], (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    changedModel = JSON.stringify(docs);
    changedModel = JSON.parse(changedModel);
    changedModel.tradable = !(changedModel.tradable);
    const idInfo = docs;
    idInfo.tradable = changedModel.tradable;
    idInfo.balance = parseInt(reqId[2], 10);
    // const toggledSticker = new Sticker.StickerModel(changedModel);
    const stickerPromise = idInfo.save();

    stickerPromise.then(() => res.json({ redirect: '/maker' }));
    stickerPromise.catch((err2) => {
      console.log(err2);
      if (err2.code === 11000) {
        return res.status(400).json({ error: 'Sticker already exists.' });
      }

      return res.status(400).json({ error: 'An error occured' });
    });
    return stickerPromise;
  });
};

const changeOwner = (request, response) => {
  const req = request;
  const res = response;
  //  parsing URL to obtain the string
  //  Get rid of the URL and isolate variables
  let reqId = req.url.split('?');
  //  Take only the first variable as it's the domoId
  reqId = reqId[1].split('&');
  let changedModel = {};

  Sticker.StickerModel.findByID(reqId[0], (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    // Create copy of the sticker data to manipulate
    const sticker = docs;
    
    // Change the balance of the buyer and seller
    accountController.tradeBalance(sticker.owner, req.session.account._id, sticker.balance);

    changedModel = JSON.stringify(docs);
    changedModel = JSON.parse(changedModel);
    changedModel.tradable = !(changedModel.tradable);
    
    // Change the owner and balance
    sticker.tradable = changedModel.tradable;
    sticker.owner = req.session.account._id;
    sticker.balance = 0;
    // const toggledSticker = new Sticker.StickerModel(changedModel);
    const stickerPromise = sticker.save();

    stickerPromise.then(() => res.json({ redirect: '/trade' }));

    stickerPromise.catch((err2) => {
      console.log(err2);
      if (err2.code === 11000) {
        return res.status(400).json({ error: 'Sticker already exists.' });
      }
      return res.status(400).json({ error: 'An error occured' });
    });
    return stickerPromise;
  });
};


module.exports.makerPage = makerPage;
module.exports.gamblePage = gamblePage;
module.exports.upgradePage = upgradePage;
module.exports.getStickers = getStickers;
module.exports.getSticker = getSticker;
module.exports.make = makeSticker;
module.exports.generateStickers = generateStickers;
module.exports.toggleTrade = toggleTradeSticker;
module.exports.changeOwner = changeOwner;
