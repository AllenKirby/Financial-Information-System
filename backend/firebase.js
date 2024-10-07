const admin = require('firebase-admin');
const serviceAccount = require('./financial-information-system-firebase-adminsdk-c9w4k-84d64b08dd.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://financial-information-system-default-rtdb.asia-southeast1.firebasedatabase.app/"
});

const db = admin.firestore();

const rtdb = admin.database();

module.exports = {admin, db, rtdb};
