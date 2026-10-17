import { parseEther, type Address } from 'viem';
import type { WorldGateway, WorldState } from '../types/world';
export const MOCK_PLAYER: Address = '0x1111111111111111111111111111111111111111';
export const MOCK_CREATOR: Address = '0x2222222222222222222222222222222222222222';
export const MOCK_TREASURY: Address = '0x3333333333333333333333333333333333333333';
export const splitRevenue = (value: bigint) => { const creator = value * 80n / 100n; return { creator, treasury: value - creator }; };
/** Session memory only. No fake hashes, persistence or real wallet requests. */
export function createMockGateway(): WorldGateway {
  const passports = new Set<string>(); const access = new Set<string>();
  const pending = new Map<string, bigint>();
  const key = (address: Address) => address.toLowerCase();
  const credit = (address: Address, amount: bigint) => pending.set(key(address), (pending.get(key(address)) || 0n) + amount);
  const pause = () => new Promise<void>(resolve => setTimeout(resolve, 350));
  return {
    async read(address) {
      const state: WorldState = {
        hasPassport: passports.has(key(address)), hasForgeAccess: access.has(key(address)),
        modules: [ { id: 1, name: 'Mystic Forest', creator: MOCK_PLAYER, priceWei: 0n, active: true }, { id: 2, name: 'Arcane Forge', creator: MOCK_CREATOR, priceWei: parseEther('0.001'), active: true } ],
        treasury: MOCK_TREASURY, creatorPending: pending.get(key(MOCK_CREATOR)) || 0n,
        treasuryPending: pending.get(key(MOCK_TREASURY)) || 0n, ownPending: pending.get(key(address)) || 0n,
      }; return state;
    },
    async mint(address) { await pause(); if (passports.has(key(address))) throw new Error('已持有 Passport'); passports.add(key(address)); },
    async buy(address, id) {
      await pause(); if (!passports.has(key(address))) throw new Error('请先领取 Passport');
      if (id !== 2) throw new Error('森林免费，无需购买');
      if (access.has(key(address))) throw new Error('已经解锁该模块');
      const split = splitRevenue(parseEther('0.001')); credit(MOCK_CREATOR, split.creator); credit(MOCK_TREASURY, split.treasury); access.add(key(address));
    },
    async withdraw(address) { await pause(); if (!pending.get(key(address))) throw new Error('当前账户没有待提取收益'); pending.set(key(address), 0n); },
  };
}
