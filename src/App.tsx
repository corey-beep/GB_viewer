import { useState, useEffect } from 'react';
import { WalletProvider, ConnectButton, useCurrentAccount, SuiClientProvider } from '@mysten/dapp-kit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black bg-opacity-50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                GBz Collection
              </h1>
              {stats && (
                <div className="hidden md:flex items-center gap-4 text-sm">
                  <div className="bg-gray-800 px-3 py-1 rounded">
                    <span className="text-gray-400">Minted:</span>{' '}
                    <span className="font-bold">{stats.totalMinted}/11,111</span>
                  </div>
                  {stats.totalBurned > 0 && (
                    <div className="bg-red-900 px-3 py-1 rounded">
                      <span className="text-gray-400">Burned:</span>{' '}
                      <span className="font-bold">{stats.totalBurned}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <ConnectButton className="!bg-purple-600 !hover:bg-purple-700" />
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
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                Your Collection ({nfts.length} {nfts.length === 1 ? 'NFT' : 'NFTs'})
              </h2>
              <button
                onClick={() => loadNFTs(currentAccount.address)}
                className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm font-bold"
              >
                🔄 Refresh
              </button>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {nfts.map((nft) => (
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
