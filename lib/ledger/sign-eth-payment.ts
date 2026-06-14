"use client"

import TransportWebUSB from "@ledgerhq/hw-transport-webusb"
import Eth from "@ledgerhq/hw-app-eth"
import { JsonRpcProvider, Transaction, parseEther } from "ethers"

const LEDGER_ETH_PATH = "44'/60'/0'/0/0"

export async function signAndBroadcastEthPaymentWithLedger({
  to,
  amountEth,
  rpcUrl,
}: {
  to: string
  amountEth: string
  rpcUrl: string
}) {
  const provider = new JsonRpcProvider(rpcUrl)

  const transport = await TransportWebUSB.create()
  const eth = new Eth(transport)

  try {
    const addressInfo = await eth.getAddress(LEDGER_ETH_PATH, true)
    const from = addressInfo.address

    const nonce = await provider.getTransactionCount(from, "latest")
    const feeData = await provider.getFeeData()
    const network = await provider.getNetwork()

    const tx = Transaction.from({
      type: 2,
      chainId: Number(network.chainId),
      to,
      value: parseEther(amountEth),
      nonce,
      gasLimit: 21000n,
      maxFeePerGas: feeData.maxFeePerGas ?? undefined,
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas ?? undefined,
    })

    const unsignedTxHex = tx.unsignedSerialized.replace(/^0x/, "")
const sig = await eth.signTransaction(
  LEDGER_ETH_PATH,
  unsignedTxHex,
  null
)
    tx.signature = {
      r: `0x${sig.r}`,
      s: `0x${sig.s}`,
      v: Number.parseInt(sig.v, 16),
    }

    const sent = await provider.broadcastTransaction(tx.serialized)

    return {
      from,
      to,
      amountEth,
      txHash: sent.hash,
    }
  } finally {
    await transport.close()
  }
}