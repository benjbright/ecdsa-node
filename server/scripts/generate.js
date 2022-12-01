const secp = require("ethereum-cryptography/secp256k1")
const { toHex } = require("ethereum-cryptography/utils")

const privateKey = secp.utils.randomPrivateKey()

// toHex - allow us to take the private key which is a byte array and
// display it as hexadecimal - typically how we see private keys
// Everytime we run this function will generate a new private key

console.log("Private Key:", toHex(privateKey))

// Then we might want to get the public key - the address
const publicKey = secp.getPublicKey(privateKey)

console.log("Public Key:", toHex(publicKey))
// Note - this is a full public key
// Ethereum using the Keccak hash of the last 20 bytes
// Still not implemented signatures - no security using public key cryptography
// Need to sign some sort of transaction on the client side that would be sent to the server
// Server then recovers the address of the person who sent it from the signature

