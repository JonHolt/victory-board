fillData = function() {
  var winsElem = document.getElementById('wins'),
      lossElem = document.getElementById('losses'),
      pointsElem = document.getElementById('points'),
      picElem = document.getElementById('profile-pic-big'),
      nameElem = document.getElementById('name');
  var hash = window.location.hash.substr(1);
  var dbrefObj;
  
  if (!hash) {
    if (!userData) { 
      return;
    }
    dbrefObj = firebase.database().ref().child('Players').child(userData.uid);
  } else {
    dbrefObj = firebase.database().ref().child('Players').child(hash);
  }

  dbrefObj.on('value', snap => {
    var stats = snap.val();
    picElem.src = stats.photoURL || '/resources/default.jpg';
    nameElem.textContent = stats.name;
    winsElem.textContent = stats.gamesWon;
    lossElem.textContent = stats.gamesLost;
    pointsElem.textContent = stats.points;
  });
};

window.addEventListener('JdoneLoading', function(){
  fillData();
});

window.addEventListener('hashchange', fillData);