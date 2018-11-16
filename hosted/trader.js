'use strict';

var loadTradeStickersFromServer = function loadTradeStickersFromServer() {
	sendAjax('GET', '/getTradeStickers', null, function (data) {
		ReactDOM.render(React.createElement('tradeStickers', { stickers: data.stickers }), document.querySelector("#trades"));
		console.log(data);
	});
};

var TradeStickers = function TradeStickers(props) {
	console.log("I swear I'm running");
	if (props.stickers.length == 0) {
		return React.createElement(
			'div',
			{ className: 'stickerList' },
			React.createElement(
				'h3',
				{ className: 'emptySticker' },
				'No Trades Posted'
			)
		);
	};

	var stickerNodes = props.stickers.map(function (sticker) {
		return React.createElement(
			'div',
			{ key: sticker._id, className: 'sticker' },
			React.createElement('img', { src: '/assets/img/domoface.jpeg', alt: 'domo Face', className: 'stickerFace' }),
			React.createElement(
				'h3',
				{ className: 'stickerName' },
				' Name: ',
				sticker.name,
				' '
			),
			React.createElement(
				'h3',
				{ className: 'stickerRarity' },
				' Rarity: ',
				sticker.rarity,
				' '
			),
			React.createElement(
				'h3',
				{ className: 'stickerTradable' },
				' Tradable: ',
				stickerTradeStatus,
				' '
			),
			React.createElement(
				'button',
				{ className: 'selectSticker', onClick: function onClick() {
						return handleSelectSticker(sticker._id);
					} },
				' Select Me '
			),
			React.createElement(
				'button',
				{ className: 'tradeSticker', onClick: function onClick() {
						return handleSelectTradeSticker(sticker._id, sticker.tradable);
					} },
				' Trade Me '
			)
		);
	});
	return React.createElement(
		'div',
		{ className: 'stickerList' },
		stickerNodes
	);
};

var setup = function setup(csrf) {

	ReactDOM.render(React.createElement(TradeStickers, { stickers: [] }), document.querySelector("#trades"));

	console.log("wee I'm setup and I'm RUNNING!!");
	loadTradeStickersFromServer();
};

var getToken = function getToken() {
	sendAjax('GET', '/getToken', null, function (result) {
		setup(result.csrfToken);
	});
};

$(document).ready(function () {
	getToken();
});