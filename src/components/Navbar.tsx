import { ArrowUpRight, Orbit, Wallet } from 'lucide-react';
import type { WorldController } from '../hooks/useWorld';
import { isMock } from '../chain/config';
export const shortAddress = (address: string) => `${address.slice(0, 6)}…${address.slice(-4)}`;
export function Navbar({ world }: { world: WorldController }) {
  return <header className="navbar"><a href="#home" className="brand"><Orbit size={29}/> OpenRealm<span className="beta">ALPHA</span></a>
    <nav aria-label="主导航"><a href="#world">探索世界</a><a href="#protocol">共创协议 <ArrowUpRight size={13}/></a></nav>
    <div className="nav-actions"><span className="network"><i/>{isMock ? 'Mock 演示' : 'Monad Testnet'}</span><button className="wallet-button" disabled={world.walletBusy} onClick={world.address ? world.disconnect : world.connect}><Wallet size={16}/>{world.walletBusy ? '连接中…' : world.address ? `${shortAddress(world.address)} · 断开` : isMock ? '连接演示账户' : '连接钱包'}</button></div>
  </header>;
}
