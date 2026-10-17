# Game module integration notes

The team repository already defines `ModuleProps` in `src/types/world.ts`. `ForestModule` and `ForgeModule` import that type directly and keep the agreed `src/modules/Forest.tsx` and `src/modules/Forge.tsx` default exports. Their styles are isolated in `forest.css` and `forge.css`; neither module connects a wallet, reads a contract, or starts a transaction.

## Host usage

`src/App.tsx` already imports the default exports as `Forest` and `Forge`, then passes the agreed props. Its access values come from `useWorld`; keep that host wiring:

```tsx
import Forest from './modules/Forest'
import Forge from './modules/Forge'

const props = { walletAddress: world.address, hasPassport: !!world.state?.hasPassport }
<Forest {...props} unlocked={props.hasPassport && !!world.state?.modules[0]?.active} />
<Forge
  {...props}
  unlocked={props.hasPassport && !!world.state?.hasForgeAccess && !!world.state?.modules[1]?.active}
  onBuy={!busy && world.state?.modules[1]?.active ? world.buy : undefined}
/>
```

The required shared props are defined by the team in `src/types/world.ts`:

```ts
type ModuleProps = {
  walletAddress: `0x${string}` | null
  hasPassport: boolean
  unlocked: boolean
  onBuy?: () => Promise<void>
}
```

Optional gameplay props: Farm accepts `onHarvestStarfruit?: () => void` and `hasStarfruit?: boolean`; Arena accepts `hasStarfruit?: boolean`. The optional fruit fields exist only to demonstrate the requested module-to-module interaction in the standalone preview. The current team protocol shares World Passport only; do not treat this fruit state as a shared chain asset or wire it into protocol state.

## Access and purchase

Both screens display distinct guidance for disconnected wallet, missing Passport, and unavailable module access. Farm is free but requires the host to pass a valid wallet, Passport, and `unlocked=true`. Arena calls the supplied `onBuy` handler only when the host provides one. A resolved promise does not change Arena access: the module enters combat only after the host rerenders it with `unlocked=true`. A rejected promise is shown with a retry path. If no handler is provided, purchase is disabled. The host remains responsible for checking module activity and transaction receipt status.

## Gameplay demo state

Farm offers three plots. Select a plot, plant a Moonseed, water it, wait about 14 seconds, then harvest the Starlight Fruit. Harvest invokes the optional callback. Arena's normal attack deals 10 damage, or 15 when `hasStarfruit` is true; Runeburst deals 20. This gain is labelled Mock / Demo Data and is not stored in the wallet, contract, or protocol.

The standalone preview is available at `/preview.html` while Vite is running. It has tabs for both games and local controls for wallet, Passport, Arena access, and the demo fruit. Its mock wallet is fixed demo data; no wallet connection, transaction, or chain request is made. The normal app at `/` is unchanged.

## Production handoff

Use the host's `useWorld` values for `walletAddress`, `hasPassport`, and `unlocked`. For Arena, derive `unlocked` from the verified permission state supplied by the host after the transaction receipt; never infer access inside this component from a successful `onBuy` promise. The host app currently owns chain configuration, module purchase and receipts. The current protocol documents Passport as the sole shared chain asset. If the team later adds an inventory contract, the host can query it and decide whether to continue passing the optional demo field or define a separately agreed production type.
