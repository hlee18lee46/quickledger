import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import {
  BaseMessage,
  HumanMessage,
  SystemMessage,
  ToolMessage,
} from "@langchain/core/messages"
import { QUICKLEDGER_SYSTEM_PROMPT } from "./system-prompt"
import { createQuickLedgerTools } from "./tools"

function extractText(content: any): string {
  if (typeof content === "string") return content

  if (Array.isArray(content)) {
    const textPart = content.find((part: any) => part.type === "text")
    return typeof textPart?.text === "string"
      ? textPart.text
      : JSON.stringify(content)
  }

  return JSON.stringify(content)
}

export async function runQuickLedgerAgent({
  message,
  userId,
  walletAddress,
}: {
  message: string
  userId: string
  walletAddress?: string
}) {
  const invokedTools: string[] = []

  console.log("\n================ QUICKLEDGER AGENT ================")
  console.log("Prompt:", message)
  console.log("User:", userId)
  console.log("Wallet:", walletAddress || "No wallet")
  console.log("===================================================\n")

  const model = new ChatGoogleGenerativeAI({
    model: "gemma-4-26b-a4b-it",
    temperature: 0.2,
    apiKey: process.env.GOOGLE_API_KEY,
  })

  const tools = createQuickLedgerTools({ userId, walletAddress })
  const modelWithTools = model.bindTools(tools)

  let messages: BaseMessage[] = [
    new SystemMessage(QUICKLEDGER_SYSTEM_PROMPT),
    new HumanMessage(message),
  ]

  let result = await modelWithTools.invoke(messages)

  while (result.tool_calls && result.tool_calls.length > 0) {
    messages.push(result)

    for (const toolCall of result.tool_calls) {
      const selectedTool = tools.find((t) => t.name === toolCall.name)

      if (!selectedTool) {
        console.warn(`⚠️ Tool not found: ${toolCall.name}`)
        continue
      }

      invokedTools.push(toolCall.name)

      console.log("\n🔧 TOOL INVOKED:", toolCall.name)
      console.log("Tool args:")
      console.log(JSON.stringify(toolCall.args, null, 2))

      const toolResponse = await (selectedTool as any).invoke(toolCall.args)

      console.log("Tool response:")
      try {
        console.log(JSON.stringify(JSON.parse(toolResponse), null, 2))
      } catch {
        console.log(toolResponse)
      }

      console.log("────────────────────────────────────────")

      messages.push(
        new ToolMessage({
          tool_call_id: toolCall.id!,
          content:
            typeof toolResponse === "string"
              ? toolResponse
              : JSON.stringify(toolResponse),
        })
      )
    }

    result = await modelWithTools.invoke(messages)
  }

  const reply = extractText(result.content)

  console.log("\n🧠 FINAL AGENT REPLY:")
  console.log(reply)

  console.log("\n🔨 TOOLS USED:")
  console.table(invokedTools)

  console.log("===================================================\n")

  return {
    reply,
    tools: invokedTools,
  }
}