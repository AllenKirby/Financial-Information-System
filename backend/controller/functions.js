const crypto = require("crypto");
require('dotenv').config();

const keyHex = process.env.ENCRYPTION_KEY
const key = Buffer.from(keyHex, 'hex');

const encrypt = (data, iv) => {
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    const dataStr = typeof data === "string" ? data : data.toString();
    let encrypted = cipher.update(dataStr, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted
}

const encryptObj = (data, options = {}) => {
    const { keysToEncrypt = [], keysNotToEncrypt = [] } = options
    const copy = {...data};
    const iv = crypto.randomBytes(16);

    const keys = keysToEncrypt.length > 0 ? keysToEncrypt : Object.keys(copy).filter((key) => !keysNotToEncrypt.includes(key))

    keys.forEach((key) => {
        if(Array.isArray(copy[key])){
            copy[key] = copy[key].map((item) => encrypt(item.toString(), iv))
        }else if(copy[key]){
            copy[key] = encrypt(copy[key], iv)
        }
    });
    return {...copy, iv: iv.toString('hex')}
}

const decrypt = (encryptedData, ivHex) => {
    const iv = Buffer.from(ivHex, "hex")
    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv)
    let decrypted = decipher.update(encryptedData, "hex", "utf8")
    decrypted += decipher.final("utf8")
    return decrypted
}

const decryptObj = (data, options = {}) => {
    if(!data.iv){
        return data
    }
    const { keysToDecrypt = [], keysNotToDecrypt = [] } = options
    const copy = {...data}

    const keys = keysToDecrypt.length > 0 ? keysToDecrypt : Object.keys(copy).filter((key) => !keysNotToDecrypt.includes(key))

    keys.forEach((key) => {
        if(Array.isArray(copy[key])){
            copy[key] = copy[key].map((item) => decrypt(item.toString(), copy.iv))
        }else if(copy[key]){
            copy[key] = decrypt(copy[key], copy.iv)
        }
    })
    delete copy.iv
    return copy
}

module.exports = {
    encrypt,
    encryptObj,
    decrypt,
    decryptObj
}