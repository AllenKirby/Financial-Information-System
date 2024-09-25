const admin = require('firebase-admin');
const serviceAccount = require('./financial-information-system-firebase-adminsdk-c9w4k-43cd6423d2.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

modeule.exports = admin;