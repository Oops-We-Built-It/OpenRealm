import { defineChain, isAddress, zeroAddress, type Address } from 'viem';
import deployment from '../../deployments/monad-testnet.json';
export const isMock = (import.meta.env.VITE_APP_MODE || 'mock') === 'mock';
export const monadTestnet = defineChain({
  id: 10143, name: 'Monad Testnet', nativeCurrency: { name: 'Monad', symbol: 'MON', decimals: 18 },
  rpcUrls: { default: { http: [import.meta.env.VITE_MONAD_RPC_URL || 'https://testnet-rpc.monad.xyz'] } },
  blockExplorers: { default: { name: 'Monadscan', url: 'https://testnet.monadscan.com' } }, testnet: true,
});
const rawAddress = import.meta.env.VITE_WORLD_PROTOCOL_ADDRESS || deployment.contractAddress;
export const contractAddress: Address | null = rawAddress && isAddress(rawAddress) && rawAddress !== zeroAddress ? rawAddress : null;
export const configurationError = !['mock', 'testnet'].includes(import.meta.env.VITE_APP_MODE || 'mock')
  ? 'VITE_APP_MODE 必须为 mock 或 testnet。'
  : !isMock && (!contractAddress || deployment.chainId !== 10143) ? '等待成员 B 提供 Monad Testnet 合约地址；请配置 .env.local 或部署清单。' : null;
export const explorerTx = (hash: string) => `${monadTestnet.blockExplorers.default.url}/tx/${hash}`;
