import { useState } from 'react'
import ForestModule from '../modules/Forest'
import ForgeModule from '../modules/Forge'

const DEMO_WALLET = '0x1111111111111111111111111111111111111111' as `0x${string}`

export default function CPreview() {
  const [game, setGame] = useState<'farm' | 'arena'>('farm')
  const [walletConnected, setWalletConnected] = useState(true)
  const [hasPassport, setHasPassport] = useState(true)
  const [arenaUnlocked, setArenaUnlocked] = useState(false)
  const [hasStarfruit, setHasStarfruit] = useState(false)
  const [purchasePending, setPurchasePending] = useState(false)

  const onBuy = async () => {
    setPurchasePending(true)
    await new Promise((resolve) => window.setTimeout(resolve, 650))
    setArenaUnlocked(true)
    setPurchasePending(false)
  }

  return (
    <main className="preview-shell">
      <header className="preview-header">
        <a className="preview-logo" href="#top"><span>O</span> OPENREALM</a>
        <div className="preview-world"><i /> AETHERIA <span>WORLD PREVIEW</span></div>
        <div className="preview-wallet"><span className="preview-wallet-dot" />{walletConnected ? '0x1111…1111' : 'Wallet disconnected'}<button onClick={() => setWalletConnected(!walletConnected)}>{walletConnected ? 'Disconnect demo' : 'Connect demo'}</button></div>
      </header>

      <div className="preview-intro" id="top">
        <div><div className="preview-kicker">ONE WORLD · MANY CREATORS · SHARED OWNERSHIP</div><h1>Choose your path<br/><em>through Aetheria.</em></h1></div>
        <p>Two small worlds, one shared identity.<br/>A local preview of community-built adventures.</p>
      </div>

      <nav className="preview-tabs" aria-label="Game modules">
        <button className={game === 'farm' ? 'active' : ''} onClick={() => setGame('farm')}><span>01</span> Pixel Farm <small>THE LUMEN GROVE</small></button>
        <button className={game === 'arena' ? 'active' : ''} onClick={() => setGame('arena')}><span>02</span> Pixel Arena <small>EMBERFALL RUINS</small>{!arenaUnlocked && <i className="preview-tab-lock">LOCKED</i>}</button>
        <div className="preview-module-credit">INDEPENDENT CREATOR MODULES <span>✦</span></div>
      </nav>

      <div className="preview-layout">
        <div className="preview-game-column">
          {game === 'farm'
            ? <ForestModule walletAddress={walletConnected ? DEMO_WALLET : null} hasPassport={hasPassport} unlocked={hasPassport} hasStarfruit={hasStarfruit} onHarvestStarfruit={() => setHasStarfruit(true)} />
            : <ForgeModule walletAddress={walletConnected ? DEMO_WALLET : null} hasPassport={hasPassport} unlocked={arenaUnlocked} hasStarfruit={hasStarfruit} onBuy={onBuy} />}
          <div className="preview-under-note"><span>✦</span> Preview build · all identity, access and item states are local Mock / Demo Data.</div>
        </div>

        <aside className="preview-dev-panel">
          <div className="preview-panel-head"><div><span>CREATOR TOOLKIT</span><h2>Preview controls</h2></div><button title="Reset demo state" onClick={() => { setWalletConnected(true); setHasPassport(true); setArenaUnlocked(false); setHasStarfruit(false); }}>↻</button></div>
          <div className="preview-status-card"><div className="preview-avatar">✧</div><div><strong>Wayfarer</strong><small>{walletConnected ? 'DEMO WALLET CONNECTED' : 'NO WALLET'}</small></div><span className={walletConnected ? 'status-on' : ''}>{walletConnected ? '●' : '○'}</span></div>
          <div className="preview-control"><div><strong>World Passport</strong><small>{hasPassport ? 'Aetheria identity verified' : 'No passport held'}</small></div><button className={hasPassport ? 'toggle on' : 'toggle'} aria-pressed={hasPassport} onClick={() => setHasPassport(!hasPassport)}><i/></button></div>
          <div className="preview-control"><div><strong>Arena access</strong><small>{purchasePending ? 'Simulated purchase pending…' : arenaUnlocked ? 'Creator module unlocked' : 'Purchase required'}</small></div><button className={arenaUnlocked ? 'toggle on' : 'toggle'} aria-pressed={arenaUnlocked} onClick={() => setArenaUnlocked(!arenaUnlocked)}><i/></button></div>
          <div className="preview-control"><div><strong>Starlight Fruit</strong><small>{hasStarfruit ? 'Harvested · arena buff active' : 'Not yet harvested'}</small></div><button className={hasStarfruit ? 'toggle on' : 'toggle'} aria-pressed={hasStarfruit} onClick={() => setHasStarfruit(!hasStarfruit)}><i/></button></div>
          <div className="preview-panel-tip"><span>✦</span><p>Harvest fruit in the Farm, then enter Arena to see its <b>+5 basic attack</b> effect. Or toggle states here to explore access screens.</p></div>
          <div className="preview-wallet-note">LOCAL PREVIEW ONLY<br/><code>0x1111…1111</code><br/>No wallet or chain calls are made.</div>
        </aside>
      </div>

      <footer className="preview-footer"><span>OPENREALM · AETHERIA</span><span>ORIGINAL GAME MODULE DEMO <i>✦</i> SHARED STATE MOCK</span></footer>
    </main>
  )
}
