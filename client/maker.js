const handleAddSticker = (e) => {
	e.preventDefault();
	
	$("#stickerMessage").animate({width:'hide'}, 350);
	
	if($("#stickerName").val() == '' || $("#stickerRarity").val() == '') {
		handleError("All fields are required");
		return false;
	}
	
	/*sendAjax('POST', $("#stickerForm").attr("action"), $("#stickerForm").serialize(), function() {
		loadStickersFromServer();
	}); */
	
	return false;
};

const handleSelectTradeSticker = (e) => {
	e.preventDefault();
	
	$("#stickerMessage").animate({width:'hide'}, 350);
	
	if(isNaN($("#stickerPrice").val())) {
		handleError("The value input is not a number");
		return false;
	}
	
	// Hide the trade menu since it's done
    const tradeMenu = document.getElementById("stickerTradeMenuDiv");
    tradeMenu.classList.add("hidden");
  
    // Run a function that takes the sticker ID and price of sticker, 
    // and updates the Sticker by setting tradable true and price.
  
    // make sure I am sending the appropriate values to the function
    console.log("StickerID " + $("#tradedStickerID").val() + "  And sticker price of " +  $("#stickerPrice").val());
  
	
    // trade the sticker passing in id, what to change trade status to, and the price
	toggleStickerTrade($("#tradedStickerID").val(), '1', $("#stickerPrice").val());
    
	return false;
};

function grabNewStickers() {
    let dataPack = 'firstPack';
	sendAjax('GET', '/generateStickers', dataPack, (data) => {
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

// Stub function which is going to be for removing a sticker from the tradable area.
// This function makes tradable false, and sets price of sticker to 0.
function removeFromTradingFloor(sticker){
  // stickerID, trade status (0 is false), price
  toggleStickerTrade(sticker._id, '0', '0');
}

function handleSelectTradeStickerOLD(id, tradeStatus) {
	event.preventDefault();

	console.log("Trade Toggle Sticker");
	
	if(tradeStatus)
		tradeStatus = "1";
	else tradeStatus = "0";
	
	toggleStickerTrade(id, tradeStatus);
	
	return false;
}

// Menu for the putting in price to trade sticker for.
function RenderStickerTradeMenu(stickerData) {
  //Unhide the trade menu if it has been brought up before.
  const tradeMenu = document.getElementById("stickerTradeMenuDiv");
  tradeMenu.classList.remove("hidden");
  ReactDOM.render(
    <StickerTradeMenu sticker = {stickerData} />, document.querySelector("#stickerTradeMenuDiv")
  );
}

const StickerTradeMenu = (props) => {
  return (
    <form id="stickerTradeMenu"
	    	onSubmit={handleSelectTradeSticker}
	    	name="stickerTradeMenu"
	    	action="/maker"
	    	method="GET"
	    	>
	    	How much do you want to trade {props.sticker.name} for? <span> <br /> <br /> </span>
	    	<label htmlFor="price">Price: </label>
	    	<input id="stickerPrice" type="text" name="price" placeholder="Sticker Price"/>
            <input id="tradedStickerID" type="hidden" name="stickerID" value={props.sticker._id} />
	    	<input className="tradeStickerSubmit" type="submit" value="Trade Sticker" />
    </form>
  );
}

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

const AccountInfo = (props) => {
	console.log("Sending props info");
	console.dir(props.account);
	console.dir(props.account.account);
	return (
	<div>
		<h3> Username: {props.account.account.username} <span> <br /> </span>
			 Credits: {props.account.account.balance}</h3>
			<button className="generateStickers" onClick={() => grabNewStickers()}> Open Free Sticker Pack! </button>
	</div>
	);
};


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
	  if(sticker.tradable) {
        stickerTradeStatus = "True";
        return(
		<div key={sticker._id} className="sticker">
			<img src= {sticker.url} alt="domo Face" className="stickerFace" />
			<h3 className="stickerName"> Name: {sticker.name} </h3>
			<h3 className="stickerRarity"> Rarity: {sticker.rarity} </h3>
			<h3 className="stickerTradable"> Tradable: {stickerTradeStatus} </h3>
			<button className="selectSticker" onClick={() => getUserBalance()}> Select Me </button>
			<button className="tradeSticker" onClick={() => removeFromTradingFloor(sticker)}> Take off Trading Floor </button>
            
		</div>
	    ); 
      }
		
	return(
		<div key={sticker._id} className="sticker">
			<img src= {sticker.url} alt="domo Face" className="stickerFace" />
			<h3 className="stickerName"> Name: {sticker.name} </h3>
			<h3 className="stickerRarity"> Rarity: {sticker.rarity} </h3>
			<h3 className="stickerTradable"> Tradable: {stickerTradeStatus} </h3>
			<button className="selectSticker" onClick={() => getUserBalance()}> Select Me </button>
			<button className="tradeSticker" onClick={() => RenderStickerTradeMenu(sticker)}> Trade Me </button>
            
		</div>
	); 
  }); // old solution for tradeSticker button. handleSelectSticker(sticker._id)
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

const checkForDaily = () => {
	sendAjax('GET', '/checkForDailyBonus', null, (data) => {
        console.log("Checked for Daily");
		console.dir(data);
        if (data.status === true) {
          // Alert the user they have gotten a daily bonus
          const dailyMessage = document.getElementById("dailyMessage");
          dailyMessage.classList.remove("hidden");
        }
	});
};

const loadStickerFromServer = (stickerId) => {
	sendAjax('GET', '/getSticker', stickerId, (data) => {
		console.dir(data);
	});
};

const toggleStickerTrade = (stickerId, tradeStatus, price) => {
	let dataPack = stickerId + "&" + tradeStatus + "&" + price;

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
  
    // Check if user has gotten a daily bonus for logging in
    checkForDaily();
	
	/*ReactDOM.render(
		<StickerForm csrf={csrf} />, document.querySelector("#makeSticker")
	);*/
	
	ReactDOM.render(
		<StickerList stickers={[]} />, document.querySelector("#stickers") 
	);
	// Load the username and balance user is currently at
	getUserBalance();
  
    // Load the current stickers that the user has
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
