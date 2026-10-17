import { useEffect, useState } from 'react'
import type { ModuleProps } from '../types/world'
import './forge.css'

type ArenaProps = ModuleProps & { hasStarfruit?: boolean }
const HERO_MAX = 100
const BEAST_MAX = 100

export default function ForgeModule({ walletAddress, hasPassport, unlocked, onBuy, hasStarfruit = false }: ArenaProps) {
  const [buying, setBuying] = useState(false)
  const [buyError, setBuyError] = useState('')
  const [heroHp, setHeroHp] = useState(HERO_MAX)
  const [beastHp, setBeastHp] = useState(BEAST_MAX)
  const [flash, setFlash] = useState<'hero' | 'beast' | 'both' | null>(null)
  const [message, setMessage] = useState('A Gloomfang blocks the way. Choose your move.')

  useEffect(() => {
    if (unlocked) {
      setHeroHp(HERO_MAX)
      setBeastHp(BEAST_MAX)
      setMessage('A Gloomfang blocks the way. Choose your move.')
    }
  }, [unlocked])

  const buy = async () => {
    if (!onBuy || buying) return
    setBuyError('')
    setBuying(true)
    try {
      await onBuy()
      setBuyError('Purchase submitted. Waiting for the host to confirm your access…')
    } catch (error) {
      setBuyError(error instanceof Error ? error.message : 'Purchase failed. Please try again.')
    } finally {
      setBuying(false)
    }
  }

  if (!walletAddress) return <ArenaGate title="Enter the arena" text="Connect your wallet in the OpenRealm host to prove your Aetheria identity." />
  if (!hasPassport) return <ArenaGate title="A passport is required" text="Your World Passport is your shared identity across Aetheria. Claim it in the host app first." />
  if (!unlocked) return <ArenaGate title="The Ember Arena awaits" text="Unlock this creator's module to challenge the Gloomfang." locked onBuy={buy} buying={buying} buyError={buyError} canBuy={Boolean(onBuy)} />

  const victory = beastHp <= 0
  const defeat = heroHp <= 0
  const attack = (kind: 'strike' | 'skill') => {
    if (victory || defeat) return
    const damage = kind === 'skill' ? 20 : hasStarfruit ? 15 : 10
    const nextBeast = Math.max(0, beastHp - damage)
    setBeastHp(nextBeast)
    setFlash(nextBeast > 0 ? 'both' : 'beast')
    window.setTimeout(() => setFlash(null), 280)
    if (nextBeast <= 0) {
      setMessage('The Gloomfang dissolves into embers. The path is yours!')
      return
    }
    const retaliation = 8
    const nextHero = Math.max(0, heroHp - retaliation)
    setHeroHp(nextHero)
    setMessage(kind === 'skill' ? `Runeburst deals ${damage} damage! Gloomfang claws back for ${retaliation}.` : `${hasStarfruit ? 'Starlight Fruit empowered strike' : 'Measured strike'} deals ${damage} damage. Gloomfang claws back for ${retaliation}.`)
    if (nextHero <= 0) setMessage('Your hero needs a moment to recover. Try the duel again.')
  }

  const restart = () => { setHeroHp(HERO_MAX); setBeastHp(BEAST_MAX); setMessage('A Gloomfang blocks the way. Choose your move.') }

  return (
    <section className="pa-game" aria-label="Pixel Arena game">
      <header className="pa-topbar">
        <div className="pa-brand"><span className="pa-brand-mark">⚔</span><div><strong>PIXEL ARENA</strong><small>AETHERIA · EMBERFALL RUINS</small></div></div>
        <div className="pa-top-meta"><span className="pa-passport"><i /> PASSPORT LINKED</span><span className="pa-round">SOLO DUEL <b>01</b></span></div>
      </header>
      <span className="pa-sr-only" role="status">共享身份与购买权限已确认，工坊入口已开放。</span>
      <div className={`pa-battlefield ${victory ? 'is-victory' : ''} ${defeat ? 'is-defeat' : ''}`}>
        <div className="pa-moon"/><div className="pa-ruin pa-ruin-left"><i/><b/><em/></div><div className="pa-ruin pa-ruin-right"><i/><b/><em/></div>
        <div className="pa-mountain one"/><div className="pa-mountain two"/><div className="pa-ground"/>
        <div className="pa-combatants">
          <div className={`pa-fighter hero ${flash === 'hero' || flash === 'both' ? 'hit' : ''}`}>
            <div className="pa-health" role="meter" aria-label="Wayfarer health" aria-valuemin={0} aria-valuemax={HERO_MAX} aria-valuenow={heroHp}><div className="pa-health-label"><span>WAYFARER</span><b>{heroHp}<small> / {HERO_MAX}</small></b></div><i><b style={{ width: `${heroHp}%` }}/></i></div>
            <div className="pa-hero-sprite"><div className="pa-hero-cape"/><div className="pa-hero-head"><i/><b/></div><div className="pa-hero-torso"/><div className="pa-hero-blade"/><div className="pa-hero-legs"/><span className="pa-sprite-spark">✦</span></div>
            <span className="pa-nameplate">THE WAYFARER</span>
          </div>
          <div className="pa-vs">VS</div>
          <div className={`pa-fighter beast ${flash === 'beast' || flash === 'both' ? 'hit' : ''}`}>
            <div className="pa-health enemy" role="meter" aria-label="Gloomfang health" aria-valuemin={0} aria-valuemax={BEAST_MAX} aria-valuenow={beastHp}><div className="pa-health-label"><span>GLOOMFANG</span><b>{beastHp}<small> / {BEAST_MAX}</small></b></div><i><b style={{ width: `${beastHp}%` }}/></i></div>
            <div className="pa-beast-sprite"><div className="pa-beast-horn left"/><div className="pa-beast-horn right"/><div className="pa-beast-ear left"/><div className="pa-beast-ear right"/><div className="pa-beast-body"/><div className="pa-beast-face"><i/><b/><em/></div><div className="pa-beast-claw left"/><div className="pa-beast-claw right"/><div className="pa-beast-tail"/><span>✦</span></div>
            <span className="pa-nameplate">ASHEN WARDEN</span>
          </div>
        </div>
        {(victory || defeat) && <div className="pa-result"><span>{victory ? '✦ VICTORY ✦' : 'DUEL ENDED'}</span><h2>{victory ? 'The ruins remember you.' : 'A hero rises again.'}</h2><button onClick={restart}>Fight again <b>↻</b></button></div>}
      </div>
      <div className="pa-controls">
        <div className="pa-status" role="status" aria-live="polite"><span className="pa-eyebrow">COMBAT LOG</span><strong>{message}</strong><small>{hasStarfruit ? '✦ Starlight Fruit resonance active · +5 basic attack · Mock / Demo Data' : 'No demo Starlight Fruit · basic attack deals 10'}</small></div>
        <div className="pa-action-buttons"><button className="pa-skill normal" onClick={() => attack('strike')} disabled={victory || defeat}><span className="pa-action-icon">⚔</span><span><small>BASIC · {hasStarfruit ? '15' : '10'} DMG</small><b>Strike</b></span><kbd>Q</kbd></button><button className="pa-skill magic" onClick={() => attack('skill')} disabled={victory || defeat}><span className="pa-action-icon">✧</span><span><small>ARCANE · 20 DMG</small><b>Runeburst</b></span><kbd>W</kbd></button></div>
      </div>
      <div className="pa-credit">ORIGINAL PIXEL WORLD <span>•</span> AETHERIA</div>
    </section>
  )
}

