import type { ModuleProps } from '../types/world';
import { RealmArt } from '../components/RealmArt';
/** C replaces this presentation placeholder, preserving the exported props. */
export default function ForestModule({ walletAddress, hasPassport, unlocked }: ModuleProps) {
  return <section className="module-stage"><RealmArt/><div className="stage-copy"><span className="pill">成员 C · 场景接入占位</span><h2>Mystic Forest</h2><p>{!walletAddress ? '请使用页面顶部连接账户。' : !hasPassport ? '请返回世界，领取 World Passport。' : unlocked ? '共享 Passport 已识别，森林入口已开放。' : '森林入口暂不可用。'}</p><code>{walletAddress || '尚未连接'}</code><p className="muted">此处等待 C 接入森林探索游戏；当前仅验证身份传递。</p></div></section>;
}
