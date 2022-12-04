import Wallet from "./Wallet"
import Transfer from "./Transfer"
import "./App.scss"
import { useState } from "react"

function App() {
  const [balance, setBalance] = useState(0)
  const [address, setAddress] = useState("")
  const [privateKey, setPrivateKey] = useState("")

  return (
    <div className="app">
      <Wallet
        balance={balance}
        privateKey={privateKey}
        setPrivateKey={setPrivateKey}
        setBalance={setBalance}
        address={address}
        setAddress={setAddress}
      />
      <Transfer
        setBalance={setBalance}
        address={address}
        privateKey={privateKey}
      />
      {/* Transfer function should eventually take the private key to generate a signed transaction - a signature.  The server can then derive the address from the signature */}
    </div>
  )
}

export default App