function ArenaGate({ title, text, locked = false, onBuy, buying = false, buyError = '', canBuy = false }: { title: string; text: string; locked?: boolean; onBuy?: () => void; buying?: boolean; buyError?: string; canBuy?: boolean }) {
  return <section className="pa-game pa-gate"><div className="pa-gate-scene"><div className="pa-moon"/><div className="pa-gate-ruin">⌑</div></div><div className="pa-gate-card"><span className="pa-lock-icon">{locked ? '⌑' : '✦'}</span><small>PIXEL ARENA · AETHERIA</small><h2>{title}</h2><p>{text}</p>{locked && <><div className="pa-price">✧ &nbsp; CREATOR MODULE <b>· PRICE SHOWN IN HOST</b></div><button className="pa-unlock" aria-label={canBuy ? '购买并解锁' : '购买功能尚未接入'} disabled={!canBuy || buying} onClick={onBuy}>{buying ? 'Waiting for host…' : canBuy ? '购买并解锁' : '购买功能尚未接入'} <b>→</b></button>{buyError && <div className="pa-buy-message" role="status">{buyError}</div>}{!canBuy && <div className="pa-host-note">主应用尚未接入购买功能。</div>}</>}<div className="pa-access-note">◈ &nbsp; Access is verified by the OpenRealm host</div></div></section>
}
