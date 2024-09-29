const admin = require('firebase-admin');
const serviceAccount = require('./financial-information-system-firebase-adminsdk-c9w4k-84d64b08dd.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = {admin, db};
