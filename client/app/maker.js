const handleAddDomo = (e) => {
	e.preventDefault();
	
	$("#domoMessage").animate({width:'hide'}, 350);
	
	if($("#domoName").val() == '' || $("#domoAge").val() == '' || $("#domoBalance").val() == '') {
		handleError("RAWR! All fields are required");
		return false;
	}
	
	sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function() {
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
		<label htmlFor="age">Age: </label>
		<input id="domoAge" type="text" name="age" placeholder="Domo Age"/>
		<label htmlFor="balance">Balance: </label>
		<input id="domoBalance" type="text" name="balance" placeholder="Domo Balance"/>
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
	return(
		<div key={domo._id} className="domo">
			<img src="/assets/img/domoface.jpeg" alt="domo Face" className="domoFace" />
			<h3 className="domoName"> Name: {domo.name} </h3>
			<h3 className="domoAge"> Age: {domo.age} </h3>
			<h3 className="domoBalance"> Balance: {domo.balance} </h3>
			<button className="selectDomo" onClick={() => handleSelectDomo(domo._id)}> Select Me </button>
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
