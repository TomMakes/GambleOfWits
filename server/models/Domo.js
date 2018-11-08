const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let DomoModel = {};

// mongoose.Types.ObjectID is a function that
// converts string ID to real mongo ID
const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const DomoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  rarity: {
    type: Number,
    min: 0,
    required: true,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
	
  tradable:{
	type: Boolean,
	required: true,
  },

  createdData: {
    type: Date,
    default: Date.now,
  },
});

DomoSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  rarity: doc.rarity,
  tradable: doc.tradable,
});

DomoSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return DomoModel.find(search).select('name rarity tradable').exec(callback);
};

DomoSchema.statics.findByID = (domoId, callback) => {
	const search = {
		_id: convertId(domoId),
	};
	
	return DomoModel.findOne(search).select('name rarity tradable').exec(callback);
};

DomoSchema.statics.toggleTradable = (domoId, tradeBool, callback) => {
	const search = {
		_id: convertId(domoId),
	};
	//Switch tradability
	
	let tradableVal;
	if(tradeBool == 0) tradableVal = true; else tradableVal = false;
	
	const setTradable = {
		tradable: tradableVal 
	}; 
	console.dir(setTradable);
	//Update for new tradability
	/*DomoModel.update(search, setTradable, {multi: false}, function(err, res) {
    	if (err) throw err;
    		console.log(res.result.nModified + " document(s) updated");
  	}); */
	//return DomoModel.findOne(search).select('tradable').exec(callback);
	return DomoModel.findOne(search).select('name rarity tradable').exec(callback);
};

DomoModel = mongoose.model('Domo', DomoSchema);

module.exports.DomoModel = DomoModel;
module.exports.DomoSchema = DomoSchema;
