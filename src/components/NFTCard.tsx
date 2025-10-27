import { useState } from 'react';
import type { GBzNFT } from '../types';
import { ATTRIBUTE_NAMES, ATTRIBUTE_COLORS, ATTRIBUTE_RARITY } from '../config';
import { formatSui, formatTimestamp, shortenAddress } from '../utils/sui';

interface NFTCardProps {
  nft: GBzNFT;
  onClick?: () => void;
}

export function NFTCard({ nft, onClick }: NFTCardProps) {
  const [imageError, setImageError] = useState(false);
  const attributeName = ATTRIBUTE_NAMES[nft.attribute.attribute_type] || 'Unknown';
  const attributeColor = ATTRIBUTE_COLORS[nft.attribute.attribute_type] || 'bg-gray-500';
  const attributeRarity = ATTRIBUTE_RARITY[nft.attribute.attribute_type] || 'Unknown';

  return (
    <div
      className="bg-gray-800 rounded overflow-hidden hover:shadow-xl transition-all cursor-pointer border border-gray-700 hover:border-purple-500"
      onClick={onClick}
    >
      {/* Image - Small Thumbnail */}
      <div className="relative w-full aspect-square bg-gray-900">
        {!imageError ? (
          <img
            src={nft.imageUrl}
            alt={nft.name}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            <div className="text-2xl">🖼️</div>
          </div>
        )}

        {/* Token ID Badge */}
        <div className="absolute top-1 left-1 bg-black bg-opacity-75 px-1.5 py-0.5 rounded text-[10px] font-bold">
          #{nft.tokenId}
        </div>

        {/* Provenance Count Badge */}
        {nft.provenance.length > 0 && (
          <div className="absolute bottom-1 right-1 bg-blue-600 px-1.5 py-0.5 rounded text-[10px] font-bold">
            📜 {nft.provenance.length}
          </div>
        )}
      </div>

      {/* Minimal Details */}
      <div className="p-1.5">
        {/* Name */}
        <div className="text-xs font-bold truncate mb-0.5">{nft.generatedName.full_name}</div>

        {/* Attribute */}
        <div className={`${attributeColor} inline-block px-1.5 py-0.5 rounded text-[10px] font-bold`}>
          {attributeName}
        </div>
      </div>
    </div>
  );
}
