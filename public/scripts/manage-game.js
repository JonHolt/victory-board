openGame = (game, id) => () => {
  if (game.status === 'playing') {
    firebase.database().ref().child('games').child(id).child('status').set('open');
  }
};

playGame = (game, id) => () => {
  if (game.status === 'open') {
    firebase.database().ref().child('games').child(id).child('status').set('playing');
  }
};

endGame = (game, id) => () => {
  var players = [];
  var splitPool = 0;
  var numWinners = 0;
  Object.keys(game.players).forEach(key => {
    var playerWon = document.getElementById(key).dataset.win === 'true'
    players.push({
      uid: key,
      bet: game.players[key].bet,
      won: playerWon
    });
    if (!playerWon) {
      splitPool += game.players[key].bet;
    }
    else {
      numWinners++;
    }
  });
  var dbRef = firebase.database().ref().child('players');
  dbRef.once('value', snap => {
    var dbPlayers = snap.val();
    players.forEach(player => {
      var pointDiff;
      if (player.won) {
        // Return what they bet, plus half their bet, plus their cut of the loser's points.
        pointDiff = Math.floor((player.bet / 2) + (splitPool / numWinners) + player.bet);
      }
      else {
        pointDiff = 0;
      }
      dbRef.child(player.uid).child('points').set(dbPlayers[player.uid].points + pointDiff);
    });
    firebase.database().ref().child('games').child(id).child('status').set('closed');
    window.location.href = '/views/games.html';
  });
};

joinGame = (game, id) => () => {
  var bet = Number(document.getElementById('bet').value);
  if (!userData || Number.isNaN(bet)) {
    return;
  }
  bet = Math.floor(bet);
  var user = firebase.database().ref().child('players').child(userData.uid);
  user.once('value', snap => {
    var points = snap.val().points;
    if (points > bet){
      firebase.database().ref().child('games').child(id).child('players').child(userData.uid).set({
        bet,
        name: userData.displayName,
        photo: userData.photoURL
      });
      user.child('points').set(points - bet);
      location.reload();
    } else {
      alert(`you only have ${points} points!`);
    }
  });
};

togglePlayerWinning = (e) => {
  var li = e.target.closest('li');

  if (!li.dataset.win || li.dataset.win === 'false') {
    li.dataset.win = true;
    li.setAttribute('class', 'card green darken-2 row');
  } else {
    li.dataset.win = false;
    li.setAttribute('class', 'card red darken-2 row');
  }

  e.preventDefault();
  return false;
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
    var players = [];
    Object.keys(game.players).forEach(key => {
      players.push({
        ...game.players[key],
        uid: key
      });
    });
    // set title texts
    titleElem.textContent = game.title;
    timeElem.textContent = game.time;
    statusElem.textContent = game.status;

    
    if (userData && userData.uid === game.owner && game.status !== 'closed') {
      // set up control area
      buttonAreaElem.innerHTML = `
        <a id="open" class="waves-effect waves-light btn col s4">Open</a>
        <a id="play" class="waves-effect waves-light btn col s4">Play</a>
        <a id="end" class="waves-effect waves-light btn col s4">End</a>`;
      document.getElementById('open').onclick = openGame(game, gameID);
      document.getElementById('play').onclick = playGame(game, gameID);
      document.getElementById('end').onclick = endGame(game, gameID);
    
      if (game.status === 'playing') {
        playerListElem.addEventListener('click', togglePlayerWinning);
      } 
    } 
    else if (!game.players[userData.uid] && game.status === 'open') {
      // set up control area
      buttonAreaElem.innerHTML = `
        <div class="input-field col s8">
          <input placeholder="Bet" id="bet" type="text" class="validate">
        </div>
        <div class="col s1"
        <a id="join" class="waves-effect waves-light btn col s3">Join</a>`;
      document.getElementById('join').onclick = joinGame(game, gameID);
    }
    // Set up player list
    playerListElem.innerHTML = '';
    players.forEach(player => {
      playerListElem.innerHTML += `
        <li id="${player.uid}" class="card grey darken-2 row">
          <div class="white-text valign-wrapper">
            <img class="circle col s2" src="${player.photo}">
            <span class="col s8">${player.name}</span>
            <span class="col s2">${player.bet}</span>
          </div>
        </li>`;
    });
  });
};

window.addEventListener('JdoneLoading', fillData);
window.addEventListener('hashchange', fillData);