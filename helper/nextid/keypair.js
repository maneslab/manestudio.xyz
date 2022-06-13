import { randomBytes } from 'crypto'
import { HDKey } from 'wallet.ts'
import { ecsign, toRpcSig, keccakFromString } from 'ethereumjs-util'

export function createKeyPiar(seed = null) {
    if (!seed){
        seed = randomBytes(66)
    }
    return HDKey.parseMasterSeed(seed).derive('')
}

// export function test() {
//     let test_pair = createKeyPiar();
//     // console.log('test_pair_private_key',test_pair.privateKey);
//     // console.log('test_pair_private_key_hex',test_pair.privateKey.toString("hex"));
//     // console.log('test_pair_private_key_hex_back',new Buffer(test_pair.privateKey.toString("hex"), "hex"));

//     return test_pair;
// }

export async function sign(message, privateKey = null , use_hex_private = false) {

    
    if (privateKey === null) throw new Error('Failed to sign.')

    console.log('privateKey.length',privateKey.length)
    console.log('privateKey.indexOf',privateKey.indexOf('0x'))

    if (privateKey.length == 66 && privateKey.indexOf('0x') == 0) {
        privateKey = privateKey.slice(2);
    }
    console.log('privateKey',privateKey)

    const messageHash = keccakFromString(`\x19Ethereum Signed Message:\n${message.length}${message}`, 256)

    if (use_hex_private) {
        privateKey = new Buffer(privateKey, "hex")
    }
    const signature = await ecsign(messageHash, privateKey)
    return Buffer.from(toRpcSig(signature.v, signature.r, signature.s).slice(2), 'hex').toString('base64')
}

export async function base64Sign(sign) {
    return Buffer.from(sign.slice(2), 'hex').toString('base64')
}

