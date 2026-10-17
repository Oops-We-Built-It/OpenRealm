# OpenRealm

**One World. Many Creators. Shared Ownership.**

OpenRealm 是面向独立游戏创作者的共享世界协议 MVP：多个创作者为同一个世界构建游戏模块，玩家使用同一份 World Passport 进入不同模块，付费收入按公开规则记入创作者和世界金库。

首个演示世界 **Aetheria** 包含两个模块，验证「共享身份 → 模块准入 → 付费解锁 → 收益分账」的完整流程。前端默认使用本地 Mock，也提供面向 Monad Testnet 的钱包与合约适配层。

## 项目状态与范围

当前仓库已包含前端、两个可交互游戏模块、Solidity 合约实现、ABI、部署脚本和自动化测试。部署清单中的地址与交易哈希仍为空，**尚不能视为真实测试网闭环已验收**。

| 部分 | 当前实现 |
| --- | --- |
| 产品前端 | 首页、世界仪表盘、Passport、模块入口、收益面板、交易反馈 |
| 游戏模块 | Pixel Farm 种植收获、Pixel Arena 回合战斗，已接入主应用权限状态 |
| 协议合约 | ERC-721 Passport、管理员注册模块、购买权限、80/20 分账、收益提现 |
| 本地演示 | 无需钱包或测试币，可体验身份、购买与分账模拟流程 |
| 测试网接入 | viem 适配器与部署脚本已实现；部署、源码验证及真实交易验收待完成 |
| 对外交付 | 已有部署与演示说明，尚未记录公网演示地址和最终视频 |

MVP 的共享链上资产仅限 **World Passport**。模块由管理员注册；目前不包含链上装备或背包互通、DAO、交易市场、自动 IP 授权。种植与战斗状态运行在浏览器内，不上链。

## 体验 Aetheria

协议名称和游戏画面名称的对应关系如下，模块 ID 与接口保持 [TEAM_SPEC](TEAM_SPEC.md) 的约定：

| 模块 | 协议名称 | 游戏内容 | 进入条件 |
| --- | --- | --- | --- |
| `1` | Mystic Forest | **Pixel Farm**：选择地块、播种、浇水，约 14 秒后收获 Starlight Fruit | 持有 Passport，模块有效，免费进入 |
| `2` | Arcane Forge | **Pixel Arena**：普通攻击、技能攻击、胜负结算与重试 | 持有 Passport，模块有效，当前钱包已购买 |

Forge 的演示价格为 **0.001 MON**；测试网模式读取合约实际价格。按此价格购买一次，会增加创作者 **0.0008 MON**、世界金库 **0.0002 MON** 的待提取余额。

### 本地启动

需要 **Node.js ≥ 22.12.0** 和 npm。在仓库根目录运行：

```sh
npm install
npm run dev
```

打开终端输出的地址，默认是 `http://127.0.0.1:5173`。未配置环境变量时使用 `mock`，无需连接真实钱包。

> 根目录目前未跟踪 `package-lock.json`，首次克隆使用 `npm install`。本地已有与依赖声明一致的锁文件时可使用 `npm ci`。

### 主应用演示流程

1. 点击「连接演示账户」，领取 World Passport。
2. 进入 Forest，在 Pixel Farm 中播种、浇水和收获。
3. 返回世界，进入 Forge，购买并解锁 Pixel Arena。
4. 体验战斗，再返回世界查看创作者与金库的 80/20 待提取余额。
5. 使用顶部「重置演示」清空模拟协议状态；刷新页面可重新开始本地演示。

Mock 不发送链上交易，也不生成交易哈希。演示玩家不是收款人，因此玩家自身待提取余额为 0，提现按钮不可用属于预期行为。

### 游戏模块独立预览

开发服务器运行后，访问 `http://127.0.0.1:5173/preview.html`。此页面可切换钱包、Passport、Arena 权限和果实状态，用于验证入口状态与玩法。

独立预览还演示了「农场收获果实 → 竞技场普通攻击增加 5 点」的本地交互。该效果仅为 **Mock / Demo Data**，未接入主应用的共享协议状态，也不是链上资产互通。`preview.html` 当前仅作为开发预览入口，默认生产构建未将其配置为独立页面。

## 协议规则

- **共享身份**：World Passport 是可转移的 ERC-721；每个地址最多免费铸造一次，链上操作仍需支付 Gas。入口以当前持有状态判断资格。
- **模块权限**：免费模块需要 Passport；付费模块还需要当前钱包的购买记录。购买记录绑定钱包，不随 Passport 转移；失去 Passport 后不再具备模块入口权限。
- **模块管理**：管理员注册模块并可启用或停用。已注册模块的 ID、创作者和价格不能覆盖，金库地址在部署时确定。
- **收益分配**：购买金额必须精确匹配价格，以整数 wei 计算创作者份额 `value * 80 / 100`，余数归金库。
- **主动提现**：购买只增加待提取余额，收款方调用 `withdraw()` 后才到账。面板显示收款地址跨模块累计待提取余额，不是历史销售额。
- **交易确认**：测试网模式等待成功回执后更新权限；配置、RPC 或合约调用失败时显示错误，不自动回退到 Mock。

合约负责强制执行购买与访问查询规则；前端入口控制本身不是安全边界。游戏内容仍由前端执行。

## 技术架构

