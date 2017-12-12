initApp = function() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      var displayName = user.displayName;
      var photoURL = user.photoURL;
      user.getIdToken().then(function(accessToken) {
        document.getElementById('profile-pic').src = user.photoURL || '/resources/default.jpg';
        document.getElementById('profile-name').textContent = user.displayName;
      });
    } else {
      // User is signed out.
      document.getElementById('profile-pic').src = '/resources/default.jpg';
      document.getElementById('profile-name').textContent = 'Not Signed In';
    }
  }, function(error) {
    console.log(error);
  });
};

window.addEventListener('load', function() {
  initApp()
});