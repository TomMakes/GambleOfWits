const loadTradeStickersFromServer = () => {
	sendAjax('GET', '/getTradeStickers', null, (data) => {
		ReactDOM.render(
			<tradeStickers stickers={data.stickers} />, document.querySelector("#trades")
		);
		console.log(data);
	});
};

const TradeStickers = function(props) {
	console.log("I swear I'm running");
	if(props.stickers.length == 0) {
		return (
			<div className="stickerList">
				<h3 className="emptySticker">No Trades Posted</h3>
			</div>
		);
	};
	  
  const stickerNodes = props.stickers.map(function(sticker) {
	return(
		<div key={sticker._id} className="sticker">
			<img src="/assets/img/domoface.jpeg" alt="domo Face" className="stickerFace" />
			<h3 className="stickerName"> Name: {sticker.name} </h3>
			<h3 className="stickerRarity"> Rarity: {sticker.rarity} </h3>
			<h3 className="stickerTradable"> Tradable: {stickerTradeStatus} </h3>
			<button className="selectSticker" onClick={() => handleSelectSticker(sticker._id)}> Select Me </button>
			<button className="tradeSticker" onClick={() => handleSelectTradeSticker(sticker._id, sticker.tradable)}> Trade Me </button>
		</div>
	);
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
	
	console.log("wee I'm setup and I'm RUNNING!!");
	loadTradeStickersFromServer();
};

const getToken = () => {
	sendAjax('GET', '/getToken', null, (result) => {
		setup(result.csrfToken);
	});
};

$(document).ready(function() {
	getToken();
});
