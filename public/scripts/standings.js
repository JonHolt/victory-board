fillData = function() {
  var listElem = document.getElementById('standings');
  var dbrefObj = firebase.database().ref().child('Players');
  dbrefObj.on('value', snap => {
    var players = snap.val();
    var playerArray = [];
    Object.keys(players).forEach(key => {
      playerArray.push({
        ...players[key],
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
    + '<h3 class="col s2">Rank</h3>'
    + '<h3 class="col s4">Name</h3>'
    + '<h3 class="col s2">Win</h3>'
    + '<h3 class="col s2">Loss</h3>'
    + '<h3 class="col s2">Score</h3>'
    + '</div>'
    + '</li>';
    var rank = 1;
    playerArray.forEach(player => {
      listElem.innerHTML += '<li class="card grey darken-2 row">'
      + '<a class="white-text" href="/views/profile.html#' + player.uid + '">'
      + '<h3 class="col s2">#' + (rank++).toString() + '</h3>'
      + '<h3 class="col s4">' + player.name + '</h3>'
      + '<h3 class="col s2 center-align green-text">' + player.gamesWon + '</h3>'
      + '<h3 class="col s2 center-align red-text">' + player.gamesLost + '</h3>'
      + '<h3 class="col s2 center-align blue-text">' + player.points + '</h3>'
      + '</a>'
      + '</li>';
    });
  });
};

window.addEventListener('JdoneLoading', fillData);