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

  tradable: {
    type: Boolean,
    required: true,
  },

  balance: {
    type: Number,
    min: 0,
    default: 0,
  },

  createdData: {
    type: Date,
    default: Date.now,
  },

  url: {
    type: String,
    default: 'assets/img/domo.png',
  },
});

StickerSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  rarity: doc.rarity,
  tradable: doc.tradable,
  balance: doc.balance,
});

StickerSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return StickerModel.find(search).select('name rarity tradable balance url').exec(callback);
};

StickerSchema.statics.findByID = (stickId, callback) => {
	const search = {
		_id: convertId(stickId),
	};
	
	return StickerModel.findOne(search).
	select('name rarity tradable balance url owner').exec(callback);
};

StickerSchema.statics.findByTradable = (tradableVal, callback) => {
  const search = {
    tradable: tradableVal,
  };

  return StickerModel.find(search).select('name rarity tradable balance owner url').exec(callback);
};


StickerModel = mongoose.model('Sticker', StickerSchema);

module.exports.StickerModel = StickerModel;
module.exports.StickerSchema = StickerSchema;
