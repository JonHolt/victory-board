submitNewGame = function() {
  var title = document.getElementById('title').value;
  var time = document.getElementById('time').value;
  var bet = Number(document.getElementById('bet').value);

  if (Number.isNaN(bet) || !userData || bet > userData.points) {
    return;
  }

  var games = firebase.database().ref().child('games');
  games.child('next-game-id').once('value')
    .then(snap => {
      var id = snap.val();
      games.child('next-game-id').set(id + 1);
      games.child(id).set({
        title,
        time,
        status: "open",
        owner: userData.uid,
        players: {
          [userData.uid]: {
            name: userData.displayName,
            photo: userData.photoURL || '/resources/default.jpg',
            bet
          }
        }
      });
      firebase.database().ref().child('players').child(userData.uid).child('points').set(userData.points - bet);
      window.location.href = '/views/games.html';
    });
};

fillData = function() {
  document.getElementById('points').textContent = `You have ${userData.points} points available.`;
}

window.addEventListener('JdoneLoading', fillData);
document.getElementById('submit').onclick =submitNewGame;