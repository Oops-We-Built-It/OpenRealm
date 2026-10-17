import { describe, expect, it, vi } from 'vitest';
import { parseEther } from 'viem';
import { createMockGateway, MOCK_PLAYER, MOCK_CREATOR, MOCK_TREASURY, splitRevenue } from './mock';
describe('Mock 协议彩排', () => {
  it('无证不能买；持证可买，分账守恒；不能重复买；只能提取自己余额', async () => {
    const world = createMockGateway(); const onHash = vi.fn();
    await expect(world.buy(MOCK_PLAYER, 2, onHash)).rejects.toThrow('Passport');
    await world.mint(MOCK_PLAYER, onHash);
    expect((await world.read(MOCK_PLAYER)).hasPassport).toBe(true);
    await world.buy(MOCK_PLAYER, 2, onHash);
    const state = await world.read(MOCK_PLAYER);
    expect(state.hasForgeAccess).toBe(true);
    expect(state.creatorPending).toBe(parseEther('0.0008'));
    expect(state.treasuryPending).toBe(parseEther('0.0002'));
    expect(state.ownPending).toBe(0n);
    await expect(world.buy(MOCK_PLAYER, 2, onHash)).rejects.toThrow('已经解锁');
    await expect(world.withdraw(MOCK_PLAYER, onHash)).rejects.toThrow('没有待提取');
    await world.withdraw(MOCK_CREATOR, onHash);
    expect((await world.read(MOCK_CREATOR)).ownPending).toBe(0n);
    expect((await world.read(MOCK_TREASURY)).ownPending).toBe(parseEther('0.0002'));
    expect(onHash).not.toHaveBeenCalled();
  });
  it('不同账户隔离身份、权限，wei 舍入不丢失', async () => {
    const world = createMockGateway(); await world.mint(MOCK_PLAYER, vi.fn());
    expect((await world.read(MOCK_CREATOR)).hasPassport).toBe(false);
    expect((await world.read(MOCK_CREATOR)).hasForgeAccess).toBe(false);
    expect(splitRevenue(7n)).toEqual({ creator: 5n, treasury: 2n });
  });
});
