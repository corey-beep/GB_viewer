import { X, Dna } from 'lucide-react';
import type { BloodlineStats } from '../utils/sui';
import { formatSui, formatTimestamp, shortenAddress } from '../utils/sui';

interface BloodlineModalProps {
  stats: BloodlineStats;
  userAddress: string;
  onClose: () => void;
}

export function BloodlineModal({ stats, userAddress, onClose }: BloodlineModalProps) {
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
        <div className="sticky top-0 bg-black/95 backdrop-blur-xl border-b border-red-900/30 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-900 rounded-lg flex items-center justify-center">
                <Dna size={28} className="text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-black uppercase tracking-tight" style={{
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>YOUR BLOODLINE</h2>
                <p className="text-xs text-gray-500 font-mono">{shortenAddress(userAddress)}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-red-900/30 rounded-full transition-all border border-red-900/50 hover:border-red-700"
            >
              <X size={24} className="text-red-500" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Stats Overview */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {/* Total Stamps */}
            <div className="bg-gradient-to-br from-red-950 to-red-900 border-2 border-red-800 rounded-lg p-5">
              <div className="text-xs text-red-400 uppercase tracking-widest font-bold mb-2">Total DNA Stamps</div>
              <div className="text-5xl font-black text-white mb-2">{stats.totalStamps}</div>
              <div className="text-sm text-red-200 font-mono uppercase">
                ACROSS THE COLLECTION
              </div>
            </div>

            {/* NFTs Affected */}
            <div className="bg-gradient-to-br from-red-950 to-red-900 border-2 border-red-800 rounded-lg p-5">
              <div className="text-xs text-red-400 uppercase tracking-widest font-bold mb-2">NFTs with Your DNA</div>
              <div className="text-5xl font-black text-white mb-2">{stats.affectedNFTs.length}</div>
              <div className="text-sm text-red-200 font-mono uppercase">
                {stats.collectionPercentage.toFixed(2)}% OF ANALYZED NFTS
              </div>
            </div>

            {/* Total Volume */}
            <div className="bg-gradient-to-br from-red-950 to-red-900 border-2 border-red-800 rounded-lg p-5">
              <div className="text-xs text-red-400 uppercase tracking-widest font-bold mb-2">Sales Volume</div>
              <div className="text-4xl font-black text-white mb-2">{formatSui(stats.totalSalesVolume)}</div>
              <div className="text-sm text-red-200 font-mono uppercase">
                SUI TOTAL
              </div>
            </div>
          </div>

          {/* Explanation */}
          <div className="bg-red-950/20 border border-red-900/50 rounded-lg p-5 mb-8">
            <h3 className="text-lg font-black text-red-400 uppercase mb-3 flex items-center gap-2">
              <span>🧬</span> What is Bloodline?
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed mb-3">
              Your <span className="text-red-400 font-bold">BLOODLINE</span> represents your legacy in the GBz collection.
              Every time you sell an NFT, your wallet address is stamped into its <span className="text-red-400 font-bold">Provenance Passport</span>.
              This creates a permanent record of your ownership across the collection.
            </p>
            <p className="text-gray-300 text-sm leading-relaxed">
              The more NFTs you've owned and traded, the more your <span className="text-red-400 font-bold">DNA</span> spreads throughout
              the collection. Each stamp increases the NFT's royalty rate and tells the story of its journey.
            </p>
          </div>

          {/* Affected NFTs List */}
          {stats.affectedNFTs.length > 0 ? (
            <div>
              <h3 className="text-2xl font-black uppercase tracking-tight mb-6" style={{
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                NFTs CARRYING YOUR DNA ({stats.affectedNFTs.length})
              </h3>

              <div className="space-y-3">
                {stats.affectedNFTs.map((item) => (
                  <div
                    key={item.nft.objectId}
                    className="bg-red-950/20 border-2 border-red-900/50 rounded-lg p-4 hover:border-red-800 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      {/* NFT Image */}
                      <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-red-900 flex-shrink-0">
                        <img
                          src={item.nft.imageUrl}
                          alt={item.nft.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* NFT Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="text-lg font-black text-white uppercase truncate">
                              {item.nft.generatedName.full_name}
                            </h4>
                            <div className="text-xs text-gray-500 font-mono">
                              Token #{item.nft.tokenId}
                            </div>
                          </div>
                          <div className="bg-red-900 border border-red-700 px-3 py-1 rounded-lg text-xs font-black uppercase whitespace-nowrap ml-2">
                            {item.stampCount} {item.stampCount === 1 ? 'STAMP' : 'STAMPS'}
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs">
                          <div>
                            <span className="text-red-500 uppercase font-bold">Last Owned:</span>{' '}
                            <span className="text-gray-400 font-mono">{formatTimestamp(item.lastOwnedTimestamp)}</span>
                          </div>
                        </div>

                        <div className="mt-2">
                          <a
                            href={`https://suiscan.xyz/testnet/object/${item.nft.objectId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-red-400 hover:text-red-300 font-mono text-xs underline"
                          >
                            View on Explorer →
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-red-950/20 border-2 border-red-900/50 rounded-xl p-8 text-center">
              <div className="text-6xl mb-4 opacity-30">🧬</div>
              <div className="text-xl font-black text-red-400 uppercase mb-2">NO DNA FOUND YET</div>
              <div className="text-sm text-gray-600 font-mono uppercase">
                YOUR BLOODLINE WILL APPEAR AFTER YOU SELL NFTs ON SECONDARY MARKETS
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
