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
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-black rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-red-900/50"
        style={{
          boxShadow: '0 0 40px rgba(139, 0, 0, 0.4), inset 0 0 30px rgba(0, 0, 0, 0.5)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-black/95 backdrop-blur-xl border-b border-red-900/30 p-6 flex items-center justify-between">
          <h2 className="text-3xl font-black uppercase tracking-tight" style={{
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>{nft.generatedName.full_name}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-red-900/30 rounded-full transition-all border border-red-900/50 hover:border-red-700"
          >
            <X size={24} className="text-red-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left: Image */}
            <div>
              <img
                src={nft.imageUrl}
                alt={nft.name}
                className="w-full rounded-xl border-2 border-red-900/30"
                style={{ boxShadow: '0 0 30px rgba(139, 0, 0, 0.3)' }}
              />
            </div>

            {/* Right: Details */}
            <div className="space-y-4">
              {/* Token ID */}
              <div className="bg-red-950/20 border border-red-900/50 rounded-lg p-4">
                <div className="text-xs text-red-500 uppercase tracking-widest font-bold mb-1">Token ID</div>
                <div className="text-2xl font-black text-white font-mono">#{nft.tokenId}</div>
              </div>

              {/* Name Rarity */}
              {nft.generatedName.is_og_title && (
                <div className="bg-gradient-to-r from-yellow-600 to-orange-600 border-2 border-yellow-500 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">⭐</span>
                    <span className="text-white font-black uppercase tracking-wide">{nft.generatedName.name_rarity}</span>
                  </div>
                </div>
              )}

              {/* Attribute */}
              <div className="bg-red-950/20 border border-red-900/50 rounded-lg p-4">
                <div className="text-xs text-red-500 uppercase tracking-widest font-bold mb-2">Attribute</div>
                <div className={`${attributeColor} inline-block px-4 py-2 rounded-lg text-base font-bold uppercase tracking-wide border border-red-900`}>
                  {attributeName}
                </div>
                <div className="text-xs text-gray-500 mt-2 font-mono">{attributeRarity}</div>
              </div>

              {/* Points */}
              <div className="bg-red-950/20 border border-red-900/50 rounded-lg p-4">
                <div className="text-xs text-red-500 uppercase tracking-widest font-bold mb-3">Attribute Points</div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-black border border-red-900 rounded-full h-4 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-red-600 to-red-800 h-full transition-all"
                      style={{ width: `${(nft.attribute.points / 50) * 100}%` }}
                    />
                  </div>
                  <span className="text-xl font-black font-mono text-white">{nft.attribute.points}<span className="text-gray-600">/50</span></span>
                </div>
                {nft.attribute.points === 0 && (
                  <div className="text-xs text-gray-600 mt-2 font-mono">NO BONUSES - LEVEL UP TO GAIN POWER</div>
                )}
              </div>

              {/* Status */}
              <div className="bg-red-950/20 border border-red-900/50 rounded-lg p-4">
                <div className="text-xs text-red-500 uppercase tracking-widest font-bold mb-2">Status</div>
                {nft.isCondemned ? (
                  <span className="inline-flex items-center gap-2 bg-red-900 border-2 border-red-600 px-4 py-2 rounded-lg text-base font-black uppercase animate-pulse">
                    ⚠️ CONDEMNED
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 bg-green-900 border-2 border-green-600 px-4 py-2 rounded-lg text-base font-black uppercase">
                    ✅ ACTIVE
                  </span>
                )}
              </div>

              {/* Royalty Info */}
              <div className="bg-gradient-to-br from-red-950 to-red-900 border-2 border-red-800 rounded-lg p-5">
                <div className="text-xs text-red-400 uppercase tracking-widest font-bold mb-2">Current Royalty Rate</div>
                <div className="text-4xl font-black text-white mb-2">{calculateRoyalty().toFixed(2)}%</div>
                <div className="text-sm text-red-200 font-mono uppercase">
                  {nft.provenance.length === 0 ? 'FRESH MINT - MINIMAL ROYALTY' : `INCREASES WITH EACH SALE (MAX 20%)`}
                </div>
              </div>

              {/* Owner */}
              <div className="bg-red-950/20 border border-red-900/50 rounded-lg p-4">
                <div className="text-xs text-red-500 uppercase tracking-widest font-bold mb-2">Current Owner</div>
                <a
                  href={`https://suiscan.xyz/testnet/account/${nft.currentOwner}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-400 hover:text-red-300 font-mono text-sm underline"
                >
                  {shortenAddress(nft.currentOwner)}
                </a>
              </div>

              {/* Object ID */}
              <div className="bg-red-950/20 border border-red-900/50 rounded-lg p-4">
                <div className="text-xs text-red-500 uppercase tracking-widest font-bold mb-2">Object ID</div>
                <a
                  href={`https://suiscan.xyz/testnet/object/${nft.objectId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-400 hover:text-red-300 font-mono text-xs break-all underline"
                >
                  {nft.objectId}
                </a>
              </div>
            </div>
          </div>

          {/* Provenance Section */}
          <div className="mt-8">
            <h3 className="text-2xl font-black uppercase tracking-tight mb-6" style={{
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              📜 PROVENANCE PASSPORT ({nft.provenance.length}/20 STAMPS)
            </h3>

            {nft.provenance.length === 0 ? (
              <div className="bg-red-950/20 border-2 border-red-900/50 rounded-xl p-8 text-center">
                <div className="text-6xl mb-4 opacity-30">📭</div>
                <div className="text-xl font-black text-red-400 uppercase mb-2">NO STAMPS YET</div>
                <div className="text-sm text-gray-600 font-mono uppercase">NFT HASN'T BEEN SOLD ON SECONDARY MARKETS</div>
              </div>
            ) : (
              <div className="space-y-3">
                {nft.provenance.map((entry, index) => (
                  <div
                    key={index}
                    className="bg-red-950/20 border-2 border-red-900/50 rounded-lg p-4 hover:border-red-800 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="bg-red-900 border border-red-700 px-3 py-1 rounded-lg text-xs font-black uppercase">
                            STAMP #{index + 1}
                          </span>
                          <span className="text-xs text-gray-500 font-mono">
                            {formatTimestamp(entry.timestamp)}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-[10px] text-red-500 uppercase tracking-widest font-bold mb-1">Owner</div>
                            <a
                              href={`https://suiscan.xyz/testnet/account/${entry.owner}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-red-400 hover:text-red-300 font-mono text-sm underline"
                            >
                              {shortenAddress(entry.owner)}
                            </a>
                          </div>
                          <div>
                            <div className="text-[10px] text-red-500 uppercase tracking-widest font-bold mb-1">Sale Price</div>
                            <div className="font-black text-white text-base">{formatSui(entry.sale_price)} <span className="text-gray-600">SUI</span></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {nft.provenance.length > 0 && nft.provenance.length < 20 && (
              <div className="mt-6 text-center">
                <div className="inline-block bg-red-950/30 border border-red-900/50 px-6 py-3 rounded-lg">
                  <span className="text-red-400 font-mono uppercase text-sm">
                    {20 - nft.provenance.length} MORE {20 - nft.provenance.length === 1 ? 'STAMP' : 'STAMPS'} AVAILABLE
                  </span>
                </div>
              </div>
            )}

            {nft.provenance.length === 20 && (
              <div className="mt-6 text-center">
                <div className="inline-block bg-gradient-to-r from-yellow-600 to-orange-600 border-2 border-yellow-500 px-6 py-3 rounded-lg">
                  <span className="text-white font-black uppercase text-lg flex items-center gap-2">
                    🏆 FULL PASSPORT - MAXIMUM ROYALTY (20%)
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
