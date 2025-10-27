import { X } from 'lucide-react';
import type { GBzNFT } from '../types';
import { ATTRIBUTE_NAMES, ATTRIBUTE_COLORS, ATTRIBUTE_RARITY } from '../config';
import { formatSui, formatTimestamp, shortenAddress } from '../utils/sui';

interface NFTModalProps {
  nft: GBzNFT;
  onClose: () => void;
}

export function NFTModal({ nft, onClose }: NFTModalProps) {
  const attributeName = ATTRIBUTE_NAMES[nft.attribute.attribute_type] || 'Unknown';
  const attributeColor = ATTRIBUTE_COLORS[nft.attribute.attribute_type] || 'bg-gray-500';
  const attributeRarity = ATTRIBUTE_RARITY[nft.attribute.attribute_type] || 'Unknown';

  const calculateRoyalty = () => {
    if (nft.provenance.length === 0) return 1.0;
    // Simplified calculation - actual is more complex with decay
    return 1 + (nft.provenance.length * 0.95);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">{nft.generatedName.full_name}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left: Image */}
            <div>
              <img
                src={nft.imageUrl}
                alt={nft.name}
                className="w-full rounded-lg"
              />
            </div>

            {/* Right: Details */}
            <div>
              {/* Token ID */}
              <div className="mb-4">
                <div className="text-sm text-gray-400">Token ID</div>
                <div className="text-xl font-bold">#{nft.tokenId}</div>
              </div>

              {/* Name Rarity */}
              {nft.generatedName.is_og_title && (
                <div className="mb-4">
                  <span className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-sm px-3 py-1 rounded font-bold">
                    ⭐ {nft.generatedName.name_rarity}
                  </span>
                </div>
              )}

              {/* Attribute */}
              <div className="mb-4">
                <div className="text-sm text-gray-400 mb-2">Attribute</div>
                <div className={`${attributeColor} inline-block px-4 py-2 rounded-lg text-lg font-bold`}>
                  {attributeName}
                </div>
                <div className="text-sm text-gray-400 mt-1">{attributeRarity}</div>
              </div>

              {/* Points */}
              <div className="mb-4">
                <div className="text-sm text-gray-400 mb-2">Attribute Points</div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-green-400 to-blue-500 h-full"
                      style={{ width: `${(nft.attribute.points / 50) * 100}%` }}
                    />
                  </div>
                  <span className="text-lg font-bold">{nft.attribute.points}/50</span>
                </div>
                {nft.attribute.points === 0 && (
                  <div className="text-xs text-gray-500 mt-1">No bonuses yet - level up to gain power!</div>
                )}
              </div>

              {/* Status */}
              <div className="mb-4">
                <div className="text-sm text-gray-400 mb-2">Status</div>
                {nft.isCondemned ? (
                  <span className="bg-red-600 px-3 py-1 rounded text-sm font-bold">
                    ⚠️ CONDEMNED
                  </span>
                ) : (
                  <span className="bg-green-600 px-3 py-1 rounded text-sm font-bold">
                    ✅ Active
                  </span>
                )}
              </div>

              {/* Royalty Info */}
              <div className="mb-4">
                <div className="text-sm text-gray-400 mb-2">Current Royalty Rate</div>
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-4">
                  <div className="text-3xl font-bold">{calculateRoyalty().toFixed(2)}%</div>
                  <div className="text-sm text-gray-300 mt-1">
                    {nft.provenance.length === 0 ? 'Fresh mint - minimal royalty' : `Increases with each sale (max 20%)`}
                  </div>
                </div>
              </div>

              {/* Owner */}
              <div className="mb-4">
                <div className="text-sm text-gray-400 mb-1">Current Owner</div>
                <a
                  href={`https://suiscan.xyz/testnet/account/${nft.currentOwner}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 font-mono text-sm"
                >
                  {shortenAddress(nft.currentOwner)}
                </a>
              </div>

              {/* Object ID */}
              <div className="mb-4">
                <div className="text-sm text-gray-400 mb-1">Object ID</div>
                <a
                  href={`https://suiscan.xyz/testnet/object/${nft.objectId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 font-mono text-sm break-all"
                >
                  {nft.objectId}
                </a>
              </div>
            </div>
          </div>

          {/* Provenance Section */}
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">
              📜 Provenance Passport ({nft.provenance.length}/20 Stamps)
            </h3>

            {nft.provenance.length === 0 ? (
              <div className="bg-gray-800 rounded-lg p-6 text-center text-gray-400">
                <div className="text-4xl mb-2">📭</div>
                <div>No provenance stamps yet</div>
                <div className="text-sm mt-1">This NFT hasn't been sold on secondary markets</div>
              </div>
            ) : (
              <div className="space-y-3">
                {nft.provenance.map((entry, index) => (
                  <div
                    key={index}
                    className="bg-gray-800 rounded-lg p-4 border-l-4 border-purple-500"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-purple-600 px-2 py-1 rounded text-xs font-bold">
                            Stamp #{index + 1}
                          </span>
                          <span className="text-xs text-gray-400">
                            {formatTimestamp(entry.timestamp)}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-xs text-gray-400">Owner</div>
                            <a
                              href={`https://suiscan.xyz/testnet/account/${entry.owner}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 font-mono text-sm"
                            >
                              {shortenAddress(entry.owner)}
                            </a>
                          </div>
                          <div>
                            <div className="text-xs text-gray-400">Sale Price</div>
                            <div className="font-bold">{formatSui(entry.sale_price)} SUI</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {nft.provenance.length > 0 && nft.provenance.length < 20 && (
              <div className="mt-4 text-sm text-gray-400 text-center">
                {20 - nft.provenance.length} more {20 - nft.provenance.length === 1 ? 'stamp' : 'stamps'} available
              </div>
            )}

            {nft.provenance.length === 20 && (
              <div className="mt-4 text-center">
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-lg font-bold">
                  🏆 FULL PASSPORT - Maximum Royalty (20%)
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
