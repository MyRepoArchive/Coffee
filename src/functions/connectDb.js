const firebase = require('firebase');
const setCacheDefaults = require('./setCacheDefaults');

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

    setCacheDefaults(db.cache);

    console.log('Conectado ao Firebase');

    resolve(db);
  }, e => reject(e));
});

