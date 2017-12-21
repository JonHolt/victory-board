fillData = function() {
	var listElem = document.getElementById('games-list');
	var dbrefObj = firebase.database().ref().child('games');
	dbrefObj.on('value', snap => {
		var games = snap.val();
		var gameArray = [];
		Object.keys(games).forEach(key => {
			if (key === 'next-game-id') {
				return;
			}
			gameArray.push({
				owner: games[key].owner,
				status: games[key].status,
				time: games[key].time,
				title: games[key].title,
				players: games[key].players,
				id: key
			});
		});

		gameArray.sort((a, b) => {
			var aVal, bVal;
			aVal = (a.status === 'open') ? 3 : (a.status === 'playing') ? 2 : 1;
			bVal = (b.status === 'open') ? 3 : (b.status === 'playing') ? 2 : 1; 

			return bVal - aVal;
		});

		listElem.innerHTML = '<li class="card grey darken-2 row">'
			+ '<div class="white-text">'
			+ '<span class="col s6">Name</span>'
			+ '<span class="col s3 center-align">Time</span>'
			+ '<span class="col s3 center-align">Status</span>'
			+ '</div>'
			+ '</li>';
	 
		gameArray.forEach(game => {
			var htmlString = `<li class="card grey darken-2">
				<a class="white-text" href="/views/manage-game.html#${game.id}">
					<div class="row">
						<span class="col s6">${game.title}</span>
						<span class="col s3 center-align">${game.time}</span>
						<span class="col s3 center-align">${game.status}</span>
					</div>
					<div class="row">`;

			Object.keys(game.players).forEach(key => {
				htmlString += `<img class="col s2 circle" src="${game.players[key].photo}">`;
			});
			
			htmlString += '</div></a></li>';
			
			listElem.innerHTML += htmlString;
		});
	});
};

window.addEventListener('JdoneLoading', fillData);