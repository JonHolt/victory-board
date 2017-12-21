fillData = function() {
  var listElem = document.getElementById('standings');
  var dbrefObj = firebase.database().ref().child('players');
  dbrefObj.on('value', snap => {
    var players = snap.val();
    var playerArray = [];
    Object.keys(players).forEach(key => {
      playerArray.push({
        gamesLost: players[key].gamesLost,
        gamesWon: players[key].gamesWon,
        name: players[key].name,
        photoURL: players[key].photoURL,
        points: players[key].points,
        uid: key
      });
    });
    
    playerArray.sort((a, b) => {
      if (a.points != b.points){
        return b.points - a.points;
      }
      else if(a.gamesWon != b.gamesWon) {
        return b.gamesWon - a.gamesWon;
      }
      else {
        return a.gamesLost - b.gamesLost;
      }      
    });
    
    listElem.innerHTML = '<li class="card grey darken-2 row">'
    + '<div class="white-text">'
    + '<span class="col s2">Rank</span>'
    + '<span class="col s4">Name</span>'
    + '<span class="col s2">Win</span>'
    + '<span class="col s2">Loss</span>'
    + '<span class="col s2">Score</span>'
    + '</div>'
    + '</li>';
    var rank = 1;
    playerArray.forEach(player => {
      listElem.innerHTML += '<li class="card grey darken-2 row">'
      + '<a class="white-text" href="/views/profile.html#' + player.uid + '">'
      + '<span class="col s2">#' + (rank++).toString() + '</span>'
      + '<span class="col s4">' + player.name + '</span>'
      + '<span class="col s2 center-align green-text">' + player.gamesWon + '</span>'
      + '<span class="col s2 center-align red-text">' + player.gamesLost + '</span>'
      + '<span class="col s2 center-align blue-text">' + player.points + '</span>'
      + '</a>'
      + '</li>';
    });
  });
};

window.addEventListener('JdoneLoading', fillData);