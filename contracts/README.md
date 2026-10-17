# Member B workspace

实现 WorldProtocol.sol，参考 ../TEAM_SPEC.md 与 IWorldProtocol.sol。
推荐 OpenZeppelin ERC721、Ownable、ReentrancyGuard，按团队选择配置 Foundry 或 Remix。
接口文件不是部署目标；此骨架没有实现、测试或部署你的合约。

合约测试至少覆盖：一次 mint、余额与转移、非管理员注册、错误模块、无证购买、少付/多付、重复购买、80/20 精确记账、不同收款人、提款失败回滚、重入、领取后两模块权限。
