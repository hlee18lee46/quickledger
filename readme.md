# QuickLedgerBooks

QuickLedgerBooks is an AI-powered bookkeeping and payment platform that combines natural language workflows, Ledger hardware wallet security, ENS resolution, automated receipt generation, and vendor email delivery.

Users can manage business payments using simple prompts while maintaining hardware-wallet security for every outgoing transaction.

## Features

### AI Payment Assistant

* LangChain-powered agent workflow
* Gemma LLM tool-calling agent
* Natural language payment instructions
* Vendor and merchant management

### Ledger Hardware Security

* Outgoing payments require Ledger approval
* Transactions are signed directly on the hardware device
* Private keys never leave the Ledger

### ENS Resolution

* Pay vendors using ENS names
* Example:

  * `Pay vitalikkimchi.eth 0.01 ETH`
* Automatically resolves ENS names to wallet addresses before payment preparation

### Payment Management

* Create and track outgoing payments
* View transaction status
* Store transaction hashes
* Direct links to Etherscan

### Receipt Automation

* Generate PDF receipts automatically after payment completion
* Store receipts in MongoDB
* Email receipts directly to vendors

### Agent Logs

* Full history of prompts and agent actions
* Track payment preparation workflows
* Audit trail of bookkeeping activities

## Architecture

Frontend:

* Next.js
* React
* TypeScript
* Tailwind CSS
* shadcn/ui

Backend:

* Next.js API Routes
* MongoDB Atlas

AI:

* LangChain
* Gemma LLM

Blockchain:

* Ethereum Sepolia
* ENS
* Ledger Nano S Plus

Email:

* Nodemailer
* SMTP

PDF Generation:

* pdf-lib

## Example Prompts

```text
Pay vitalikkimchi.eth 0.01 ETH for catering

Pay Sysco 0.01 ETH for food delivery

Generate a PDF receipt for my latest payment

Email the receipt to the vendor
```

## Environment Variables

```env
MONGODB_URI=

GEMINI_API_KEY=

NEXT_PUBLIC_PRIVY_APP_ID=
PRIVY_APP_SECRET=

NEXT_PUBLIC_SEPOLIA_RPC_URL=
ALCHEMY_API_KEY=

SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=
SMTP_PASS=
SMTP_FROM=

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Installation

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

## Workflow

1. User submits a natural language payment request.
2. LangChain agent interprets the request.
3. ENS name is resolved if necessary.
4. Payment is prepared and stored.
5. User approves transaction on Ledger.
6. Transaction is broadcast to Ethereum.
7. Receipt PDF is generated.
8. Receipt is emailed to the vendor.
9. Agent activity is stored in MongoDB.

## Security

* Hardware-wallet approval required for outgoing payments.
* No private keys stored in the application.
* Ledger device performs transaction signing.
* Full audit trail stored in MongoDB.

## Future Work

* Mainnet support
* Multi-chain payments
* Automated invoice generation
* Accounting integrations
* Vendor onboarding portal
* Recurring payments

## License

MIT License
