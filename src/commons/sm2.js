const sm2 = require('sm-crypto').sm2 

function keygen(){
    let keypair = sm2.generateKeyPairHex(),
    publicKey = keypair.publicKey, // 公钥
    privateKey = keypair.privateKey; // 私钥
   
    return{
        PK: publicKey,
        SK: privateKey
    }
}

function recover(sk){
    return sm2.getPublicKeyFromPrivateKey(sk)
}

function encrypt(msgString, publicKey, cipherMode){
  
    return sm2.doEncrypt(msgString, publicKey, cipherMode)

}

function decrypt(encryptData, privateKey, cipherMode){
    return sm2.doDecrypt(encryptData, privateKey, cipherMode)
}

function sign(msg, privateKey){
    return sm2.doSignature(msg, privateKey, {hash:true} )
}

function verify(msg, sigValueHex, publicKey){
    return sm2.doVerifySignature(msg, sigValueHex, publicKey ,{hash:true} )
}

module.exports = {keygen, encrypt, decrypt, sign, verify, recover}