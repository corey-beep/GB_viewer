/**
 * SUI Blockchain Utilities for NFT Fetching
 */

import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { CONTRACT_INFO, NFT_TYPE } from '../config';
import type { GBzNFT, ProvenanceEntry } from '../types';

// Initialize SUI client for testnet
export const suiClient = new SuiClient({
  url: getFullnodeUrl('testnet')
});

/**
 * Fetch all GBz NFTs owned by an address
 */
export async function fetchUserNFTs(address: string): Promise<GBzNFT[]> {
  try {
    // Get all objects owned by the address
    const ownedObjects = await suiClient.getOwnedObjects({
      owner: address,
      filter: {
        StructType: NFT_TYPE,
      },
      options: {
        showContent: true,
        showType: true,
        showOwner: true,
      },
    });

    // Process each NFT
    const nfts: GBzNFT[] = [];

    for (const obj of ownedObjects.data) {
      if (obj.data?.content?.dataType === 'moveObject') {
        const fields = (obj.data.content as any).fields;

        // Parse provenance entries
        const provenance: ProvenanceEntry[] = fields.provenance.map((entry: any) => ({
          owner: entry.fields.owner,
          timestamp: entry.fields.timestamp,
          sale_price: entry.fields.sale_price,
        }));

        nfts.push({
          objectId: obj.data.objectId,
          version: obj.data.version,
          digest: obj.data.digest,
          tokenId: parseInt(fields.token_id),
          name: fields.name,
          description: fields.description,
          imageUrl: fields.image_url,
          currentOwner: fields.current_owner,
          isCondemned: fields.is_condemned,
          bountyMetadata: fields.bounty_metadata,
          attribute: {
            attribute_type: fields.attribute.fields.attribute_type,
            points: fields.attribute.fields.points,
          },
          generatedName: {
            full_name: fields.generated_name.fields.full_name,
            is_og_title: fields.generated_name.fields.is_og_title,
            name_rarity: fields.generated_name.fields.name_rarity,
          },
          provenance,
        });
      }
    }

    return nfts.sort((a, b) => a.tokenId - b.tokenId);
  } catch (error) {
    console.error('Error fetching NFTs:', error);
    throw error;
  }
}

/**
 * Fetch collection stats
 */
export async function fetchCollectionStats() {
  try {
    const collectionState = await suiClient.getObject({
      id: CONTRACT_INFO.collectionState,
      options: {
        showContent: true,
      },
    });

    if (collectionState.data?.content?.dataType === 'moveObject') {
      const fields = (collectionState.data.content as any).fields;

      return {
        totalMinted: parseInt(fields.total_minted),
        totalBurned: parseInt(fields.total_burned),
        currentPhase: parseInt(fields.current_phase),
        pvpEnabled: fields.pvp_enabled,
        availableSupply: fields.available_token_ids?.length || 0,
      };
    }
  } catch (error) {
    console.error('Error fetching collection stats:', error);
    return null;
  }
}

/**
 * Fetch NFT by object ID
 */
export async function fetchNFTById(objectId: string): Promise<GBzNFT | null> {
  try {
    const obj = await suiClient.getObject({
      id: objectId,
      options: {
        showContent: true,
        showType: true,
        showOwner: true,
      },
    });

    if (obj.data?.content?.dataType === 'moveObject') {
      const fields = (obj.data.content as any).fields;

      const provenance: ProvenanceEntry[] = fields.provenance.map((entry: any) => ({
        owner: entry.fields.owner,
        timestamp: entry.fields.timestamp,
        sale_price: entry.fields.sale_price,
      }));

      return {
        objectId: obj.data.objectId,
        version: obj.data.version,
        digest: obj.data.digest,
        tokenId: parseInt(fields.token_id),
        name: fields.name,
        description: fields.description,
        imageUrl: fields.image_url,
        currentOwner: fields.current_owner,
        isCondemned: fields.is_condemned,
        bountyMetadata: fields.bounty_metadata,
        attribute: {
          attribute_type: fields.attribute.fields.attribute_type,
          points: fields.attribute.fields.points,
        },
        generatedName: {
          full_name: fields.generated_name.fields.full_name,
          is_og_title: fields.generated_name.fields.is_og_title,
          name_rarity: fields.generated_name.fields.name_rarity,
        },
        provenance,
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching NFT:', error);
    return null;
  }
}

/**
 * Format SUI amount from MIST
 */
export function formatSui(mist: string): string {
  const sui = parseInt(mist) / 1_000_000_000;
  return sui.toFixed(4);
}

/**
 * Format timestamp
 */
export function formatTimestamp(timestamp: string): string {
  const ms = parseInt(timestamp);
  return new Date(ms).toLocaleString();
}

/**
 * Shorten address
 */
export function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
