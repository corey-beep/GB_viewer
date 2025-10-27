# GBz Collection Viewer

A React application for viewing GBz NFT collection on SUI testnet. Connect your wallet to see all your GBz NFTs with full details including attributes, provenance history, and royalty information.

## Features

- 🔌 **Wallet Integration** - Connect your SUI wallet (testnet)
- 🖼️ **NFT Gallery** - View all your GBz NFTs in a responsive grid
- 🎨 **Attribute Display** - See proper attribute names (Anger Issues, Hood Nerd, Fashion Killer, Gym Rat)
- 📜 **Provenance Passport** - View complete ownership history (0-20 stamps)
- 💰 **Dynamic Royalty** - See current royalty percentage (1-20%)
- 🔍 **Detailed View** - Click any NFT for full details and provenance timeline
- 🔗 **Explorer Links** - Direct links to SUI Explorer for transactions and objects

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A SUI wallet extension (Sui Wallet, Suiet, etc.)
- SUI testnet configured in your wallet

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Deploy on Replit

[![Run on Replit](https://replit.com/badge/github/corey-beep/GB_viewer)](https://replit.com/github/corey-beep/GB_viewer)

1. Click the "Run on Replit" badge above or import from GitHub
2. Replit will automatically:
   - Install dependencies
   - Start the dev server
   - Open the app in the Replit webview
3. The app will be accessible via your Replit URL

**Note:** The `.replit` configuration is already set up to run `npm run dev -- --host` automatically.

### Build for Production

```bash
npm run build
npm run preview
```

## Usage

1. **Connect Wallet**: Click the "Connect Wallet" button in the header
2. **Select Wallet**: Choose your SUI wallet from the modal
3. **View NFTs**: Your GBz NFTs will load automatically
4. **Explore Details**: Click any NFT card to see full details and provenance

## NFT Information Displayed

### Card View
- Token ID and image
- Generated name (e.g., "Notorious Kingpin")
- Attribute type with color coding
- Attribute points progress (0-50)
- Provenance count (0-20)
- Current royalty percentage
- Condemned status (if applicable)

### Detail Modal
- Full image and metadata
- Complete attribute information
- Attribute points visualization
- Name rarity badge (if OG title)
- Current status (Active/Condemned)
- Royalty calculation
- Owner address with explorer link
- Object ID with explorer link
- Complete provenance history with:
  - Stamp number
  - Previous owner address
  - Sale price in SUI
  - Timestamp

## Configuration

The app is configured for SUI testnet and the deployed GBz contract. All configuration is in `src/config.ts`:

- Network: Testnet
- Package ID: `0x0d511d9609f8cbb14cfc935c9aee62466421ad76aefffe730f3d62f00c320367`
- Collection State: `0xfd0a19f8f267671123b738332a3d8444163e2377846cfea6ea13627e2739d7f7`

## Attribute Types

1. **Anger Issues** (Red) - 50% common, best PvP stats
2. **Hood Nerd** (Purple) - 5% very rare, worst PvP stats
3. **Fashion Killer** (Pink) - 25% uncommon
4. **Gym Rat** (Blue) - 20% rare

## Provenance System

Each NFT has a provenance passport with up to 20 slots:
- Each secondary sale adds a stamp
- Stamps record owner, price, and timestamp
- More stamps = higher royalty (up to 20%)
- Base royalty: 1%
- Each stamp adds ~0.95%
- Maximum: 20% at full passport

## Tech Stack

- React 18 + TypeScript
- Vite - Fast build tool
- @mysten/sui - SUI TypeScript SDK
- @mysten/dapp-kit - SUI wallet integration
- TailwindCSS - Styling
- Lucide React - Icons

## Project Structure

```
src/
├── components/
│   ├── NFTCard.tsx      # Grid card component
│   └── NFTModal.tsx     # Detail modal component
├── utils/
│   └── sui.ts           # Blockchain utilities
├── config.ts            # Contract configuration
├── types.ts             # TypeScript interfaces
├── App.tsx              # Main application
└── main.tsx             # Entry point
```

## Troubleshooting

### No NFTs showing
- Make sure you're on testnet
- Check that your wallet has GBz NFTs
- Click the "Refresh" button to reload

### Wallet won't connect
- Ensure wallet extension is installed
- Check that testnet is configured in your wallet
- Try refreshing the page

### Images not loading
- Images are hosted on Cloudflare R2
- Check your internet connection
- Some NFTs may have temporary loading issues

## Links

- [SUI Explorer (Testnet)](https://suiscan.xyz/testnet)
- [GBz Smart Contract](https://suiscan.xyz/testnet/object/0x0d511d9609f8cbb14cfc935c9aee62466421ad76aefffe730f3d62f00c320367)
- [Collection State](https://suiscan.xyz/testnet/object/0xfd0a19f8f267671123b738332a3d8444163e2377846cfea6ea13627e2739d7f7)

## License

MIT
