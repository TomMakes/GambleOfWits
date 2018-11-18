'use strict';

var loadTradeStickersFromServer = function loadTradeStickersFromServer() {
	sendAjax('GET', '/getTradeStickers', null, function (data) {
		ReactDOM.render(React.createElement(TradeStickers, { stickers: data.stickers }), document.querySelector("#trades"));
		console.log(data);
	});
};

function handlePurchaseSticker(stickId) {

	sendAjax('GET', '/changeOwner', stickId, function (result) {
		console.dir(result);
		loadTradeStickersFromServer();
	});
}

var TradeStickers = function TradeStickers(props) {
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
			React.createElement('img', { src: sticker.url, alt: 'domo Face', className: 'stickerFace' }),
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
				{ className: 'stickerPrice' },
				' Price: ',
				sticker.balance,
				' '
			),
			React.createElement(
				'button',
				{ className: 'selectSticker', onClick: function onClick() {
						return handlePurchaseSticker(sticker._id);
					} },
				' Buy Me '
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