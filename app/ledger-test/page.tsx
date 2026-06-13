"use client"

import { useState } from "react"
import TransportWebUSB from "@ledgerhq/hw-transport-webusb"
import Eth from "@ledgerhq/hw-app-eth"

export default function LedgerTestPage() {
  const [address, setAddress] = useState("")
  const [error, setError] = useState("")

  async function testLedger() {
    try {
      setError("")

      const transport = await TransportWebUSB.create()
      const eth = new Eth(transport)

      const account = await eth.getAddress(
        "44'/60'/0'/0/0",
        true
      )

      setAddress(account.address)

      await transport.close()
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Failed to connect Ledger")
    }
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">
        Ledger Test
      </h1>

      <button
        onClick={testLedger}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Connect Ledger
      </button>

      {address && (
        <div className="mt-4">
          Address: {address}
        </div>
      )}

      {error && (
        <div className="mt-4 text-red-500">
          {error}
        </div>
      )}
    </div>
  )
}