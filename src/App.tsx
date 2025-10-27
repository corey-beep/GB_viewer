import { useState, useEffect } from 'react';
import { WalletProvider, ConnectButton, useCurrentAccount, SuiClientProvider } from '@mysten/dapp-kit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getFullnodeUrl } from '@mysten/sui/client';
import { NFTCard } from './components/NFTCard';
import { NFTModal } from './components/NFTModal';
import { fetchUserNFTs, fetchCollectionStats } from './utils/sui';
import type { GBzNFT } from './types';
import './App.css';

// Setup SUI client
const networks = {
  testnet: { url: getFullnodeUrl('testnet') },
};

const queryClient = new QueryClient();

function NFTViewer() {
  const currentAccount = useCurrentAccount();
  const [nfts, setNfts] = useState<GBzNFT[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedNFT, setSelectedNFT] = useState<GBzNFT | null>(null);
  const [stats, setStats] = useState<any>(null);

  // Filter states
  const [selectedClass, setSelectedClass] = useState<number | 'all'>('all');
  const [pointsFilter, setPointsFilter] = useState<'all' | 'low' | 'high'>('all');
  const [passportFilter, setPassportFilter] = useState<'all' | 'low' | 'high'>('all');
  const [sortBy, setSortBy] = useState<'none' | 'rarity-low' | 'rarity-high'>('none');

  // Fetch NFTs when wallet connects
  useEffect(() => {
    if (currentAccount?.address) {
      loadNFTs(currentAccount.address);
      loadStats();
    } else {
      setNfts([]);
    }
  }, [currentAccount]);

  const loadNFTs = async (address: string) => {
    setLoading(true);
    setError(null);
    try {
      const userNFTs = await fetchUserNFTs(address);
      setNfts(userNFTs);
    } catch (err: any) {
      setError(err.message || 'Failed to load NFTs');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const collectionStats = await fetchCollectionStats();
      setStats(collectionStats);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  // Helper function to calculate rarity score (lower = more rare)
  const getRarityScore = (nft: GBzNFT) => {
    // Attribute rarity weights (lower = more rare)
    const attributeWeights: Record<number, number> = {
      2: 1,  // Hood Nerd - 5% (most rare)
      4: 2,  // Gym Rat - 20%
      3: 3,  // Fashion Killer - 25%
      1: 4,  // Anger Issues - 50% (least rare)
    };

    // Base score from attribute rarity
    let score = attributeWeights[nft.attribute.attribute_type] || 5;

    // Add passport stamps (more stamps = more rare)
    score += (20 - nft.provenance.length) * 0.1;

    // Add points (higher points = more rare)
    score += (50 - nft.attribute.points) * 0.05;

    // OG title makes it more rare
    if (nft.generatedName.is_og_title) {
      score -= 0.5;
    }

    return score;
  };

  // Filter NFTs based on selected filters
  let filteredNfts = nfts.filter((nft) => {
    // Class filter
    if (selectedClass !== 'all' && nft.attribute.attribute_type !== selectedClass) {
      return false;
    }

    // Points filter (low: 0-25, high: 26-50)
    if (pointsFilter === 'low' && nft.attribute.points > 25) {
      return false;
    }
    if (pointsFilter === 'high' && nft.attribute.points <= 25) {
      return false;
    }

    // Passport filter (low: 0-10, high: 11-20)
    if (passportFilter === 'low' && nft.provenance.length > 10) {
      return false;
    }
    if (passportFilter === 'high' && nft.provenance.length <= 10) {
      return false;
    }

    return true;
  });

  // Sort filtered NFTs by rarity
  if (sortBy === 'rarity-low') {
    // Lowest to highest rarity (common to rare)
    filteredNfts = [...filteredNfts].sort((a, b) => getRarityScore(b) - getRarityScore(a));
  } else if (sortBy === 'rarity-high') {
    // Highest to lowest rarity (rare to common)
    filteredNfts = [...filteredNfts].sort((a, b) => getRarityScore(a) - getRarityScore(b));
  }

  return (
    <div className="min-h-screen bg-black text-white" style={{ backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,0,0,0.03) 0px, transparent 1px, transparent 2px, rgba(255,0,0,0.03) 3px), linear-gradient(180deg, #000000 0%, #0a0a0a 50%, #000000 100%)' }}>
      {/* Header */}
      <header className="border-b border-red-900/30 bg-black/95 backdrop-blur-xl sticky top-0 z-40" style={{
        boxShadow: '0 4px 30px rgba(139, 0, 0, 0.1), inset 0 -1px 0 rgba(220, 38, 38, 0.2)'
      }}>
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              {/* Logo/Title */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-900 rounded-lg flex items-center justify-center" style={{
                  boxShadow: '0 0 20px rgba(220, 38, 38, 0.4), inset 0 0 20px rgba(0, 0, 0, 0.3)'
                }}>
                  <span className="text-3xl">👑</span>
                </div>
                <div>
                  <h1 className="text-3xl font-black uppercase tracking-tight leading-none" style={{
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    textShadow: '0 2px 10px rgba(220, 38, 38, 0.3)'
                  }}>
                    GHETTO BABYZ
                  </h1>
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">NFT Collection</p>
                </div>
              </div>

              {/* Stats */}
              {stats && (
                <div className="hidden lg:flex items-center gap-3 text-sm">
                  <div className="bg-red-950/30 backdrop-blur-sm border border-red-900/50 px-4 py-2 rounded-lg font-mono">
                    <span className="text-red-500 text-xs">SUPPLY</span>{' '}
                    <span className="font-bold text-white ml-1 text-base">{stats.totalMinted.toLocaleString()}</span>
                    <span className="text-gray-600">/11,111</span>
                  </div>
                  {stats.totalBurned > 0 && (
                    <div className="bg-black/50 backdrop-blur-sm border border-red-700/50 px-4 py-2 rounded-lg font-mono">
                      <span className="text-red-400 text-xs">BURNED</span>{' '}
                      <span className="font-bold text-red-300 ml-1 text-base">{stats.totalBurned.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <ConnectButton className="!bg-gradient-to-r !from-red-600 !to-red-700 hover:!from-red-700 hover:!to-red-800 !border !border-red-500/50 !rounded-lg !font-bold !text-sm !px-6 !py-2.5 !shadow-lg !shadow-red-900/30 !transition-all" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {!currentAccount ? (
          // Not Connected
          <div className="text-center py-20">
            <div className="text-6xl mb-4">👛</div>
            <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
            <p className="text-gray-400 mb-6">
              Connect your SUI wallet to view your GBz NFT collection
            </p>
            <div className="text-sm text-gray-500">
              Make sure you're on <span className="text-purple-400 font-bold">Testnet</span>
            </div>
          </div>
        ) : loading ? (
          // Loading
          <div className="text-center py-20">
            <div className="text-6xl mb-4 animate-spin">⚙️</div>
            <h2 className="text-2xl font-bold mb-2">Loading NFTs...</h2>
            <p className="text-gray-400">Fetching from SUI blockchain</p>
          </div>
        ) : error ? (
          // Error
          <div className="text-center py-20">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold mb-2">Error Loading NFTs</h2>
            <p className="text-red-400">{error}</p>
            <button
              onClick={() => loadNFTs(currentAccount.address)}
              className="mt-4 bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg font-bold"
            >
              Try Again
            </button>
          </div>
        ) : nfts.length === 0 ? (
          // No NFTs
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-2xl font-bold mb-2">No GBz NFTs Found</h2>
            <p className="text-gray-400 mb-4">
              This wallet doesn't own any GBz NFTs yet
            </p>
            <div className="text-sm text-gray-500">
              Connected: {currentAccount.address.slice(0, 6)}...{currentAccount.address.slice(-4)}
            </div>
          </div>
        ) : (
          // NFT Grid
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4">
                Your Collection ({filteredNfts.length} of {nfts.length} {nfts.length === 1 ? 'NFT' : 'NFTs'})
              </h2>

              {/* Filters */}
              <div className="flex flex-wrap gap-3 items-center">
                {/* Class Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-red-500 uppercase font-bold">Class:</span>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                    className="bg-red-950/30 border border-red-900/50 rounded-lg px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-red-700"
                  >
                    <option value="all">ALL</option>
                    <option value="1">ANGER ISSUES</option>
                    <option value="2">HOOD NERD</option>
                    <option value="3">FASHION KILLER</option>
                    <option value="4">GYM RAT</option>
                  </select>
                </div>

                {/* Points Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-red-500 uppercase font-bold">Points:</span>
                  <select
                    value={pointsFilter}
                    onChange={(e) => setPointsFilter(e.target.value as any)}
                    className="bg-red-950/30 border border-red-900/50 rounded-lg px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-red-700"
                  >
                    <option value="all">ALL</option>
                    <option value="low">LOW (0-25)</option>
                    <option value="high">HIGH (26-50)</option>
                  </select>
                </div>

                {/* Passport Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-red-500 uppercase font-bold">Passport:</span>
                  <select
                    value={passportFilter}
                    onChange={(e) => setPassportFilter(e.target.value as any)}
                    className="bg-red-950/30 border border-red-900/50 rounded-lg px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-red-700"
                  >
                    <option value="all">ALL</option>
                    <option value="low">LOW (0-10)</option>
                    <option value="high">HIGH (11-20)</option>
                  </select>
                </div>

                {/* Sort By */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-red-500 uppercase font-bold">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-red-950/30 border border-red-900/50 rounded-lg px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-red-700"
                  >
                    <option value="none">NONE</option>
                    <option value="rarity-high">RARITY: HIGH TO LOW</option>
                    <option value="rarity-low">RARITY: LOW TO HIGH</option>
                  </select>
                </div>

                {/* Clear Filters */}
                {(selectedClass !== 'all' || pointsFilter !== 'all' || passportFilter !== 'all' || sortBy !== 'none') && (
                  <button
                    onClick={() => {
                      setSelectedClass('all');
                      setPointsFilter('all');
                      setPassportFilter('all');
                      setSortBy('none');
                    }}
                    className="bg-red-900 border border-red-700 hover:bg-red-800 px-4 py-2 rounded-lg text-sm font-bold uppercase transition-all"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              {filteredNfts.map((nft) => (
                <NFTCard
                  key={nft.objectId}
                  nft={nft}
                  onClick={() => setSelectedNFT(nft)}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-black bg-opacity-50 mt-20">
        <div className="container mx-auto px-4 py-6 text-center text-gray-400 text-sm">
          <div className="mb-2">
            GBz Collection Viewer • SUI Testnet
          </div>
          <div>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300"
            >
              View on GitHub
            </a>
            {' • '}
            <a
              href="https://suiscan.xyz/testnet"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300"
            >
              SUI Explorer
            </a>
          </div>
        </div>
      </footer>

      {/* NFT Detail Modal */}
      {selectedNFT && (
        <NFTModal
          nft={selectedNFT}
          onClose={() => setSelectedNFT(null)}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networks} defaultNetwork="testnet">
        <WalletProvider autoConnect={true}>
          <NFTViewer />
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}

export default App;
