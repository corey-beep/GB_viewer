/**
 * Type definitions for GBz NFT Collection
 */

export interface Attribute {
  attribute_type: number;
  points: number;
}

export interface Name {
  full_name: string;
  is_og_title: boolean;
  name_rarity: string;
}

export interface ProvenanceEntry {
  owner: string;
  timestamp: string;
  sale_price: string;
}

export interface GBzNFT {
  objectId: string;
  version: string;
  digest: string;
  tokenId: number;
  name: string;
  description: string;
  imageUrl: string;
  currentOwner: string;
  isCondemned: boolean;
  bountyMetadata: string;
  attribute: Attribute;
  generatedName: Name;
  provenance: ProvenanceEntry[];
}
