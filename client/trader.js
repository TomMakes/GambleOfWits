// A variable that simply holds the users Id to use for organising stickers
let userID;

var getUserBalance = function getUserBalance() {
	sendAjax('GET', '/getUserInfo', null, function (data) {
		ReactDOM.render(
			<AccountInfo account={data} />, document.querySelector(".accountInfo")
		);
        userID = data.account._id;
        console.log(userID);
        loadTradeStickersFromServer();
		console.log(data);
	});
};

const loadTradeStickersFromServer = () => {
	sendAjax('GET', '/getTradeStickers', null, (data) => {
		ReactDOM.render(
			<TradeStickers stickers={data.stickers} />, document.querySelector("#trades")
		);
		console.log(data);
	});
};

const AccountInfo = (props) => {
	console.log("Sending props info");
	console.dir(props.account.account);
    //userID = props.account.account._id;
	return (
	<div>
		<h3> Username: {props.account.account.username} <span> <br /> </span>
			 Credits: {props.account.account.balance}</h3>
	</div>
	);
};

function handlePurchaseSticker(stickId){
	
	sendAjax('GET', '/changeOwner', stickId, (result) => {
		console.dir(result);
		loadTradeStickersFromServer();
	});
	
}

const TradeStickers = function(props) {
	if(props.stickers.length == 0) {
		return (
			<div className="stickerList">
				<h3 className="emptySticker">No Trades Posted</h3>
			</div>
		);
	};
	  
  const stickerNodes = props.stickers.map(function(sticker) {
    if (sticker.owner === userID) {
      console.log("userID then the sticker in question");
      console.dir(userID);
      console.dir(sticker.owner);
	 return(
	 	<div key={sticker._id} className="sticker">
	 		<img src={sticker.url} alt="domo Face" className="stickerFace" />
	 		<h3 className="stickerName"> Name: {sticker.name} </h3>
	 		<h3 className="stickerRarity"> Rarity: {sticker.rarity} </h3>
	 		<h3 className="stickerPrice"> Price: This Sticker is Yours </h3>
	 	</div>
	 );
    }
    else {
      console.log("userID then the sticker in question");
      console.dir(userID);
      console.dir(sticker.owner);
      return(
	 	<div key={sticker._id} className="sticker">
	 		<img src={sticker.url} alt="domo Face" className="stickerFace" />
	 		<h3 className="stickerName"> Name: {sticker.name} </h3>
	 		<h3 className="stickerRarity"> Rarity: {sticker.rarity} </h3>
	 		<h3 className="stickerPrice"> Price: {sticker.balance} </h3>
	 		<button className="selectSticker" onClick={() => handlePurchaseSticker(sticker._id)}> Buy Me </button>
	 	</div>
	 );                                
    }
  });
return (
	<div className="stickerList">
		{stickerNodes}
	</div>
	);
};


const setup = function(csrf) {
	
	ReactDOM.render(
		<TradeStickers stickers={[]} />, document.querySelector("#trades") 
	);
  
    // Load the username and balance user is currently at
	getUserBalance();
};

const getToken = () => {
	sendAjax('GET', '/getToken', null, (result) => {
		setup(result.csrfToken);
	});
};

$(document).ready(function() {
	getToken();
});
