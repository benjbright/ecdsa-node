import { useState } from "react"
import server from "./server"
import * as secp from "ethereum-cryptography/secp256k1"
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils"
import { keccak256 } from "ethereum-cryptography/keccak"

function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("")
  const [recipient, setRecipient] = useState("")

  // const [msgHash, setMsgHash] = useState()

  const setValue = (setter) => (evt) => setter(evt.target.value)

  let hash

  async function generateSignature(msg) {
    const stringMsg = toString(msg)
    // Step one - hash the msg
    const bytes = utf8ToBytes(stringMsg)
    hash = keccak256(bytes)
    // setMsgHash(hash)
    console.log(privateKey)
    // console.log(hash)

    // Step two - sign the message with private key
    const signature = await secp.sign(hash, privateKey, {
      recovered: true,
    })

    return signature
  }

  async function transfer(evt) {
    evt.preventDefault()

    const sender = await generateSignature(sendAmount)
    console.log(sender)
    console.log(sendAmount)
    console.log(hash)

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: sender,
        amount: parseInt(sendAmount),
        recipient,
        hash,
      })
      setBalance(balance)
    } catch (ex) {
      alert(ex.response.data.message)
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  )
}

export default Transfer
