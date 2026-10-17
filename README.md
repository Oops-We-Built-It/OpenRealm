# OpenRealm · Aetheria虚拟游戏世界

**One World. Many Creators. Shared Ownership.**

**一个世界，多位创作者，一份玩家身份，公开的收益规则。**

[体验在线 Demo](https://openrealm-hackathon-demo.rainylark2.chatgpt.site/) · [查看测试网合约](https://testnet.monadscan.com/address/0x20730B85B1F18c6d12d23b4CD413d4FfA5b3305a) · [查看合约源码](contracts/WorldProtocol.sol) · [路演截图](screenshots.md)

## Aetheria 是什么？

Aetheria 是一个由不同创作者共同扩展的幻想游戏世界，也是 OpenRealm 的首个示范世界。

我们希望一个游戏世界可以容纳多位独立创作者：有人创造农场，有人创造竞技场，未来还可以有人加入解谜、探险和新的故事。玩家带着同一份 World Passport，在这些内容之间探索；创作者保留各自模块的开发空间，通过约定的规则参与世界的商业收入。

**Aetheria 是共同的舞台，游戏模块是创作者提供的内容，OpenRealm 连接玩家身份、模块访问权限与收入结算。**

## 不同创作者如何协作？

OpenRealm 将合作建立在三个共同约定上：

| 共同约定 | 创作者之间如何协作 | 当前实现 |
| --- | --- | --- |
| **Shared World** | 围绕同一个世界提供不同内容，通过统一入口触达玩家 | Aetheria 下注册两个模块，分别记录名称、创作者和价格 |
| **Shared Assets** | 模块识别同一份玩家身份，无需各自建立通行证系统 | 可转移的 ERC-721 World Passport，两个模块共同识别 |
| **Shared Revenue** | 提前确定模块收入与公共世界资金的分配方式 | 购买款的 80% 记入模块创作者，20% 记入世界金库，由收款方提现 |

模块通过统一接口接收玩家身份与访问权限，钱包连接和支付由共同入口处理。当前版本由管理员注册模块；它是开放共创的协议原型，尚非无需许可的内容发布平台。

世界金库旨在为公共世界的持续建设提供资金。本原型实现了金库收入记账与提现，尚未实现资金用途治理。

## 在一个世界中体验两种游戏

| 模块 | 内容 | 玩家如何进入 |
| --- | --- | --- |
| **Mystic Forest · Pixel Farm** | 选择地块、播种、浇水，等待成熟后收获 Starlight Fruit | 当前持有 Passport，免费进入 |
| **Arcane Forge · Pixel Arena** | 与敌人对战，使用普通攻击和技能，完成战斗并重试 | 当前持有 Passport，并购买模块访问权 |

**评委体验路径：**

1. 使用安装 MetaMask 的浏览器打开 [Demo](https://openrealm-hackathon-demo.rainylark2.chatgpt.site/)，连接自己的钱包。
2. 切换到 **Monad Testnet（Chain ID：10143）**，通过 [官方水龙头](https://faucet.monad.xyz)准备测试 MON。
3. 免费领取 World Passport；铸造交易仍需少量测试 MON 支付 Gas。
4. 进入 Forest，体验种植与收获。
5. 进入 Forge，支付 **0.001 测试 MON + Gas**，交易确认后体验竞技场。
6. 查看链上购买事件与收益记账；只有收款钱包能够提取对应收益。

每个地址最多免费铸造一次。模块购买记录绑定钱包，不随 Passport 转移；失去 Passport 后，该钱包暂时失去模块入口资格。已购买的钱包重新持有 Passport 后恢复访问。

## 对 GameFi 与游戏行业的意义

**让游戏内容成为收入来源。** 玩家为收费模块付费，创作者因提供内容获得收入。当前体验不依赖代币挖矿、收益承诺或资产价格上涨。

**让不同创作者围绕同一世界开展合作。** 新内容可以作为模块加入，共用已有身份和结算接口，而无需为每种玩法重复建立完整的入口系统。

**让结算可以被共同核验。** 购买金额、分账事件和提现记录可在链上查询。不同运营主体可以依据同一份合约核对资金流，减少单方账本与人工结算带来的依赖。

传统数据库也能实现共享身份和分账。OpenRealm 探索的是多方共创时的共同结算基础：当世界与内容由不同主体运营，玩家资产和合作规则可以公开核验。

## 可核验的测试网部署

| 项目 | 信息 |
| --- | --- |
| 网络 | Monad Testnet |
| Chain ID | `10143` |
| 协议合约 / Passport NFT | [`0x20730B85B1F18c6d12d23b4CD413d4FfA5b3305a`](https://testnet.monadscan.com/address/0x20730B85B1F18c6d12d23b4CD413d4FfA5b3305a) |
| 部署区块 | `71786519` |
| 演示创作者与世界金库 | [`0xDfE5c456527C05Db345701Ef0F4457EBB1b9BcEc`](https://testnet.monadscan.com/address/0xDfE5c456527C05Db345701Ef0F4457EBB1b9BcEc) |
| 公开 RPC | `https://testnet-rpc.monad.xyz` |
| 合约源码与完整 ABI | [WorldProtocol.sol](contracts/WorldProtocol.sol) · [WorldProtocol.abi.json](contracts/WorldProtocol.abi.json) |

### 部署与模块注册交易

| 操作 | 交易证明 |
| --- | --- |
| 部署 WorldProtocol | [查看部署交易](https://testnet.monadscan.com/tx/0x24d643a0a966d0e1a3408c96e421715825ebda2fe631421abc7aefabf7c267c6) |
| 注册 Forest（模块 1） | [查看注册交易](https://testnet.monadscan.com/tx/0x82a55b2d2ca8e99af4e335022200ad2113fe314ca968bc8b616fdf88c8244ffc) |
| 注册 Forge（模块 2） | [查看注册交易](https://testnet.monadscan.com/tx/0x4e8f45fdcd94871e20357df332ec963808c93afd28e1ef13ac6aaac2e4abae9a) |

### 已完成的玩家交易

以下记录已通过测试网 RPC 查询合约事件核验：

| 操作 | 链上结果 | 交易证明 |
| --- | --- | --- |
| 领取 World Passport | 铸造 Passport #1，持有人为上述演示钱包 | [查看领取交易](https://testnet.monadscan.com/tx/0xc1c8b2cb4f341f013004f1a9e86fe94d70d00c439ed091e3c57e91021353d4ef) |
| 购买 Forge | 支付 0.001 MON；创作者记账 0.0008 MON，金库记账 0.0002 MON | [查看购买交易](https://testnet.monadscan.com/tx/0x53b536786393309924c283bb7e910bcfa481b4db5c8c9c9703c93d739e7f323c) |
| 提取收益 | 演示收款地址提取合计 0.001 MON | [查看提现交易](https://testnet.monadscan.com/tx/0x0cb28fcff873c7d26e518b9e760ceeb03be8cf25935053ae672b356917c73248) |

一次 0.001 MON 的购买，对应创作者份额 **0.0008 MON**、金库份额 **0.0002 MON**。当前演示将两个收款角色设为同一地址，因此该地址待提现余额增加 **0.001 MON**；面板若两处显示同一地址余额，不应重复相加。合约的分账事件分别记录两个份额。

## 当前边界与后续方向

当前已经实现身份 NFT、两个可交互模块、链上购买和收益记账提现。共享链上资产仅为 Passport；作物、装备和战斗进度没有上链，也没有实现主应用中的跨游戏物品互通。游戏执行与内容可用性仍依赖前端，NFT 本身不保证内容永久在线。

后续可探索更多独立创作者接入、共享物品标准、不同收款方的协作与世界金库治理。版权许可、审核与争议机制需要单独制定；持有 Passport 不代表拥有游戏版权、公司股权或治理权。

**Shared Ownership 是项目愿景；当前已经落地的是玩家对 Passport 的持有，以及可核验的合作收入分配。**

合约尚未完成浏览器源码验证或独立安全审计。所有演示交易均使用测试 MON。

## 技术与许可证

React、TypeScript、viem；Solidity、OpenZeppelin；部署于 Monad Testnet。

技术接入见 [团队接口约定](TEAM_SPEC.md) 与 [合约说明](contracts/README.md)。仓库提供 [Apache License 2.0](LICENSE)，合约源码另标注 MIT；复用时以相应文件的许可证声明为准。
