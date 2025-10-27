import { useState } from 'react';
import type { GBzNFT } from '../types';
import { ATTRIBUTE_NAMES, ATTRIBUTE_COLORS } from '../config';

interface NFTCardProps {
  nft: GBzNFT;
  onClick?: () => void;
}

export function NFTCard({ nft, onClick }: NFTCardProps) {
  const [imageError, setImageError] = useState(false);
  const attributeName = ATTRIBUTE_NAMES[nft.attribute.attribute_type] || 'Unknown';
  const attributeColor = ATTRIBUTE_COLORS[nft.attribute.attribute_type] || 'bg-gray-500';

  return (
    <div
      className="bg-black rounded overflow-hidden hover:shadow-2xl transition-all cursor-pointer border-2 border-red-900 hover:border-red-600"
      style={{
        width: '250px',
        boxShadow: '0 0 15px rgba(139, 0, 0, 0.3), inset 0 0 20px rgba(0, 0, 0, 0.8)'
      }}
      onClick={onClick}
    >
      {/* Image - Thumbnail */}
      <div className="relative w-full h-[250px] bg-gray-900">
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

      {/* Details */}
      <div className="p-2 bg-gradient-to-b from-black to-red-950">
        {/* Name */}
        <div className="text-sm font-bold truncate mb-1 text-red-100 uppercase tracking-wide">{nft.generatedName.full_name}</div>

        {/* Attribute */}
        <div className={`${attributeColor} inline-block px-2 py-1 rounded text-xs font-bold mb-2 border border-red-900 uppercase tracking-wider`}>
          {attributeName}
        </div>

        {/* Compact Stats */}
        <div className="flex gap-1 text-xs mt-1 font-mono">
          <div className="bg-black border border-red-900 rounded px-1.5 py-1 flex-1 text-center">
            <span className="text-red-500">PTS:</span> <span className="font-bold text-white">{nft.attribute.points}/50</span>
          </div>
          <div className="bg-black border border-red-900 rounded px-1.5 py-1 flex-1 text-center">
            <span className="text-red-500">PASS:</span> <span className="font-bold text-white">{nft.provenance.length}/20</span>
          </div>
        </div>
      </div>
    </div>
  );
}
