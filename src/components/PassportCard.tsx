import { Fingerprint, ArrowUpRight, Check } from 'lucide-react';
import type { WorldController } from '../hooks/useWorld';
import { shortAddress } from './Navbar';
import { isMock } from '../chain/config';
export function PassportCard({ world }: { world: WorldController }) {
  const owned = world.state?.hasPassport;
  return <section className="passport-panel"><div className="section-kicker">YOUR SHARED IDENTITY</div><h2>一个身份，探索整个世界。</h2><p>你的 World Passport，是不同创作者之间共同认可的通行证。</p>
    <div className={`passport ${owned ? 'owned' : ''}`}><div className="passport-top"><span>OPENREALM / WORLD 001</span><Fingerprint size={24}/></div><div className="passport-seal"><OrbitSeal/></div><div><span className="passport-label">AETHERIA</span><h3>World Passport</h3></div><div className="passport-bottom"><span>{world.address ? shortAddress(world.address) : '等待连接钱包'}</span><span>{isMock ? 'MOCK · ' : ''}ERC-721</span></div></div>
    <button className="primary full" disabled={!!owned || !!world.address && (!world.state || world.tx.status === 'pending')} onClick={world.address ? world.mint : world.connect}>{owned ? <><Check size={17}/> 已持有 Passport</> : <>{world.address ? '领取 World Passport' : '连接账户，开启旅程'}<ArrowUpRight size={17}/></>}</button><small>{isMock ? '模拟身份 · 不会生成真实 NFT' : '免费领取 · 需支付测试网 Gas'}</small>
  </section>;
}
function OrbitSeal() { return <svg viewBox="0 0 150 150" aria-hidden="true"><circle cx="75" cy="75" r="59"/><circle cx="75" cy="75" r="48"/><path d="M75 22 116 99H34L75 22Zm0 106L34 51h82l-41 77Z"/><circle cx="75" cy="75" r="18"/><path d="M75 0v20m0 110v20M0 75h20m110 0h20"/></svg>; }
