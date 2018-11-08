"use strict";

var handleAddSticker = function handleAddSticker(e) {
	e.preventDefault();

	$("#stickerMessage").animate({ width: 'hide' }, 350);

	if ($("#stickerName").val() == '' || $("#stickerRarity").val() == '') {
		handleError("RAWR! All fields are required");
		return false;
	}

	sendAjax('POST', $("#stickerForm").attr("action"), $("#stickerForm").serialize(), function () {
		loadStickersFromServer();
	});

	return false;
};

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

var StickerForm = function StickerForm(props) {
	return React.createElement(
		"form",
		{ id: "stickerForm",
			onSubmit: handleAddSticker,
			name: "stickerForm",
			action: "/maker",
			method: "POST",
			className: "stickerForm"
		},
		React.createElement(
			"label",
			{ htmlFor: "name" },
			"Name: "
		),
		React.createElement("input", { id: "stickerName", type: "text", name: "name", placeholder: "Sticker Name" }),
		React.createElement(
			"label",
			{ htmlFor: "rarity" },
			"Rarity: "
		),
		React.createElement("input", { id: "stickerRarity", type: "text", name: "rarity", placeholder: "Sticker Rarity" }),
		React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
		React.createElement("input", { className: "makeStickerSubmit", type: "submit", value: "Make Sticker" })
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
			React.createElement("img", { src: "/assets/img/domoface.jpeg", alt: "domo Face", className: "stickerFace" }),
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
						return handleSelectSticker(sticker._id);
					} },
				" Select Me "
			),
			React.createElement(
				"button",
				{ className: "tradeSticker", onClick: function onClick() {
						return handleSelectTradeSticker(sticker._id, sticker.tradable);
					} },
				" Trade Me "
			)
		);
	});
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
		console.dir(data);
	});
};

var setup = function setup(csrf) {
	ReactDOM.render(React.createElement(StickerForm, { csrf: csrf }), document.querySelector("#makeSticker"));

	ReactDOM.render(React.createElement(StickerList, { stickers: [] }), document.querySelector("#stickers"));

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
"use strict";

var handleError = function handleError(message) {
    $("#errorMessage").text(message);
    $("#stickerMessage").animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
    $("#stickerMessage").animate({ width: 'hide' }, 350);
    window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function error(xhr, status, _error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};
