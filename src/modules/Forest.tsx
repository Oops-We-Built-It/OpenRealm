import { useEffect, useState } from 'react'
import type { ModuleProps } from '../types/world'
import './forest.css'

type PlotState = 'empty' | 'planted' | 'watered' | 'ready' | 'harvested'
type FarmProps = ModuleProps & {
  onHarvestStarfruit?: () => void
  hasStarfruit?: boolean
}

const GROW_MS = 14_000

export default function ForestModule({ walletAddress, hasPassport, unlocked, onHarvestStarfruit, hasStarfruit = false }: FarmProps) {
  const [plots, setPlots] = useState<PlotState[]>(['empty', 'empty', 'empty'])
  const [selected, setSelected] = useState(0)
  const [growUntil, setGrowUntil] = useState<number[]>([0, 0, 0])
  const [clock, setClock] = useState(Date.now())
  const [harvests, setHarvests] = useState(0)
  const [toast, setToast] = useState('The grove is quiet. Choose a patch of earth to begin.')
  const [soundOn, setSoundOn] = useState(false)

  useEffect(() => {
    if (!growUntil.some((end) => end > 0)) return
    const timer = window.setInterval(() => setClock(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [growUntil])

  useEffect(() => {
    const ready = growUntil.map((end, index) => end > 0 && end <= clock && plots[index] === 'watered')
    if (!ready.some(Boolean)) return
    setPlots((items) => items.map((state, index) => ready[index] ? 'ready' : state))
    setGrowUntil((ends) => ends.map((end, index) => ready[index] ? 0 : end))
    setToast('A Starlight Fruit is glowing and ready to harvest!')
  }, [clock, growUntil, plots])

  if (!walletAddress) return <FarmGate title="A passport to Aetheria" text="Connect your wallet in the OpenRealm host to enter this shared world." />
  if (!hasPassport) return <FarmGate title="The grove knows its keepers" text="Claim your World Passport in the host app to visit Pixel Farm." />
  if (!unlocked) return <FarmGate title="Farm access is not active" text="The host app has not granted access to this module yet." />

  const current = plots[selected]
  const act = () => {
    if (current === 'empty' || current === 'harvested') {
      setPlots((items) => items.map((state, index) => index === selected ? 'planted' : state))
      setToast('Moonseed planted. Give it a little water.')
      if (soundOn) playFarmChime(460)
    } else if (current === 'planted') {
      setPlots((items) => items.map((state, index) => index === selected ? 'watered' : state))
      setGrowUntil((ends) => ends.map((end, index) => index === selected ? Date.now() + GROW_MS : end))
      setToast('Watered with dew. The little sprout is waking up…')
      if (soundOn) playFarmChime(560)
    } else if (current === 'watered') {
      setToast('The sprout is growing. Almost there!')
    } else {
      setPlots((items) => items.map((state, index) => index === selected ? 'harvested' : state))
      setHarvests((count) => count + 1)
      onHarvestStarfruit?.()
      if (soundOn) playFarmChime(840)
      setToast('✦ Starlight Fruit gathered! A little starlight travels with you.')
    }
  }

  const secondsLeft = Math.max(0, Math.ceil(((growUntil[selected] || clock + GROW_MS) - clock) / 1000))
  const actionLabel = current === 'empty' || current === 'harvested' ? 'Plant moonseed' : current === 'planted' ? 'Water the sprout' : current === 'watered' ? `Growing · ${secondsLeft}s` : 'Harvest Starlight Fruit'

  return (
    <section className="pf-game" aria-label="Pixel Farm game">
      <header className="pf-topbar">
        <div className="pf-brand"><span className="pf-brand-mark">✦</span><div><strong>PIXEL FARM</strong><small>AETHERIA · THE LUMEN GROVE</small></div></div>
        <div className="pf-top-meta"><span className="pf-passport"><i /> Passport bearer</span><button className={`pf-sound ${soundOn ? 'is-on' : ''}`} onClick={() => setSoundOn(!soundOn)} aria-pressed={soundOn}>♫ {soundOn ? 'Sound on' : 'Sound off'}</button></div>
      </header>
      <span className="pf-sr-only" role="status">共享 Passport 已识别，森林入口已开放。</span>

      <div className="pf-scene">
        <div className="pf-sky-glow" />
        <div className="pf-sun">✦</div>
        <div className="pf-hill pf-hill-back" /><div className="pf-hill pf-hill-front" />
        <div className="pf-tree pf-tree-one"><b /><i /><em /></div><div className="pf-tree pf-tree-two"><b /><i /><em /></div>
        <div className="pf-cabin"><span>⌂</span><i /></div>
        <div className="pf-scene-title"><span>DAY 01 · EARLY SPRING</span><h2>A quiet morning<br />in the Lumen Grove</h2></div>
        <div className="pf-farmer" aria-label="Aetheria farmer"><div className="pf-hair"/><div className="pf-face">▪</div><div className="pf-body"/><div className="pf-arm"/><div className="pf-leg left"/><div className="pf-leg right"/><span className="pf-farmer-spark">✧</span></div>
        <div className="pf-butterfly">✧</div>
        <div className="pf-field-label">YOUR LITTLE PATCH <span>✦</span></div>
        <div className="pf-plots">
          {plots.map((state, index) => <button key={index} onClick={() => setSelected(index)} className={`pf-plot ${state} ${selected === index ? 'selected' : ''}`} aria-label={`Plot ${index + 1}: ${state}`} aria-pressed={selected === index}>
            <span className="pf-soil" />
            {state === 'planted' && <span className="pf-sprout"><i /><b /></span>}
            {state === 'watered' && <span className="pf-plant growing"><i /><b /><em /><small>✦</small></span>}
            {state === 'ready' && <span className="pf-plant ripe"><i /><b /><em /><small>✦</small><strong>●</strong></span>}
            {state === 'harvested' && <span className="pf-harvested">✓</span>}
            <span className="pf-plot-number">0{index + 1}</span>
          </button>)}
        </div>
        <div className="pf-meadow-flowers">✿　✧　✿</div>
      </div>

      <div className="pf-control-panel">
        <div className="pf-state-copy" role="status" aria-live="polite"><span className="pf-eyebrow">GROVE JOURNAL</span><strong>{toast}</strong><small>{hasStarfruit ? 'Your pack has a Starlight Fruit · Mock / Demo Data' : harvests ? `${harvests} Starlight Fruit gathered · local demo` : 'Moonseed grows in about 14 seconds after watering.'}</small></div>
        <div className="pf-action-group"><span className="pf-selection">PATCH 0{selected + 1} <b>·</b> {current.toUpperCase()}</span><button className="pf-action" onClick={act} disabled={current === 'watered'}>{actionLabel}<span>→</span></button></div>
      </div>
      <div className="pf-credit">ORIGINAL PIXEL WORLD <span>•</span> AETHERIA</div>
    </section>
  )
}

function FarmGate({ title, text }: { title: string; text: string }) {
  return <section className="pf-game pf-gate"><div className="pf-gate-card"><span>✦</span><small>PIXEL FARM · AETHERIA</small><h2>{title}</h2><p>{text}</p><div>◈ &nbsp; Awaiting OpenRealm access</div></div></section>
}

function playFarmChime(frequency: number) {
  const context = new AudioContext()
  const oscillator = context.createOscillator()
  const volume = context.createGain()
  oscillator.type = 'sine'
  oscillator.frequency.value = frequency
  volume.gain.setValueAtTime(0.0001, context.currentTime)
  volume.gain.exponentialRampToValueAtTime(0.08, context.currentTime + 0.015)
  volume.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.22)
  oscillator.connect(volume)
  volume.connect(context.destination)
  oscillator.start()
  oscillator.stop(context.currentTime + 0.23)
  window.setTimeout(() => void context.close(), 350)
}
