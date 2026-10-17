import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MOCK_PLAYER } from './mock';
const fakes = vi.hoisted(() => ({
  rpc: { readContract: vi.fn(), simulateContract: vi.fn(), waitForTransactionReceipt: vi.fn() },
  wallet: { getChainId: vi.fn(), getAddresses: vi.fn(), writeContract: vi.fn(), switchChain: vi.fn(), addChain: vi.fn() },
}));
vi.mock('viem', async importOriginal => ({ ...await importOriginal<typeof import('viem')>(), createPublicClient: () => fakes.rpc, createWalletClient: () => fakes.wallet }));
vi.mock('./config', () => ({ contractAddress: '0x4444444444444444444444444444444444444444', monadTestnet: { id: 10143 } }));
import { createTestnetGateway, switchToMonad } from './client';
const hash = `0x${'a'.repeat(64)}` as `0x${string}`;
beforeEach(() => {
  vi.resetAllMocks();
  window.ethereum = { request: vi.fn(), on: vi.fn(), removeListener: vi.fn() };
  fakes.wallet.getChainId.mockResolvedValue(10143); fakes.wallet.getAddresses.mockResolvedValue([MOCK_PLAYER]);
  fakes.rpc.readContract.mockResolvedValue(['Forge', MOCK_PLAYER, 123456789123456789n, true]);
  fakes.rpc.simulateContract.mockResolvedValue({ request: { functionName: 'buyModule' } });
  fakes.wallet.writeContract.mockResolvedValue(hash); fakes.rpc.waitForTransactionReceipt.mockResolvedValue({ status: 'success' });
});
describe('真实交易适配器（RPC / 钱包隔离测试）', () => {
  it('使用链上 bigint 价格、预执行并等待回执', async () => {
    const onHash = vi.fn(); await createTestnetGateway().buy(MOCK_PLAYER, 2, onHash);
    expect(fakes.rpc.simulateContract).toHaveBeenCalledWith(expect.objectContaining({ value: 123456789123456789n, args: [2n] }));
    expect(onHash).toHaveBeenCalledWith(hash);
    expect(fakes.rpc.waitForTransactionReceipt).toHaveBeenCalledWith(expect.objectContaining({ hash }));
  });
  it('错误链或账户变化时不发送交易', async () => {
    fakes.wallet.getChainId.mockResolvedValue(1);
    await expect(createTestnetGateway().mint(MOCK_PLAYER, vi.fn())).rejects.toThrow('Monad Testnet');
    fakes.wallet.getChainId.mockResolvedValue(10143); fakes.wallet.getAddresses.mockResolvedValue([]);
    await expect(createTestnetGateway().mint(MOCK_PLAYER, vi.fn())).rejects.toThrow('账户已变化');
    expect(fakes.wallet.writeContract).not.toHaveBeenCalled();
  });
  it('拒签和回滚不返回成功', async () => {
    fakes.wallet.writeContract.mockRejectedValueOnce(new Error('User rejected'));
    await expect(createTestnetGateway().mint(MOCK_PLAYER, vi.fn())).rejects.toThrow('User rejected');
    expect(fakes.rpc.waitForTransactionReceipt).not.toHaveBeenCalled();
    fakes.rpc.waitForTransactionReceipt.mockResolvedValue({ status: 'reverted' });
    await expect(createTestnetGateway().mint(MOCK_PLAYER, vi.fn())).rejects.toThrow('回滚');
  });
  it('取消交易不误报原购买成功，并保留替代交易 hash', async () => {
    const onHash = vi.fn();
    fakes.rpc.waitForTransactionReceipt.mockImplementation(async ({ onReplaced }) => { onReplaced({ reason: 'cancelled', transaction: { hash } }); return { status: 'success' }; });
    await expect(createTestnetGateway().buy(MOCK_PLAYER, 2, onHash)).rejects.toThrow('取消或替换');
    expect(onHash).toHaveBeenCalledWith(hash);
  });
  it('未知网络先添加后切换；拒绝切链不请求添加', async () => {
    fakes.wallet.switchChain.mockRejectedValueOnce({ code: 4902 }).mockResolvedValue(undefined);
    await switchToMonad(); expect(fakes.wallet.addChain).toHaveBeenCalledTimes(1);
    fakes.wallet.switchChain.mockRejectedValueOnce({ code: 4001 });
    await expect(switchToMonad()).rejects.toEqual({ code: 4001 }); expect(fakes.wallet.addChain).toHaveBeenCalledTimes(1);
  });
});
