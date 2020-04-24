const CryptoJS = require('crypto-js');  //引用AES源码js

const key = CryptoJS.enc.Utf8.parse("1234567890ABCDEF");  //十六位十六进制数作为密钥

//加密方法
export const encrypt = (word) => {
    if (word === undefined) {
        return;
    }
    let encrypted = CryptoJS.AES.encrypt(
        CryptoJS.enc.Utf8.parse(word),
        key,
        {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        }
    );
    return encrypted.toString();
}

//解密方法
export const decrypt = (word) => {
    let decrypt = CryptoJS.AES.decrypt(word, key,
        {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        }
    );
    let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
}