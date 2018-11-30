"use strict";

var handleAddSticker = function handleAddSticker(e) {
	e.preventDefault();

	$("#stickerMessage").animate({ width: 'hide' }, 350);

	if ($("#stickerName").val() == '' || $("#stickerRarity").val() == '') {
		handleError("All fields are required");
		return false;
	}

	/*sendAjax('POST', $("#stickerForm").attr("action"), $("#stickerForm").serialize(), function() {
 	loadStickersFromServer();
 }); */

	return false;
};

function grabNewStickers() {
	sendAjax('GET', '/generateStickers', null, function (data) {
		ReactDOM.render(React.createElement(StickerList, { stickers: data.stickers }), document.querySelector("#stickers"));
		loadStickersFromServer();
		console.log(data);
	});
}

function handleSelectSticker(id) {
	event.preventDefault();

	console.log("Selected Sticker");
	loadStickerFromServer(id);

	return false;
};

function handleSelectTradeSticker(id, tradeStatus) {
	event.preventDefault();

	console.log("Trade Toggle Sticker");

	if (tradeStatus) tradeStatus = "1";else tradeStatus = "0";

	toggleStickerTrade(id, tradeStatus);

	return false;
}

// Menu for the putting in price to trade sticker for.
function RenderStickerTradeMenu(stickerData) {
	ReactDOM.render(React.createElement(StickerTradeMenu, { sticker: stickerData }), document.querySelector("#stickerTradeMenu"));
}

var StickerTradeMenu = function StickerTradeMenu(props) {
	return React.createElement(
		"div",
		null,
		React.createElement(
			"h3",
			null,
			" How much do you want to trade ",
			props.sticker.name,
			" for?",
			React.createElement(
				"span",
				null,
				" ",
				React.createElement("br", null),
				" "
			),
			"Balance: ",
			props.account.account.balance
		),
		React.createElement(
			"button",
			{ className: "generateStickers", onClick: function onClick() {
					return grabNewStickers();
				} },
			" Open Sticker Pack! "
		),
		React.createElement(
			"form",
			{ id: "stickerTradeMenu",
				onSubmit: handleSelectTradeSticker,
				name: "stickerTradeMenu",
				action: "/maker",
				method: "GET"
			},
			React.createElement(
				"label",
				{ htmlFor: "price" },
				"Price: "
			),
			React.createElement("input", { id: "stickerName", type: "text", name: "name", placeholder: "Sticker Name" }),
			React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
			React.createElement("input", { className: "makeStickerSubmit", type: "submit", value: "Make Sticker" })
		)
	);
};

/*const StickerForm = (props) => {
	return (
	<form id="stickerForm"
		onSubmit={handleAddSticker}
		name="stickerForm"
		action="/maker"
		method="POST"
		className="stickerForm"
		>
		
		<label htmlFor="name">Name: </label>
		<input id="stickerName" type="text" name="name" placeholder="Sticker Name"/>
		<label htmlFor="rarity">Rarity: </label>
		<input id="stickerRarity" type="text" name="rarity" placeholder="Sticker Rarity"/>
		<input type="hidden" name="_csrf" value={props.csrf} />
		<input className="makeStickerSubmit" type="submit" value="Make Sticker" />
	</form>
	);
} */

var AccountInfo = function AccountInfo(props) {
	console.log("Sending props info");
	console.dir(props.account);
	console.dir(props.account.account);
	return React.createElement(
		"div",
		null,
		React.createElement(
			"h3",
			null,
			" Username: ",
			props.account.account.username,
			" ",
			React.createElement(
				"span",
				null,
				" ",
				React.createElement("br", null),
				" "
			),
			"Balance: ",
			props.account.account.balance
		),
		React.createElement(
			"button",
			{ className: "generateStickers", onClick: function onClick() {
					return grabNewStickers();
				} },
			" Open Sticker Pack! "
		)
	);
};

var StickerList = function StickerList(props) {
	if (props.stickers.length == 0) {
		return React.createElement(
			"div",
			{ className: "stickerList" },
			React.createElement(
				"h3",
				{ className: "emptySticker" },
				"No Stickers yet"
			)
		);
	};

	var stickerNodes = props.stickers.map(function (sticker) {
		var stickerTradeStatus = "False";
		if (sticker.tradable) stickerTradeStatus = "True";
		return React.createElement(
			"div",
			{ key: sticker._id, className: "sticker" },
			React.createElement("img", { src: sticker.url, alt: "domo Face", className: "stickerFace" }),
			React.createElement(
				"h3",
				{ className: "stickerName" },
				" Name: ",
				sticker.name,
				" "
			),
			React.createElement(
				"h3",
				{ className: "stickerRarity" },
				" Rarity: ",
				sticker.rarity,
				" "
			),
			React.createElement(
				"h3",
				{ className: "stickerTradable" },
				" Tradable: ",
				stickerTradeStatus,
				" "
			),
			React.createElement(
				"button",
				{ className: "selectSticker", onClick: function onClick() {
						return getUserBalance();
					} },
				" Select Me "
			),
			React.createElement(
				"button",
				{ className: "tradeSticker", onClick: function onClick() {
						return RenderStickerTradeMenu(sticker);
					} },
				" Trade Me "
			)
		);
	}); // old solution for tradeSticker button. handleSelectSticker(sticker._id)
	return React.createElement(
		"div",
		{ className: "stickerList" },
		stickerNodes
	);
};

var loadStickersFromServer = function loadStickersFromServer() {
	sendAjax('GET', '/getStickers', null, function (data) {
		ReactDOM.render(React.createElement(StickerList, { stickers: data.stickers }), document.querySelector("#stickers"));
		console.log(data);
	});
};

var loadStickerFromServer = function loadStickerFromServer(stickerId) {
	sendAjax('GET', '/getSticker', stickerId, function (data) {
		console.dir(data);
	});
};

var toggleStickerTrade = function toggleStickerTrade(stickerId, tradeStatus) {
	var dataPack = stickerId + "&" + tradeStatus;

	sendAjax('GET', '/toggleTrade', dataPack, function (data) {
		loadStickersFromServer();
	});
};

var getUserBalance = function getUserBalance() {
	sendAjax('GET', '/getUserInfo', null, function (data) {
		ReactDOM.render(React.createElement(AccountInfo, { account: data }), document.querySelector(".accountInfo"));
		console.log(data);
	});
};

var setup = function setup(csrf) {

	/*ReactDOM.render(
 	<StickerForm csrf={csrf} />, document.querySelector("#makeSticker")
 );*/

	ReactDOM.render(React.createElement(StickerList, { stickers: [] }), document.querySelector("#stickers"));

	getUserBalance();
	loadStickersFromServer();
};

var getToken = function getToken() {
	sendAjax('GET', '/getToken', null, function (result) {
		setup(result.csrfToken);
	});
};

$(document).ready(function () {
	getToken();
});