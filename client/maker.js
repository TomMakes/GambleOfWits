const handleAddSticker = (e) => {
	e.preventDefault();
	
	$("#stickerMessage").animate({width:'hide'}, 350);
	
	if($("#stickerName").val() == '' || $("#stickerRarity").val() == '') {
		handleError("All fields are required");
		return false;
	}
	
	sendAjax('POST', $("#stickerForm").attr("action"), $("#stickerForm").serialize(), function() {
		loadStickersFromServer();
	});
	
	return false;
};

function grabNewStickers() {
	sendAjax('GET', '/generateStickers', null, (data) => {
		ReactDOM.render(
			<StickerList stickers={data.stickers} />, document.querySelector("#stickers")
		);
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
	
	if(tradeStatus)
		tradeStatus = "1";
	else tradeStatus = "0";
	
	toggleStickerTrade(id, tradeStatus);
	
	return false;
}

const StickerForm = (props) => {
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
}

const AccountInfo = (props) => {
	console.log("Sending props info");
	console.dir(props.account);
	console.dir(props.account.account);
	return (
	<div>
		<h3> Username: {props.account.account.username} <span> <br /> </span>
			 Balance: {props.account.account.balance}</h3>
			<button className="generateStickers" onClick={() => grabNewStickers()}> Open Sticker Pack! </button>
	</div>
	);
}


const StickerList = function(props) {
	if(props.stickers.length == 0) {
		return (
			<div className="stickerList">
				<h3 className="emptySticker">No Stickers yet</h3>
			</div>
		);
	};
	  
  const stickerNodes = props.stickers.map(function(sticker) {
	  let stickerTradeStatus = "False";
	  if(sticker.tradable) 
		  stickerTradeStatus = "True";
	return(
		<div key={sticker._id} className="sticker">
			<img src= {sticker.url} alt="domo Face" className="stickerFace" />
			<h3 className="stickerName"> Name: {sticker.name} </h3>
			<h3 className="stickerRarity"> Rarity: {sticker.rarity} </h3>
			<h3 className="stickerTradable"> Tradable: {stickerTradeStatus} </h3>
			<button className="selectSticker" onClick={() => getUserBalance()}> Select Me </button>
			<button className="tradeSticker" onClick={() => handleSelectTradeSticker(sticker._id, sticker.tradable)}> Trade Me </button>
		</div>
	); 
  }); //handleSelectSticker(sticker._id)
return (
	<div className="stickerList">
		{stickerNodes}
	</div>
	); 
};

const loadStickersFromServer = () => {
	sendAjax('GET', '/getStickers', null, (data) => {
		ReactDOM.render(
			<StickerList stickers={data.stickers} />, document.querySelector("#stickers")
		);
		console.log(data);
	});
};

const loadStickerFromServer = (stickerId) => {
	sendAjax('GET', '/getSticker', stickerId, (data) => {
		console.dir(data);
	});
};

const toggleStickerTrade = (stickerId, tradeStatus) => {
	let dataPack = stickerId + "&" + tradeStatus;

	sendAjax('GET', '/toggleTrade', dataPack, (data) => {
		loadStickersFromServer();
	});
};

var getUserBalance = function getUserBalance() {
	sendAjax('GET', '/getUserInfo', null, function (data) {
		ReactDOM.render(
			<AccountInfo account={data} />, document.querySelector(".accountInfo")
		);
		console.log(data);
	});
};

const setup = function(csrf) {
	
	ReactDOM.render(
		<StickerForm csrf={csrf} />, document.querySelector("#makeSticker")
	);
	
	ReactDOM.render(
		<StickerList stickers={[]} />, document.querySelector("#stickers") 
	);
	
	getUserBalance();
	loadStickersFromServer();
};

const getToken = () => {
	sendAjax('GET', '/getToken', null, (result) => {
		setup(result.csrfToken);
	});
};

$(document).ready(function() {
	getToken();
});
