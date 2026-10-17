import type { ModuleProps } from '../types/world';
import { RealmArt } from '../components/RealmArt';
export default function ForgeModule({ walletAddress, hasPassport, unlocked, onBuy }: ModuleProps) {
  return <section className="module-stage"><RealmArt forge/><div className="stage-copy"><span className="pill">成员 C · 场景接入占位</span><h2>Arcane Forge</h2><p>{!walletAddress ? '请使用页面顶部连接账户。' : !hasPassport ? '需要与森林相同的 World Passport。' : unlocked ? '共享身份与购买权限已确认，工坊入口已开放。' : '已有 Passport，购买模块后开放工坊入口。'}</p><code>{walletAddress || '尚未连接'}</code>{hasPassport && !unlocked && <button className="primary" disabled={!onBuy} onClick={() => void onBuy?.()}>购买并解锁</button>}<p className="muted">此处等待 C 接入工坊游戏；装备互通不属于当前 MVP。</p></div></section>;
}
