'use strict';

var loadTradeStickersFromServer = function loadTradeStickersFromServer() {
	sendAjax('GET', '/getTradeStickers', null, function (data) {
		ReactDOM.render(React.createElement('tradeStickers', { stickers: data.stickers }), document.querySelector("#trades"));
		console.log(data);
	});
};

var setup = function setup(csrf) {

	ReactDOM.render(React.createElement('tradeStickers', { stickers: [] }), document.querySelector("#trades"));

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