import type { Address, Hash } from 'viem';
/** Frozen A/C boundary. Modules must not access wallets or RPC directly. */
export type ModuleProps = {
  walletAddress: `0x${string}` | null;
  hasPassport: boolean;
  unlocked: boolean;
  onBuy?: () => Promise<void>;
};
export type ModuleId = 1 | 2;
export type WorldModule = { id: ModuleId; name: string; creator: Address; priceWei: bigint; active: boolean };
export type WorldState = {
  hasPassport: boolean; hasForgeAccess: boolean; modules: WorldModule[];
  treasury: Address; creatorPending: bigint; treasuryPending: bigint; ownPending: bigint;
};
export type TransactionState = {
  status: 'idle' | 'pending' | 'success' | 'failed'; label: string; hash?: Hash;
};
export interface WorldGateway {
  read(address: Address): Promise<WorldState>;
  mint(address: Address, onHash: (hash: Hash) => void): Promise<void>;
  buy(address: Address, id: ModuleId, onHash: (hash: Hash) => void): Promise<void>;
  withdraw(address: Address, onHash: (hash: Hash) => void): Promise<void>;
}
