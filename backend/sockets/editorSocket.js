const {db} = require('../config/firebase')
const { decryptObj } = require('../controller/functions');

const editorSocket = (socket, io) => {
    console.log('Initializing EDITOR Firestore listeners...');

    const status = ['Drafting', 'Returned|4'];
    const keysNotToDecrypt = ['status', 'DV', 'DVKey', 'template', 'origNumber', 'iv']
    const collectionRef = db.collection('records').where('status', 'in', status);
    collectionRef.onSnapshot( (snapshot) => {
        console.log('editor documents found');
        const updatedDocuments = snapshot.docs.reduce((acc, doc) => {
            const encryptedData = doc.data();
            const decryptedData = decryptObj(encryptedData, { keysNotToDecrypt });
            acc[doc.id] = decryptedData;
            return acc;
        }, {});
        io.emit('editor:firestore:update', updatedDocuments);
    },
    (err) => {
        console.error('Error in editor Firestore listener:', err);
    })
}

module.exports = editorSocket