import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowUpRight, ArrowRight, Globe2, Layers3, GitBranch, ExternalLink } from 'lucide-react';
import { useWorld } from './hooks/useWorld';
import { isMock, explorerTx, monadTestnet } from './chain/config';
import { Navbar } from './components/Navbar';
import { WorldDashboard } from './components/WorldDashboard';
import { RealmArt } from './components/RealmArt';
import Forest from './modules/Forest';
import Forge from './modules/Forge';
const getRoute = () => window.location.hash.slice(1);
export default function App() {
  const world = useWorld(); const [route, setRoute] = useState(getRoute);
  useEffect(() => { const update = () => setRoute(getRoute()); window.addEventListener('hashchange', update); return () => window.removeEventListener('hashchange', update); }, []);
  const selected = route === 'forest' ? 1 : route === 'forge' ? 2 : null;
  const busy = world.tx.status === 'pending';
  const props = { walletAddress: world.address, hasPassport: !!world.state?.hasPassport };
  return <><Navbar world={world}/><div className={`mode-banner ${!isMock ? 'live' : ''}`}><span>{isMock ? '演示模式 · 所有身份、权限和收益均为本地模拟，不会发起链上交易。' : 'Monad Testnet · 仅使用测试 MON · 链上状态以交易回执为准'}</span>{isMock ? <button disabled={busy} onClick={world.reset}>重置演示 ↻</button> : <a href="https://faucet.monad.xyz" target="_blank" rel="noreferrer">领取测试 MON ↗</a>}</div>
    <main>{world.error && <div className="notice error" role="alert">{world.error}<button className="subtle" onClick={() => void world.refresh()}>重试读取</button></div>}
      {world.address && world.chainId !== monadTestnet.id && <div className="notice">请切换至 Monad Testnet（10143）<button className="primary" disabled={world.walletBusy} onClick={world.switchNetwork}>切换网络</button></div>}
      {world.tx.status !== 'idle' && <div className={`notice tx-${world.tx.status}`} role="status" aria-live="polite"><span>{busy && <span className="loading-dot"/>}{world.tx.label}</span>{world.tx.hash && <a target="_blank" rel="noreferrer" href={explorerTx(world.tx.hash)}>查看交易 <ExternalLink size={14}/></a>}</div>}
      {selected ? <div className="game-page"><a className="back-link" href="#world"><ArrowLeft size={16}/> 返回世界</a><div className="game-toolbar"><span>AETHERIA / MODULE 00{selected}</span><span>{props.hasPassport ? 'Passport 已识别' : '等待 Passport'} · {isMock ? '模拟状态' : '链上状态'}</span></div>{selected === 1 ? <Forest {...props} unlocked={props.hasPassport && !!world.state?.modules[0]?.active}/> : <Forge {...props} unlocked={props.hasPassport && !!world.state?.hasForgeAccess && !!world.state?.modules[1]?.active} onBuy={!busy && world.state?.modules[1]?.active ? world.buy : undefined}/>}</div> : <><section className="hero" id="home"><div className="hero-copy"><div className="eyebrow"><span/> A WORLD BUILT TOGETHER</div><h1>一个世界。<br/>无限<span>共创。</span></h1><p>One World. Many Creators. Shared Ownership.</p><p className="hero-description">让独立创作者共建游戏世界，让玩家身份自由同行，<br className="desktop-break"/>让每一份贡献，拥有透明的回报。</p><div className="hero-actions"><a className="primary" href="#world">进入 Aetheria <ArrowUpRight size={18}/></a><a className="text-link" href="#protocol">了解共创协议 <ArrowRight size={16}/></a></div><div className="hero-meta"><span>01 <small>共享世界</small></span><span>02 <small>独立模块</small></span><span>80/20 <small>合作分账</small></span></div></div><div className="hero-visual"><RealmArt hero/><div className="world-coordinates">REALM 001 <span>35° N · 128° E / FICTIONAL</span></div><div className="world-caption"><span>THE FIRST SHARED WORLD</span><h2>Aetheria</h2><span className="pill">FANTASY · OPEN CREATION</span></div></div></section>
      <div className="principles" id="protocol"><div><Globe2/><span><strong>Shared World</strong><small>独立创作，共建世界</small></span></div><div><Layers3/><span><strong>Shared Assets</strong><small>一份 Passport，多个模块</small></span></div><div><GitBranch/><span><strong>Shared Revenue</strong><small>公开规则，自动分账</small></span></div><span className="powered">BUILT ON <strong>◈ Monad</strong></span></div><WorldDashboard world={world} onEnter={id => { window.location.hash = id === 1 ? 'forest' : 'forge'; window.scrollTo(0, 0); }}/></>}
    </main><footer><a className="brand" href="#home">◎ OpenRealm</a><span>共同创造，而不止于共同游玩。</span><span>Hackathon MVP · {isMock ? 'Mock Preview' : 'Monad Testnet'}</span></footer></>;
}
