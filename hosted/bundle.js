"use strict";

var handleAddDomo = function handleAddDomo(e) {
	e.preventDefault();

	$("#domoMessage").animate({ width: 'hide' }, 350);

	if ($("#domoName").val() == '' || $("#domoRarity").val() == '') {
		handleError("RAWR! All fields are required");
		return false;
	}

	sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function () {
		loadDomosFromServer();
	});

	return false;
};

function handleSelectDomo(id) {
	//event.preventdefault();

	console.log("Selected Domo");
	console.dir(id);
	loadDomoFromServer(id);

	return false;
};

var DomoForm = function DomoForm(props) {
	return React.createElement(
		"form",
		{ id: "domoForm",
			onSubmit: handleAddDomo,
			name: "domoForm",
			action: "/maker",
			method: "POST",
			className: "domoForm"
		},
		React.createElement(
			"label",
			{ htmlFor: "name" },
			"Name: "
		),
		React.createElement("input", { id: "domoName", type: "text", name: "name", placeholder: "Domo Name" }),
		React.createElement(
			"label",
			{ htmlFor: "rarity" },
			"Rarity: "
		),
		React.createElement("input", { id: "domoRarity", type: "text", name: "rarity", placeholder: "Domo Rarity" }),
		React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
		React.createElement("input", { className: "makeDomoSubmit", type: "submit", value: "Make Domo" })
	);
};

var DomoList = function DomoList(props) {
	if (props.domos.length == 0) {
		return React.createElement(
			"div",
			{ className: "domoList" },
			React.createElement(
				"h3",
				{ className: "emptyDomo" },
				"No Domos yet"
			)
		);
	};

	var domoNodes = props.domos.map(function (domo) {
		var domoTradeStatus = "False";
		if (domo.tradable) domoTradeStatus = "True";
		return React.createElement(
			"div",
			{ key: domo._id, className: "domo" },
			React.createElement("img", { src: "/assets/img/domoface.jpeg", alt: "domo Face", className: "domoFace" }),
			React.createElement(
				"h3",
				{ className: "domoName" },
				" Name: ",
				domo.name,
				" "
			),
			React.createElement(
				"h3",
				{ className: "domoRarity" },
				" Rarity: ",
				domo.rarity,
				" "
			),
			React.createElement(
				"h3",
				{ className: "domoTradable" },
				" Tradable: ",
				domoTradeStatus,
				" "
			),
			React.createElement(
				"button",
				{ className: "selectDomo", onClick: function onClick() {
						return handleSelectDomo(domo._id);
					} },
				" Select Me "
			)
		);
	});
	return React.createElement(
		"div",
		{ className: "domoList" },
		domoNodes
	);
};

var loadDomosFromServer = function loadDomosFromServer() {
	sendAjax('GET', '/getDomos', null, function (data) {
		ReactDOM.render(React.createElement(DomoList, { domos: data.domos }), document.querySelector("#domos"));
		console.log(data);
	});
};

var loadDomoFromServer = function loadDomoFromServer(domoId) {
	sendAjax('GET', '/getDomo', domoId, function (data) {

		console.dir(data);
	});
};

var setup = function setup(csrf) {
	ReactDOM.render(React.createElement(DomoForm, { csrf: csrf }), document.querySelector("#makeDomo"));

	ReactDOM.render(React.createElement(DomoList, { domos: [] }), document.querySelector("#domos"));

	loadDomosFromServer();
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
    $("#domoMessage").animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
    $("#domoMessage").animate({ width: 'hide' }, 350);
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
