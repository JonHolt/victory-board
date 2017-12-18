var userData;

initApp = function() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      var displayName = user.displayName;
      var photoURL = user.photoURL;
      user.getIdToken().then(function(accessToken) {
        userData = {
          photoURL: user.photoURL,
          displayName: user.displayName,
          uid: user.uid
        };
        
        document.getElementById('profile-pic').src = user.photoURL || '/resources/default.jpg';
        document.getElementById('profile-name').textContent = user.displayName;
        // Tell page script to run
        var event = new Event('JdoneLoading');
        window.dispatchEvent(event);
      });
    } else {
      // User is signed out.
      document.getElementById('profile-pic').src = '/resources/default.jpg';
      document.getElementById('profile-name').textContent = 'Not Signed In';
      delete userData;
      // Tell page script to run
      var event = new Event('JdoneLoading');
      window.dispatchEvent(event);
    }
  }, function(error) {
    console.log(error);
  });
};

signOut = function() {
  firebase.auth().signOut();
}

document.getElementById('logout-btn').onclick = signOut;

window.addEventListener('load', function() {
  initApp()
});