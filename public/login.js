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
  const lblError = document.getElementById('lblError');
  const txtEmail = document.getElementById('txtEmail');
  const txtPassword = document.getElementById('txtPassword');
  const btnLogin = document.getElementById('btnLogin');
  const btnSignUp = document.getElementById('btnSignUp');

  // Events
  btnLogin.addEventListener('click', e => {
    const email = txtEmail.value;
    const password = txtPassword.value;
    const promise = firebase.auth().signInWithEmailAndPassword(email, password);
    promise.catch(e => lblError.innerText = e.message);
  });

  btnSignUp.addEventListener('click', e => {
    const email = txtEmail.value;
    const password = txtPassword.value;
    const promise = firebase.auth().createUserWithEmailAndPassword(email, password);
    promise.catch(e => lblError.innerText = e.message);
  });

  firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
      window.location.replace("index.html");
    }
  })
}());