import server from "./server"
import * as secp from "ethereum-cryptography/secp256k1"
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils"
import { keccak256 } from "ethereum-cryptography/keccak"

function Wallet({
  address,
  setAddress,
  balance,
  setBalance,
  privateKey,
  setPrivateKey,
}) {
  async function onChange(evt) {
    const privateKey = evt.target.value
    setPrivateKey(privateKey)

    // Get the public key using secp library
    const address = toHex(secp.getPublicKey(privateKey))
    setAddress(address)

    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`)
      setBalance(balance)
    } else {
      setBalance(0)
    }
  }

  // Hash the msg
  const message = toString(10)
  const bytes = utf8ToBytes(message)
  const hash = keccak256(bytes)
  // console.log(hash)
  // console.log(toHex(hash))

  // Sign the message
  const PRIVATE_KEY =
    "45e7381c1ff23d18dc2cad94c10b1ee6e0f379a4258ba1fb894ee8972da1ae12"

  async function signMessage(msg) {
    const signature = await secp.sign(msg, privateKey, { recovered: true })
    console.log(signature)

    return signature
  }

  // Recover the public key
  async function recoverKey(msg) {
    const signatureArray = await signMessage(msg)
    const signature = signatureArray[0]
    const recoveryBit = signatureArray[1]

    const publicKey = secp.recoverPublicKey(msg, signature, recoveryBit)
    console.log(toHex(publicKey))

    // Public key to address
    const address = publicKey.slice(1)
    const keyHash = keccak256(address)
    const ethAddress = keyHash.slice(-20)
    // console.log(toHex(ethAddress))

    return publicKey
  }

  recoverKey(hash)

  // recoverKey(hash, signature, recoveryBit)

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input
          placeholder="Type in a private key"
          value={privateKey}
          onChange={onChange}
        ></input>
      </label>

      {/* <div>Address: {address.slice(0, 10)}...</div> */}

      <div className="balance">Balance: {balance}</div>
    </div>
  )
}

export default Wallet

// Private key
// 45e7381c1ff23d18dc2cad94c10b1ee6e0f379a4258ba1fb894ee8972da1ae12

// Public key
// 04d09cd389731ab5451ade99a412dcac3139a7957b420bf75e59314d76f60961348bafc95f1ec58e97cbdfeb8deec16932d6bdf079ce276a798c830a382afb10a9
