<<<<<<< HEAD
# OpenRealm

One World. Many Creators. Shared Ownership.

围绕 Aetheria 的开放共创协议 MVP。此仓库完成整体工程架构及成员 A 的产品与前端接入层。

## 立即运行

Node.js >=22.12，推荐 Node 24。

```sh
npm ci
npm run dev
```

打开终端显示的本地地址（默认 http://127.0.0.1:5173）。默认 Mock，无需钱包与测试币。
点击「连接演示账户」→「领取 World Passport」→ 探索 Forest → 返回世界 → 打开 Forge →「购买并解锁」→ 返回查看 80/20 模拟记账。
顶部「重置演示」或刷新浏览器重新开始。

```sh
npm test
npm run build
npm run preview
```

## 目录

```text
contracts/          B 的合约区；目前只有接口约定
scripts/            B 的部署脚本区
deployments/        B 的地址、链 ID、交易证据清单（目前为空）
src/
  App.tsx           A 的路由、全局反馈与产品页
  components/       导航、Passport、Dashboard、原创 CSS 场景插画
  hooks/useWorld.ts  钱包、交易、刷新及并发状态管理
  chain/            ABI、网络配置、viem 适配器、Mock 适配器
  types/world.ts    A/B/C 统一类型
  modules/          C 的 Forest/Forge 接入点（目前为显式占位）
docs/               Pitch、演示流程、部署及验收
TEAM_SPEC.md        团队协议和协作边界
```

## 接入 B 的真实合约

1. B 先阅读 TEAM_SPEC.md，保证 ABI getters 和返回顺序一致。
2. B 填写部署清单，交付 ABI 及测试网交易证据。
3. 复制 `.env.example` 为 `.env.local`，设置 `VITE_APP_MODE=testnet`，填写 `VITE_WORLD_PROTOCOL_ADDRESS=0x…`（或使用清单地址）。
4. 重启 Vite。用 MetaMask 连接并切换 Monad Testnet，领取测试 MON 后测试。

缺失/错误地址、RPC 或合约错误会显示错误，绝不自动伪装成 Mock 成功。价格来自合约。待提取收益是按 payee 累计值，提现操作只能提现当前连接账户。
VITE_ 环境变量公开打包到浏览器，不要放密钥。仅测试网，不使用主网真实资金。

## 接入 C 的场景

替换 Forest.tsx / Forge.tsx，保留默认导出和 ModuleProps。不得再建钱包、导航或合约层。详见 TEAM_SPEC.md。
当前 CSS 风景用于产品演示与占位；不等于已交付游戏。

## 发布与演示

参见 [部署步骤](docs/DEPLOYMENT.md)、[演示脚本](docs/DEMO.md)、[Pitch](docs/PITCH.md)、[验收记录](docs/ACCEPTANCE.md)。
Vercel 构建配置已提供，尚未发布公网、录制视频或执行真实链上交易。没有提供 B 的地址、C 的成品模块及部署账户，不能把这些交付项标为完成。

网络配置参考 [Monad 官方文档](https://docs.monad.xyz/developer-essentials/network-information)、钱包适配参考 [viem Wallet Client](https://viem.sh/docs/clients/wallet)。
=======
# OpenRealm
>>>>>>> origin/main
