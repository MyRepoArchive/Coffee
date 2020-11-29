const firebase = require('firebase');

const { apiKey, authDomain, databaseURL, projectId, storageBucket, messagingSenderId, appId, measurementId } = require('../config/auth.json');
const firebaseConfig = {
  apiKey,
  authDomain,
  databaseURL,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
  measurementId
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.default.database();

module.exports.db = db;

module.exports.start = () => new Promise((resolve, reject) => {
  db.ref('/').once('value').then(data => {
    db.cache = data.val();

    console.log(db.ref('/teste').child('a').update({ "0": { a: ['ade', 546, {}, [null, 2], false] } }).then(data => console.log(data)));

    console.log('Conectado ao Firebase');

    resolve(db);
  }, e => reject(e));
});

module.exports.start()

