(function() {
  // Initialize Firebase 
  const config = {
    apiKey: "AIzaSyDuVdzz4xl7FFA6plvj_tKd9zdq5f_iUvs",
    authDomain: "holt-family-victory-board.firebaseapp.com",
    databaseURL: "https://holt-family-victory-board.firebaseio.com",
    projectId: "holt-family-victory-board",
    storageBucket: "holt-family-victory-board.appspot.com",
    messagingSenderId: "447001346789"
  };
  firebase.initializeApp(config);

  // Get elements
  const btnLogout = document.getElementById('btnLogout');

  // Events
  btnLogout.addEventListener('click', e => {
    firebase.auth().signOut();
  });

  firebase.auth().onAuthStateChanged(firebaseUser => {
    if (!firebaseUser) {
      window.location.replace("login.html");
    }
  })
}());