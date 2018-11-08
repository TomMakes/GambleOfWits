const handleAddDomo = (e) => {
	e.preventDefault();
	
	$("#domoMessage").animate({width:'hide'}, 350);
	
	if($("#domoName").val() == '' || $("#domoRarity").val() == '') {
		handleError("RAWR! All fields are required");
		return false;
	}
	
	sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function() {
		loadDomosFromServer();
	});
	
	return false;
};

function handleSelectDomo(id) {
	event.preventDefault();

	console.log("Selected Domo");
	loadDomoFromServer(id);
	
	return false;
};

function handleSelectTradeDomo(id, tradeStatus) {
	event.preventDefault();

	console.log("Trade Toggle Domo");
	
	if(tradeStatus)
		tradeStatus = "1";
	else tradeStatus = "0";
	
	toggleDomoTrade(id, tradeStatus);
	
	return false;
}

const DomoForm = (props) => {
	return (
	<form id="domoForm"
		onSubmit={handleAddDomo}
		name="domoForm"
		action="/maker"
		method="POST"
		className="domoForm"
		>
		
		<label htmlFor="name">Name: </label>
		<input id="domoName" type="text" name="name" placeholder="Domo Name"/>
		<label htmlFor="rarity">Rarity: </label>
		<input id="domoRarity" type="text" name="rarity" placeholder="Domo Rarity"/>
		<input type="hidden" name="_csrf" value={props.csrf} />
		<input className="makeDomoSubmit" type="submit" value="Make Domo" />
	</form>
	);
}


const DomoList = function(props) {
	if(props.domos.length == 0) {
		return (
			<div className="domoList">
				<h3 className="emptyDomo">No Domos yet</h3>
			</div>
		);
	};
	  
  const domoNodes = props.domos.map(function(domo) {
	  let domoTradeStatus = "False";
	  if(domo.tradable) 
		  domoTradeStatus = "True";
	return(
		<div key={domo._id} className="domo">
			<img src="/assets/img/domoface.jpeg" alt="domo Face" className="domoFace" />
			<h3 className="domoName"> Name: {domo.name} </h3>
			<h3 className="domoRarity"> Rarity: {domo.rarity} </h3>
			<h3 className="domoTradable"> Tradable: {domoTradeStatus} </h3>
			<button className="selectDomo" onClick={() => handleSelectDomo(domo._id)}> Select Me </button>
			<button className="tradeDomo" onClick={() => handleSelectTradeDomo(domo._id, domo.tradable)}> Trade Me </button>
		</div>
	);
  });
return (
	<div className="domoList">
		{domoNodes}
	</div>
	);
};

const loadDomosFromServer = () => {
	sendAjax('GET', '/getDomos', null, (data) => {
		ReactDOM.render(
			<DomoList domos={data.domos} />, document.querySelector("#domos")
		);
		console.log(data);
	});
};

const loadDomoFromServer = (domoId) => {
	sendAjax('GET', '/getDomo', domoId, (data) => {
		console.dir(data);
	});
};

const toggleDomoTrade = (domoId, tradeStatus) => {
	let dataPack = domoId + "&" + tradeStatus;

	sendAjax('GET', '/toggleTrade', dataPack, (data) => {
		console.dir(data);
	});
};

const setup = function(csrf) {
	ReactDOM.render(
		<DomoForm csrf={csrf} />, document.querySelector("#makeDomo")
	);
	
	ReactDOM.render(
		<DomoList domos={[]} />, document.querySelector("#domos") 
	);
	
	loadDomosFromServer();
};

const getToken = () => {
	sendAjax('GET', '/getToken', null, (result) => {
		setup(result.csrfToken);
	});
};

$(document).ready(function() {
	getToken();
});
