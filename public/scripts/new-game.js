submitNewGame = function() {
  var title = document.getElementById('title').value;
  var time = document.getElementById('time').value;
  var bet = Number(document.getElementById('bet').value);

  if (Number.isNaN(bet) || !userData) {
    return;
  }
  console.log(userData);

  var games = firebase.database().ref().child('games');
  games.child('next-game-id').once('value')
    .then(snap => {
      var id = snap.val();
      games.child('next-game-id').set(id + 1);
      games.child(id).set({
        title,
        time,
        status: "open",
        players: {
          [userData.uid]: {
            name: userData.displayName,
            bet
          }
        }
      });
    });
  };

document.getElementById('submit').onclick =submitNewGame;