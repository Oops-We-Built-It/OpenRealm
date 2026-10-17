# 部署交接

## 本地预检

运行 npm ci、npm test、npm run build。dist/ 为静态产物。
当前页面采用 hash 路由，入口 /#world、/#forest、/#forge。

## Vercel

1. 将仓库导入 Vercel，Framework 选 Vite，根目录为仓库根，构建 npm run build，输出 dist。
2. 演示预览部署设置 VITE_APP_MODE=mock；真实 Demo 设置 testnet。
3. 设置 VITE_WORLD_PROTOCOL_ADDRESS 与可选 VITE_MONAD_RPC_URL；必须公开可访问，不能使用私钥。
4. 触发部署。Vite 变量在构建时注入，修改变量必须重新部署。
5. 打开实际 URL，确认模式条、移动端布局、深链接、钱包连链、回执链接。
6. 将实际 URL 和 commit 写入 docs/ACCEPTANCE.md，再录制 Demo。

如使用 CLI：登录自己的 Vercel 账户后 `npx vercel` 创建预览，完成验收后 `npx vercel --prod`。
本次没有部署凭据或 Git remote，未执行外部发布。

## B 的部署清单

monad-testnet.json 至少更新 contractAddress、treasuryAddress、deploymentTransactionHash、verificationStatus，可追加 deploymentBlock、模块注册及购买交易哈希。所有地址必须是真实非零地址；不要填示例地址冒充部署。
ABI 应从编译产物核对；当前 abi.ts 是冻结接口提案。

## 故障排查

- 没有钱包：在 MetaMask 支持的浏览器打开。
- 错误网络：点击「切换网络」，拒签后可重试。
- 合约读取失败：检查 10143 网络、地址、ABI getters、是否注册两个模块。
- 钱包拒绝/余额不足：不会解锁，可充值测试 MON 后再试。
- 回执超时：状态可能仍待确认，查看已有交易链接并刷新权限，不要盲目重复付款。
- 更换账户后记录不同：Passport 持有与购买权限属于当前钱包。
- 前端构建失败：检查 Node 版本并 npm ci，不要手动删改 lockfile。
