'use strict';

// A variable that simply holds the users Id to use for organising stickers
var userID = void 0;

var getUserBalance = function getUserBalance() {
	sendAjax('GET', '/getUserInfo', null, function (data) {
		ReactDOM.render(React.createElement(AccountInfo, { account: data }), document.querySelector(".accountInfo"));
		userID = data.account._id;
		console.log(userID);
		loadTradeStickersFromServer();
		console.log(data);
	});
};

var loadTradeStickersFromServer = function loadTradeStickersFromServer() {
	sendAjax('GET', '/getTradeStickers', null, function (data) {
		ReactDOM.render(React.createElement(TradeStickers, { stickers: data.stickers }), document.querySelector("#trades"));
		console.log(data);
	});
};

var AccountInfo = function AccountInfo(props) {
	console.log("Sending props info");
	console.dir(props.account.account);
	//userID = props.account.account._id;
	return React.createElement(
		'div',
		null,
		React.createElement(
			'h3',
			null,
			' Username: ',
			props.account.account.username,
			' ',
			React.createElement(
				'span',
				null,
				' ',
				React.createElement('br', null),
				' '
			),
			'Credits: ',
			props.account.account.balance
		)
	);
};

function handlePurchaseSticker(stickId) {

	sendAjax('GET', '/changeOwner', stickId, function (result) {
		console.dir(result);
		loadTradeStickersFromServer();
		getUserBalance();
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
		if (sticker.owner === userID) {
			console.log("userID then the sticker in question");
			console.dir(userID);
			console.dir(sticker.owner);
			return React.createElement(
				'div',
				{ key: sticker._id, className: 'sticker' },
				React.createElement('img', { src: sticker.url, alt: 'domo Face', className: 'stickerFace' }),
				React.createElement(
					'h3',
					{ className: 'stickerName' },
					' Name: ',
					React.createElement(
						'span',
						null,
						' ',
						React.createElement('br', null),
						' '
					),
					' ',
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
					' Owned by you '
				)
			);
		} else {
			console.log("userID then the sticker in question");
			console.dir(userID);
			console.dir(sticker.owner);
			return React.createElement(
				'div',
				{ key: sticker._id, className: 'sticker' },
				React.createElement('img', { src: sticker.url, alt: 'domo Face', className: 'stickerFace' }),
				React.createElement(
					'h3',
					{ className: 'stickerName' },
					' Name: ',
					React.createElement(
						'span',
						null,
						' ',
						React.createElement('br', null),
						' '
					),
					' ',
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
		}
	});
	return React.createElement(
		'div',
		{ className: 'stickerList' },
		stickerNodes
	);
};

var setup = function setup(csrf) {

	ReactDOM.render(React.createElement(TradeStickers, { stickers: [] }), document.querySelector("#trades"));

	// Load the username and balance user is currently at
	getUserBalance();
};

var getToken = function getToken() {
	sendAjax('GET', '/getToken', null, function (result) {
		setup(result.csrfToken);
	});
};

$(document).ready(function () {
	getToken();
});