# OpenRealm contracts — Member B

Implements the exact TEAM_SPEC ABI using Solidity 0.8.24 and OpenZeppelin 5.4.0 ERC721, Ownable2Step and ReentrancyGuard. Compiler EVM target is Paris for conservative opcode compatibility. This is a hackathon implementation, not audited or deployed.

From the repository root:

```sh
npm ci --prefix contracts
npm run build --prefix contracts
npm test --prefix contracts
```

The contract constructor takes `(initialOwner, treasuryAddress)`. Register module 1 (Forest, free) and 2 (Forge, 1000000000000000 wei). Admin-only registration is the agreed MVP scope. Module IDs, prices, creators and treasury cannot be overwritten. `setModuleActive` can disable/re-enable a module, without blocking withdrawals. Ownership changes use a two-step acceptance.

Each wallet can mint once for free. Passports are transferable ERC721 tokens; received tokens also grant free-module access. There is no one-token-per-holder restriction. Purchases belong to the wallet, not the token. An address needs a currently held Passport for both purchase and access. Module activation and Passport ownership are checked on every access read. Free modules are accessible without purchase (a zero-value explicit purchase is also supported).

Payments must exactly match the immutable price. Creator share is floor(value*80/100); treasury receives the remainder. Balances accumulate across modules; identical creator/treasury addresses correctly receive the combined amount. No funds are pushed during purchase. `withdraw` clears balance before calling the recipient, blocks reentry, and reverts the whole operation if payment fails. There is no admin sweep. Direct transfers outside payable calls revert; forcibly sent funds are not accounted to payees.

## Monad Testnet deployment

Build and test first. Locally set `DEPLOYER_PRIVATE_KEY`, `TREASURY_ADDRESS`, `FOREST_CREATOR_ADDRESS`, `FORGE_CREATOR_ADDRESS` using your shell/secret manager. Never put a key in frontend VITE variables, chat, command arguments or Git. Optional `MONAD_RPC_URL` defaults to the public testnet RPC.

```sh
node scripts/deploy-world.mjs
```

The script refuses chains other than 10143 and refuses to overwrite a recorded deployment. It saves transaction hashes as soon as submitted. If interrupted, inspect the existing manifest and transaction receipts; do not blindly redeploy. It does not mint or buy for you, and does not mark live acceptance or source verification complete.

Deliver to A: `contracts/WorldProtocol.abi.json` (complete compiled ABI), `deployments/monad-testnet.json`, and successful mint/buy/withdraw receipt links. The existing `src/chain/abi.ts` subset remains compatible. Set `VITE_APP_MODE=testnet` and the deployed address only after actual deployment.

Verify source separately with the explorer's current Sourcify instructions, matching Solidity 0.8.24, optimizer 200, Paris target and exact OpenZeppelin sources. No claim of verification is made until the explorer confirms it. Live test should use player, creator and treasury accounts and show 0.0008 / 0.0002 MON from a 0.001 MON purchase.
