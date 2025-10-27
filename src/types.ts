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

export interface NFTRawData {
  data: {
    objectId: string;
    version: string;
    digest: string;
    type: string;
    owner: any;
    content: {
      dataType: string;
      type: string;
      fields: {
        token_id: string;
        name: string;
        description: string;
        image_url: string;
        current_owner: string;
        is_condemned: boolean;
        bounty_metadata: string;
        attribute: {
          type: string;
          fields: {
            attribute_type: number;
            points: number;
          };
        };
        generated_name: {
          type: string;
          fields: {
            full_name: string;
            is_og_title: boolean;
            name_rarity: string;
          };
        };
        provenance: any[];
      };
    };
  };
}
