const firebase = require('firebase');

const { firebase_auth: { apiKey, authDomain, databaseURL, projectId, storageBucket, messagingSenderId, appId, measurementId } } = require('../config/auth.json');
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

db.ref('/').once('value').then(data => global.cache = data.val());

module.exports = db;

console.log('Conectado ao Firebase');