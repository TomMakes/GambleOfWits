const models = require('../models');

const Account = models.Account;

const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

const invalidPage = (req, res) => {
  res.render('invalid', { csrfToken: req.csrfToken() });
};


const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (request, response) => {
  const req = request;
  const res = response;

    // convert to strings for secuirty
  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/maker' });
  });
};

const signup = (request, response) => {
  const req = request;
  const res = response;

    // convert to strings for security reasons
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      return res.json({ redirect: '/maker' });
    });
    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already in use.' });
      }
      return res.status(400).json({ error: 'An error occurred' });
    });
  });
};

const getUserInfo = (request, response) => {
  const req = request;
  const res = response;

  return Account.AccountModel.findById(req.session.account._id, (err, doc) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    let idInfo = doc;
    idInfo.createdDate = undefined;
    idInfo.password = undefined;
    idInfo.salt = undefined;
    return res.json({ account: idInfo });
  });
};


// Changes the balances of two accounts due to a trade
// TraderId is the person trying to trade away sticker
// newOwnerId is the person buying the sticker
const tradeBalance = (traderId, newOwnerId, change) => {
  // Set up variables to store the account data then be changed
  let traderInfo;
  let ownerInfo;
  Account.AccountModel.findById(newOwnerId, (err, doc) => {
    if (err) {
      console.log(err);
      return ('error: An error occured ');
    }
    ownerInfo = doc;
    
    Account.AccountModel.findById(traderId, (err2, doc2) => {
      if (err2) {
        console.log(err2);
        return ('error: An error occured ');
      }
      traderInfo = doc2;
      
      // Change the balances to complete transaction
      // Change only if the person taking the sticker isn't the original owner
      if (traderInfo._id !== ownerInfo._id) {
        traderInfo.balance += change;
        ownerInfo.balance -= change;
      }
      
      
      // save both accounts with their new balances
      // First make models with the info changes
      const traderAccount = new Account.AccountModel(traderInfo);
      const ownerAccount = new Account.AccountModel(ownerInfo);
      
      // Make the promises to save
      const traderPromise = traderAccount.save();
      
      traderPromise.catch((err3) => {
          console.log(err3);
          if (err3.code === 11000) {
            return ('error: Account already exists occured ');
          }
    
          return ('error: Error occured ');
      });
      
      const ownerPromise = ownerAccount.save();
      
      ownerPromise.catch((err4) => {
        console.log(err4);
        if (err4.code === 11000) {
          return ('error: Account already exists occured ');
        }
    
        return ('error: Error occured ');
      });
      
      return(true);
    });
    return(true);
  });
  return(true);
};

// Adds x funds to a single account
const addBalance = (userId, funds) => {
  Account.AccountModel.findById(userId, (err, doc) => {
      if (err) {
        console.log(err);
        return ('error: An error occured ');
      }
      let userInfo = doc;

      // Change the balances to complete transaction
      userInfo.balance += funds;
    
      // First make models with the info changes
      const userAccount = new Account.AccountModel(userInfo);
    
      const userPromise = userAccount.save();
      
      userPromise.catch((err4) => {
        console.log(err4);
        if (err4.code === 11000) {
          return ('error: Account already exists occured ');
        }

        return ('error: Error occured ');
      });
    return ('Transaction Complete!');
  });
};

// Makes it so the user gets a bonus of credits for logging in a day after last daily given.
const checkForDailyBonus = (request, response) => {
  const req = request;
  const res = response;
  const userId = req.session.account._id;
  Account.AccountModel.findById(userId, (err, doc) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    let userInfo = doc;
    
    // Get the current date
    const currentTime = new Date();
    
    // check the date of last daily with the date of current time
    console.dir(userInfo.lastLoginBonus);
    console.dir((userInfo.lastLoginBonus).getDate());
    console.dir(currentTime.getDate());
    
    // compare if the months are different from each other
    if (currentTime.getDate() === (userInfo.lastLoginBonus).getDate()) {
      console.log("Months match");
      // compare of the days are different from each other
      if (currentTime.getDay() === (userInfo.lastLoginBonus).getDay()) {
        // return 0 for no daily given if they are the same
        console.log("Days Match");
        // compare years
        if (currentTime.getFullYear() === (userInfo.lastLoginBonus).getFullYear()) {
         res.json({ status: false }); 
        }
        else{
          // Set the last given login bonus to today
          userInfo.lastLoginBonus = currentTime;
  
          //  Give the user their login bonus
          addBalance(userId, 100);
  
          //Return 1 for successful daily bonus given
          res.json({ status: true });
        }
      }
      else {
        // Set the last given login bonus to today
        userInfo.lastLoginBonus = currentTime;

        //  Give the user their login bonus
        addBalance(userId, 100);

        //Return 1 for successful daily bonus given
        res.json({ status: true });
      }
    }
    else {
      // Set the last given login bonus to today
      userInfo.lastLoginBonus = currentTime;

      //  Give the user their login bonus
      addBalance(userId, 100);

      // Return 1 for successful daily bonus given
      res.json({ status: true });
    }
  });
};


const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };
  res.json(csrfJSON);
};

module.exports.loginPage = loginPage;
module.exports.invalidPage = invalidPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.checkForDailyBonus = checkForDailyBonus;
module.exports.getUserInfo = getUserInfo;
module.exports.tradeBalance = tradeBalance;
module.exports.addBalance = addBalance;
module.exports.getToken = getToken;
