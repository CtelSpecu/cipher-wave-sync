import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { hardhat, sepolia } from 'wagmi/chains';

const projectId = (import.meta as any).env?.VITE_WALLETCONNECT_PROJECT_ID || 'demo';

export const wagmiConfig = getDefaultConfig({
  appName: 'CipherWaveSync',
  projectId,
  chains: [hardhat, sepolia],
  ssr: false,
});

// Custom chain configuration for localhost
export const localhost = {
  id: 31337,
  name: 'Localhost',
  network: 'localhost',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['http://127.0.0.1:8545'],
    },
    public: {
      http: ['http://127.0.0.1:8545'],
    },
  },
  testnet: true,
};
