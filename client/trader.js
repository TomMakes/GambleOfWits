const loadTradeStickersFromServer = () => {
	sendAjax('GET', '/getTradeStickers', null, (data) => {
		ReactDOM.render(
			<TradeStickers stickers={data.stickers} />, document.querySelector("#trades")
		);
		console.log(data);
	});
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
	return(
		<div key={sticker._id} className="sticker">
			<img src={sticker.url} alt="domo Face" className="stickerFace" />
			<h3 className="stickerName"> Name: {sticker.name} </h3>
			<h3 className="stickerRarity"> Rarity: {sticker.rarity} </h3>
			<h3 className="stickerPrice"> Price: {sticker.balance} </h3>
			<button className="selectSticker" onClick={() => handlePurchaseSticker(sticker._id)}> Buy Me </button>
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
