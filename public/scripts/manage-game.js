openGame = (game, id) => () => {
  console.log('open game: ', game.title, id);
};

playGame = (game, id) => () => {
  console.log('play game: ', game.title, id);
};

endGame = (game, id) => () => {
  console.log('end game: ', game.title, id);
};

joinGame = (game, id) => () => {
  console.log('join game: ', game.title, id);
};

fillData = function() {
  var titleElem = document.getElementById('title'),
      timeElem = document.getElementById('time'),
      statusElem = document.getElementById('status'),
      buttonAreaElem = document.getElementById('button-area'),
      playerListElem = document.getElementById('player-list');
  var hash = window.location.hash.substr(1);
  var gameID = Number(hash);
  if (!hash || Number.isNaN(gameID)) {
    window.location.href = '/views/games.html';
  }
  var dbrefObj = firebase.database().ref().child('games').child(gameID);
  dbrefObj.on('value', snap => {
    var game = snap.val();
    titleElem.textContent = game.title;
    timeElem.textContent = game.time;
    statusElem.textContent = game.status;

    //set up control areas
    if (userData && userData.uid === game.owner) {
      buttonAreaElem.innerHTML = `
        <a id="open" class="waves-effect waves-light btn col s4">Open</a>
        <a id="play" class="waves-effect waves-light btn col s4">Play</a>
        <a id="end" class="waves-effect waves-light btn col s4">End</a>`;
      document.getElementById('open').onclick = openGame(game, gameID);
      document.getElementById('play').onclick = playGame(game, gameID);
      document.getElementById('end').onclick = endGame(game, gameID);
    } else {
      buttonAreaElem.innerHTML = `
        <div class="input-field col s8">
          <input placeholder="Bet" id="bet" type="text" class="validate">
        </div>
        <div class="col s1"
        <a id="join" class="waves-effect waves-light btn col s3">Join</a>`;
        document.getElementById('join').onclick = joinGame(game, gameID);
    }

    // Set up player list
    
  });
};

window.addEventListener('JdoneLoading', fillData);
window.addEventListener('hashchange', fillData);