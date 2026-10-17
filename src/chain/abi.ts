import { parseAbi } from 'viem';
// Interface proposal v1. B owns this file after handoff; keep getters in TEAM_SPEC in sync.
export const worldProtocolAbi = parseAbi([
  'function mintPassport()',
  'function balanceOf(address owner) view returns (uint256)',
  'function registerModule(uint256 moduleId, string name, address creator, uint256 priceWei)',
  'function modules(uint256 moduleId) view returns (string name, address creator, uint256 priceWei, bool active)',
  'function treasury() view returns (address)',
  'function hasAccess(address player, uint256 moduleId) view returns (bool)',
  'function buyModule(uint256 moduleId) payable',
  'function pendingWithdrawals(address payee) view returns (uint256)',
  'function withdraw()',
]);