前端采用 React 19、TypeScript、Vite 和 viem；合约采用 Solidity 0.8.24 与 OpenZeppelin 5.4.0，目标网络为 Monad Testnet。前端测试使用 Vitest / Testing Library，合约测试使用 Node.js Test Runner、Ganache 和 ethers。

```text
App / 世界仪表盘
  ├─ useWorld：钱包状态、交易反馈、权限刷新
  │    └─ WorldGateway
  │         ├─ Mock：本地内存账本
  │         └─ viem：钱包 + RPC → WorldProtocol
  │                              ├─ ERC-721 Passport
  │                              ├─ 模块注册与购买权限
  │                              └─ 分账记账与提现
  └─ ModuleProps → Forest / Forge
                   游戏交互由模块实现，钱包与交易由宿主统一处理
```

```text
src/
  App.tsx                 页面与 hash 路由
  components/             导航、Passport、世界仪表盘与场景插画
  hooks/useWorld.ts       钱包、交易与状态管理
  chain/                  ABI、网络配置、真实与 Mock 适配器
  types/world.ts          统一协议类型与 ModuleProps
  modules/                Forest / Forge 游戏实现及样式
  preview/                游戏模块独立预览
contracts/                Solidity 实现、完整 ABI、编译脚本与合约测试
scripts/deploy-world.mjs  测试网部署与模块注册脚本
deployments/              链 ID、地址与部署交易清单
docs/                     Pitch、演示流程、部署与验收说明
TEAM_SPEC.md              团队接口约定与职责边界
GAME_MODULE_INTEGRATION.md 游戏模块集成说明
```

## 接入 Monad Testnet

以下步骤用于真实测试网集成，默认 Mock 体验不需要执行。

### 1. 构建与部署合约

在仓库根目录运行：

```sh
npm ci --prefix contracts
npm run build --prefix contracts
npm test --prefix contracts
```

按 [合约说明](contracts/README.md) 在本地配置 `DEPLOYER_PRIVATE_KEY`、`TREASURY_ADDRESS`、`FOREST_CREATOR_ADDRESS`、`FORGE_CREATOR_ADDRESS`，可选配置 `MONAD_RPC_URL`，再运行：

```sh
node scripts/deploy-world.mjs
```

部署脚本检查链 ID `10143`，部署合约、注册两个模块，并记录部署证据。执行中断时先核验清单和交易回执，避免重复部署。源码验证与玩家 Mint / Buy / 收款方 Withdraw 验收需另外完成。

### 2. 配置前端

复制 `.env.example` 为 `.env.local`，设置：

```dotenv
VITE_APP_MODE=testnet
VITE_MONAD_RPC_URL=https://testnet-rpc.monad.xyz
VITE_WORLD_PROTOCOL_ADDRESS=
```

在最后一项填入真实部署的非零合约地址；留空时读取 `deployments/monad-testnet.json` 的 `contractAddress`。两处均未提供有效地址时，前端会报配置错误。

以上 RPC 和链 ID 来自仓库当前网络配置。重启 Vite 后，使用 MetaMask 连接 Monad Testnet，准备测试 MON，依次验证领取 Passport、免费模块访问、付费解锁和收款账户提现。

`VITE_` 变量会公开打包到浏览器，只能存放公开配置。部署私钥不得放入前端变量或提交到 Git。

### 3. 保存验收证据

将真实合约地址、部署与模块注册交易写入 [部署清单](deployments/monad-testnet.json)，将 Mint、Buy、Withdraw 的回执、余额变化和公网地址记录到 [验收文档](docs/ACCEPTANCE.md)。本地测试与 Mock 演示不能替代真实链上证据。

## 开发验证与发布

在仓库根目录运行：

```sh
npm test
npm run typecheck
npm run build
npm run preview
```

前端测试覆盖主流程、Mock 分账与账户隔离、真实适配器的交易与错误处理，以及种植和战斗交互。真实适配器测试使用 RPC / 钱包替身；合约测试使用本地 Ganache。

生产构建输出到 `dist/`。仓库已提供 Vercel 配置，构建命令为 `npm run build`，输出目录为 `dist`。环境变量在构建时注入，修改后需重新构建部署。具体步骤见 [部署说明](docs/DEPLOYMENT.md)。

## 协作与相关文档

| 职责 | 范围 |
| --- | --- |
| A：产品与前端 | 页面、钱包与交易管理、协议适配、工程配置和交付文档 |
| B：智能合约 | 合约实现、ABI、部署脚本、测试网部署与交易证据 |
| C：游戏模块 | Forest / Forge 的交互、样式与模块内部资源 |

共享接口修改需同步类型、ABI、测试和 [TEAM_SPEC](TEAM_SPEC.md)。游戏模块通过 `ModuleProps` 接收身份、权限及购买回调，不自行建立钱包或合约层；详见 [游戏模块集成说明](GAME_MODULE_INTEGRATION.md)。

路演材料见 [Pitch](docs/PITCH.md) 和 [三分钟演示脚本](docs/DEMO.md)。部分协作文档仍保留早期占位阶段的描述；当前实现范围以本 README 与代码为准，链上完成情况以真实部署和交易证据为准。

## 许可证

仓库根目录提供 [Apache License 2.0](LICENSE)；合约源码另标注 `SPDX-License-Identifier: MIT`。复用时请核对相关文件的许可证声明。游戏世界的 IP 合作与授权机制不在本 MVP 的协议实现范围内。
