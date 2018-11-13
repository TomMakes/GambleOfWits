const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let StickerModel = {};

// mongoose.Types.ObjectID is a function that
// converts string ID to real mongo ID
const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const StickerSchema = new mongoose.Schema({
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

StickerSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  rarity: doc.rarity,
  tradable: doc.tradable,
});

StickerSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return StickerModel.find(search).select('name rarity tradable').exec(callback);
};

StickerSchema.statics.findByID = (stickId, callback) => {
	const search = {
		_id: convertId(stickId),
	};
	
	return StickerModel.findOne(search).select('name rarity tradable owner').exec(callback);
};

StickerSchema.statics.toggleTradable = (stickId, tradeBool, callback) => {
	//Switch tradability
	let tradableVal;
	if(tradeBool === 0) tradableVal = true; else tradableVal = false;
	
	const search = {
		_id: convertId(stickId),
		tradable: tradableVal
	};
	const setTradable = {
		$set: {tradable: tradableVal} 
	}; 
	let modelToggled = StickerModel.findOne(search).select('name rarity tradable owner').exec(function(err, docs) {
		if(err) {
			console.log(err);
			return res.status(400).json({ error: 'An error occured' });
		}
		
		return res.json({ stickers: docs });
	});
	//Update for new tradability
	console.dir(modelToggled);
	modelToggled.tradable = tradableVal;
	return modelToggled.save(search, callback); 
	//return DomoModel.findOne(search).select('tradable').exec(callback);
	//return StickerModel.findOne(search).select('name rarity tradable').exec(callback);
};

StickerModel = mongoose.model('Sticker', StickerSchema);

module.exports.StickerModel = StickerModel;
module.exports.StickerSchema = StickerSchema;
