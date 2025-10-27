/**
 * GBz NFT Collection Viewer Configuration
 * Network: SUI Testnet
 */

export const CONTRACT_INFO = {
  network: "testnet" as const,
  packageId: "0x0d511d9609f8cbb14cfc935c9aee62466421ad76aefffe730f3d62f00c320367",
  moduleName: "gbz_dynamic",

  // Shared Objects
  collectionState: "0xfd0a19f8f267671123b738332a3d8444163e2377846cfea6ea13627e2739d7f7",
  rewardPool: "0x159c73b3f673a8f817530dbc2168c6e198c94897f860dfeeed421c002eecc759",
  globalProvenanceTracker: "0x17b48714559c16ad75aff8253fe874ba0f0428e770049c8d97ec13ec3571b03f",
  transferPolicy: "0x32f8b09839409e4d7843cbbbf010b9a332dbda4b414fa96551b325f71893c137",
};

export const NFT_TYPE = `${CONTRACT_INFO.packageId}::${CONTRACT_INFO.moduleName}::GBzNFT`;

// Attribute mappings
export const ATTRIBUTE_NAMES: Record<number, string> = {
  1: "Anger Issues",
  2: "Hood Nerd",
  3: "Fashion Killer",
  4: "Gym Rat",
};

export const ATTRIBUTE_COLORS: Record<number, string> = {
  1: "bg-red-500",      // Anger Issues - Red
  2: "bg-purple-500",   // Hood Nerd - Purple
  3: "bg-pink-500",     // Fashion Killer - Pink
  4: "bg-blue-500",     // Gym Rat - Blue
};

export const ATTRIBUTE_RARITY: Record<number, string> = {
  1: "Common (50%)",
  2: "Very Rare (5%)",
  3: "Uncommon (25%)",
  4: "Rare (20%)",
};

export const COLLECTION_INFO = {
  maxSupply: 11_111,
  imageBaseUrl: "https://pub-c907649788c642a19b79ddf4d14b069c.r2.dev/",
  imageOffset: 2268,
};

// Calculate image URL from token ID
export function getImageUrl(tokenId: number): string {
  return `${COLLECTION_INFO.imageBaseUrl}${tokenId + COLLECTION_INFO.imageOffset}.png`;
}
