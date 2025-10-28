/**
 * GBz NFT Collection Viewer Configuration
 * Network: SUI Testnet
 * Version: V2 - Deployed 2025-10-27
 */

export const CONTRACT_INFO = {
  network: "testnet" as const,
  packageId: "0x4e91a01313fb9d17a85dd23024aba33f7108aa4b3d479bb854c14220ecb32168",
  moduleName: "gbz_dynamic",

  // Shared Objects
  collectionState: "0xec70ab528dcc49d202e0f22060299fb35012e0b113ef95f7b604b6fa9811b0b6",
  rewardPool: "0xd4f63e264c92ae2d7affb771878bf21ec9ad104a39ee5297a4f70859e4205466",
  globalProvenanceTracker: "0xfbe5c8e8aa5bc4890cbd51aec8d60432bf0c574c842a97e20c2d241c81a2e7a3",
  transferPolicy: "0x7f573384bca88f6bffe5c8e32a32beb9965eb348c987ca94309eb7457e655c62",
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
  maxSupply: 11_019,
  imageBaseUrl: "https://pub-65ffe756dc414f1c813b2513d0430fb0.r2.dev/",
  imageOffset: 0, // No offset - images are 1.png to 11019.png
};

// Calculate image URL from token ID
export function getImageUrl(tokenId: number): string {
  return `${COLLECTION_INFO.imageBaseUrl}${tokenId + COLLECTION_INFO.imageOffset + 1}.png`; // +1 because token IDs start at 0
}
