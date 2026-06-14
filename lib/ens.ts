// lib/ens.ts
import { JsonRpcProvider } from "ethers"

const provider = new JsonRpcProvider(process.env.MAINNET_RPC_URL)

export async function resolveEnsName(ensName: string) {
  if (!ensName || !ensName.endsWith(".eth")) return null

  const address = await provider.resolveName(ensName)

  if (!address) {
    throw new Error(`ENS name not resolved: ${ensName}`)
  }

  return address
}