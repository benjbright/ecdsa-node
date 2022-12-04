const express = require("express")
const app = express()
const cors = require("cors")
const port = 3042
const secp = require("ethereum-cryptography/secp256k1")

app.use(cors())
app.use(express.json())

const balances = {
  "0x1": 100,
  "0x2": 50,
  "0x3": 75,
  "04d09cd389731ab5451ade99a412dcac3139a7957b420bf75e59314d76f60961348bafc95f1ec58e97cbdfeb8deec16932d6bdf079ce276a798c830a382afb10a9": 200,
}

app.get("/balance/:address", (req, res) => {
  const { address } = req.params
  const balance = balances[address] || 0
  res.send({ balance })
})

app.post("/send", (req, res) => {
  const { sender, recipient, amount, hash } = req.body
  console.log(hash)

  const publicKey = getPublicKey(sender, hash)

  setInitialBalance(publicKey)
  setInitialBalance(recipient)

  if (balances[publicKey] < amount) {
    res.status(400).send({ message: "Not enough funds!" })
  } else {
    balances[publicKey] -= amount
    balances[recipient] += amount
    res.send({ balance: balances[publicKey] })
  }
})

app.listen(port, () => {
  console.log(`Listening on port ${port}!`)
})

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0
  }
}

// Recover the public key from the signature
function getPublicKey(sender, msgHash) {
  const signature = sender[0]
  const recoveryBit = sender[1]

  const publicKey = secp.recoverPublicKey(msgHash, signature, recoveryBit)
  console.log(publicKey)

  return publicKey
}
