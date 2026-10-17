import { createPublicClient, createWalletClient, custom, http, type Address, type EIP1193Provider, type Hash } from 'viem';
import { contractAddress, monadTestnet } from './config';
import { worldProtocolAbi as abi } from './abi';
import type { ModuleId, WorldGateway, WorldModule } from '../types/world';
export type InjectedProvider = EIP1193Provider & { on?: (event: string, handler: (...args: any[]) => void) => void; removeListener?: (event: string, handler: (...args: any[]) => void) => void };
declare global { interface Window { ethereum?: InjectedProvider } }
export const publicClient = createPublicClient({ chain: monadTestnet, transport: http() });
export function getWallet() {
  if (!window.ethereum) throw new Error('未发现钱包，请在安装 MetaMask 的浏览器中打开。');
  return createWalletClient({ chain: monadTestnet, transport: custom(window.ethereum) });
}
export async function switchToMonad() {
  const wallet = getWallet();
  try { await wallet.switchChain({ id: monadTestnet.id }); }
  catch (error) {
    const e = error as { code?: number; cause?: { code?: number } };
    if (e.code !== 4902 && e.cause?.code !== 4902) throw error;
    await wallet.addChain({ chain: monadTestnet }); await wallet.switchChain({ id: monadTestnet.id });
  }
}
export function createTestnetGateway(): WorldGateway {
  const address = () => { if (!contractAddress) throw new Error('尚未配置合约地址'); return contractAddress; };
  async function module(id: ModuleId): Promise<WorldModule> {
    const [name, creator, priceWei, active] = await publicClient.readContract({ address: address(), abi, functionName: 'modules', args: [BigInt(id)] });
    return { id, name, creator, priceWei, active };
  }
  async function send(account: Address, functionName: 'mintPassport' | 'buyModule' | 'withdraw', onHash: (hash: Hash) => void, id?: ModuleId) {
    const wallet = getWallet();
    if (await wallet.getChainId() !== monadTestnet.id) throw new Error('请先切换至 Monad Testnet');
    const [current] = await wallet.getAddresses();
    if (current?.toLowerCase() !== account.toLowerCase()) throw new Error('钱包账户已变化，请重新连接');
    const base = { address: address(), abi, account };
    let hash: Hash;
    if (functionName === 'buyModule') {
      const simulation = await publicClient.simulateContract({ ...base, functionName, args: [BigInt(id!)], value: (await module(id!)).priceWei });
      hash = await wallet.writeContract(simulation.request);
    } else {
      const simulation = await publicClient.simulateContract({ ...base, functionName });
      hash = await wallet.writeContract(simulation.request);
    }
    onHash(hash);
    let cancelled = false;
    const receipt = await publicClient.waitForTransactionReceipt({ hash, timeout: 120_000, onReplaced: ({ transaction, reason }) => { cancelled = reason !== 'repriced'; onHash(transaction.hash); } });
    if (cancelled) throw new Error('原交易已被取消或替换，请刷新状态后核验');
    if (receipt.status !== 'success') throw new Error('交易已回滚，请检查合约状态');
  }
  return {
    async read(account) {
      const base = { address: address(), abi };
      const [balance, access, forest, forge, treasury, ownPending] = await Promise.all([
        publicClient.readContract({ ...base, functionName: 'balanceOf', args: [account] }),
        publicClient.readContract({ ...base, functionName: 'hasAccess', args: [account, 2n] }), module(1), module(2),
        publicClient.readContract({ ...base, functionName: 'treasury' }),
        publicClient.readContract({ ...base, functionName: 'pendingWithdrawals', args: [account] }),
      ]);
      const [creatorPending, treasuryPending] = await Promise.all([forge.creator, treasury].map(payee => publicClient.readContract({ ...base, functionName: 'pendingWithdrawals', args: [payee] })));
      return { hasPassport: balance > 0n, hasForgeAccess: access, modules: [forest, forge], treasury, creatorPending, treasuryPending, ownPending };
    },
    mint: (account, onHash) => send(account, 'mintPassport', onHash),
    buy: (account, id, onHash) => send(account, 'buyModule', onHash, id),
    withdraw: (account, onHash) => send(account, 'withdraw', onHash),
  };
}
