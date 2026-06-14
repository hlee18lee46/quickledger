// lib/agent/tools/ens-tools.ts
import { DynamicStructuredTool } from "@langchain/core/tools"
import { z } from "zod"
import { JsonRpcProvider } from "ethers"
import type { ToolContext } from "./index"

const provider = new JsonRpcProvider(process.env.MAINNET_RPC_URL)

export function createENSTools(context: ToolContext) {
  return [
    new DynamicStructuredTool({
      name: "resolve_ens_name",
      description:
        "Resolve an ENS name like sysco.eth into an Ethereum wallet address before creating a payment.",
      schema: z.object({
        ensName: z
          .string()
          .describe("The ENS name to resolve, for example sysco.eth"),
      }),
      func: async ({ ensName }) => {
        try {
          if (!ensName.endsWith(".eth")) {
            return JSON.stringify({
              success: false,
              error: "Input is not an ENS name.",
              ensName,
            })
          }

          const resolvedAddress = await provider.resolveName(ensName)

          if (!resolvedAddress) {
            return JSON.stringify({
              success: false,
              error: "ENS name could not be resolved.",
              ensName,
            })
          }

          return JSON.stringify({
            success: true,
            ensName,
            resolvedAddress,
            chain: "Ethereum Sepolia",
          })
        } catch (error: any) {
          return JSON.stringify({
            success: false,
            ensName,
            error: error.message || "Failed to resolve ENS name.",
          })
        }
      },
    }),
  ]
}