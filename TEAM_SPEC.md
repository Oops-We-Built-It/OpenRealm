# OpenRealm 协作协议 v1

状态：A 已建立接口基线，待 B/C 确认。修改共享接口必须同步本文、ABI、类型和测试。

## 产品边界

One World. Many Creators. Shared Ownership.

一个共享世界 Aetheria（worldId=1），两个独立模块，同一个 ERC-721 World Passport。
模块 1 Mystic Forest 免费；模块 2 Arcane Forge 默认 0.001 Testnet MON。
共享资产仅 Passport；没有跨游戏装备、背包、DAO、市场或自动 IP 授权。
管理员维护世界与模块注册；开发者控制各自内容；NFT 的当前持有者拥有身份资产。
原创演示内容用于展示协作，正式发布前需另外确定 IP 许可及争议机制。

## 架构与职责

React + Vite + TypeScript，viem，MetaMask，Monad Testnet，Vercel，单仓库。

```text
页面 / App（A）
  ├─ useWorld：连接状态、并发保护、交易反馈、刷新（A）
  ├─ WorldGateway
  │    ├─ mock：本地内存账本（A）
  │    └─ client：viem RPC / 钱包（A） → WorldProtocol（B）
  └─ ModuleProps → Forest / Forge（C）
```

| 负责人 | 文件边界 | 分支 |
| --- | --- | --- |
| A | App、components、styles、hooks、types、chain/client/config/mock、工程配置、文档 | feat/frontend |
| B | contracts、scripts、deployments/monad-testnet.json、src/chain/abi.ts | feat/contracts |
| C | src/modules/Forest.tsx、Forge.tsx 和模块内部资源 | feat/game-modules |

A 创建骨架后 B/C 从同一提交开始。共享接口变更通过 PR 协调，不 force push。
当前 modules 中是接入占位，不是 C 的游戏成品；contracts 中仅 Solidity 接口，不是 B 的合约实现。

## 链配置

仅 Monad Testnet，chainId=10143，MON，默认 RPC https://testnet-rpc.monad.xyz。
浏览器 https://testnet.monadscan.com，水龙头 https://faucet.monad.xyz。
使用 `VITE_MONAD_RPC_URL` 可覆盖 RPC。任何 VITE_ 变量均为公开前端配置，严禁私钥。

## B：精确 ABI 约定

```solidity
function mintPassport() external;
function balanceOf(address owner) external view returns (uint256);
function registerModule(uint256 moduleId, string calldata name, address creator, uint256 priceWei) external;
function modules(uint256 moduleId) external view returns (string memory name, address creator, uint256 priceWei, bool active);
function treasury() external view returns (address);
function hasAccess(address player, uint256 moduleId) external view returns (bool);
function buyModule(uint256 moduleId) external payable;
function pendingWithdrawals(address payee) external view returns (uint256);
function withdraw() external;
```

`modules` 与 `treasury` 是对原任务中未定 getter 的补充。返回顺序必须一致；若 B 用不同接口需同步适配器，不能只换地址。

- `mintPassport` 免费，每地址最多铸造一次；前端以 balanceOf 判断**当前持有**，不假造 tokenId。
- `registerModule` 仅管理员，非零 creator，模块 ID 不覆盖；演示注册 1 和 2。
- `hasAccess`：有效模块且当前有 Passport，免费模块直接可进；付费模块还需当前地址购买过。
- Passport 转移后，原持有者不再具备入口权限；购买记录属于钱包，不随 NFT 转移。
- `buyModule`：必须持有 Passport、模块有效、价格精确匹配、不允许重复购买。
- 以整数 wei 计算 `creator = value * 80 / 100`，`treasury = value - creator`，余额记账而非直接推送。
- `withdraw` 使用 CEI + 重入保护，失败回滚，不得丢失待提取余额。
- 收益面板为收款地址**跨模块累计待提取余额**，不是本次交易分账，也不是累计历史销售额。
- 前端读取链上价格，使用 bigint，不用浮点数构造交易 value。
- 前端权限只控制体验，不是安全边界；B 必须在合约强制执行权限。

B 交付：实际 ABI、非空合约地址、金库地址、部署交易哈希、链 ID、部署区块、模块注册交易、mint/buy/withdraw 成功和失败测试、真实交易证据。更新部署清单，标明验证结果。禁止提交私钥。

## C：稳定组件接口

```ts
export type ModuleProps = {
  walletAddress: `0x${string}` | null;
  hasPassport: boolean;
  unlocked: boolean;
  onBuy?: () => Promise<void>;
};
```

默认导出 ForestModule / ForgeModule，保留 src/modules/Forest.tsx 和 Forge.tsx 入口。
未连接 → 未持证 → 持证未解锁 → 已解锁四态都要支持。
onBuy 未提供表示不可购买（交易中、无数据或模块未激活）；不能自行发起链上交易。
模块不得自行连接钱包、定义 ABI、写全局导航或改变全局 CSS。模块样式限定自己的根类。
A 控制顶部返回入口和状态栏。C 只做场景交互，不宣称尚未实现的跨游戏装备互通。

## 模式与数据来源

- 默认 `mock`：无 RPC、无钱包签名、无交易哈希。刷新页面或重置即清空状态。
- `testnet`：只读取真实合约，错误时不得回落到 mock；缺地址时明确报错。
- 交易状态 Pending / Success / Failed；成功只在成功 receipt 之后显示。
- RPC 失败清空权限并提示重试。账户/网络切换淘汰旧异步响应，每 15 秒刷新。
- Mock 当前玩家不是收款人，所以玩家待提取为 0；创作者、金库余额仍能展示。

## 集成验收

1. B 按接口注册两个模块，提交清单和 ABI。
2. C 替换两处占位，检查 four-state Props。
3. A 配置 testnet，MetaMask 连链，领取 Passport。
4. 同一地址进入 Forest，Forge 仍锁定。
5. 购买 Forge，成功回执后解锁，展示创作者 0.0008 / 金库 0.0002 MON。
6. 使用收款账户演示 withdraw，区分记账和到账。
7. 拒签、余额不足、错误网络、重复点击、RPC 故障、换账户均不能误解锁。
8. 保存部署与交易链接后再录制真实演示。Mock 验证不算链上验收。
