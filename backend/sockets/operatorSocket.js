const {db, admin} = require('../config/firebase')
const { decryptObj } = require('../controller/functions');

const adminSocket = (socket, io) => {
    console.log('Initializing ADMIN Firestore listeners...');
    const status = ['In Review', 'Returned|3']
    const keysNotToDecrypt = ['status', 'DV', 'DVKey', 'template', 'origNumber', 'iv', 'submittedBy']
    const collectionRef = db.collection('records').where('status', 'in', status);
    collectionRef.onSnapshot( (snapshot) => {
        console.log('operator documents found');
        const updatedDocuments = snapshot.docs.reduce((acc, doc) => {
            const encryptedData = doc.data();
            const decryptedData = decryptObj(encryptedData, { keysNotToDecrypt });
            acc[doc.id] = {data: decryptedData};
            return acc;
        }, {});
        const doc = {
            documents: updatedDocuments
        }
        io.emit('operator:firestore:update', doc);
    },
    (err) => {
        console.error('Error in editor Firestore listener:', err);
    })

}

module.exports = adminSocket