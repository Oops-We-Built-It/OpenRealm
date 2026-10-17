import fs from 'node:fs/promises';
import { Presentation, PresentationFile } from 'file:///C:/Users/j6788/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs';
import { finalizePresentation } from 'file:///C:/Users/j6788/.codex/plugins/cache/openai-primary-runtime/presentations/26.1015.12040/skills/presentations/container_tools/artifact_tool_utils.mjs';
const root='D:/github项目/OpenRealm';
const skill='C:/Users/j6788/.codex/plugins/cache/openai-primary-runtime/presentations/26.1015.12040/skills/presentations';
const p=Presentation.create({slideSize:{width:1280,height:720}});
const C={bg:'#10101D',white:'#F5F3FF',muted:'#ACA9C4',purple:'#B8A0FF',mint:'#83E4C2'};
function text(s,t,x,y,w,h,size=32,color=C.white,bold=false){const a=s.shapes.add({geometry:'textbox',position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});a.text=t;a.text.style={typeface:'Microsoft YaHei',fontSize:size,color,bold,insets:0,autoFit:'none',wrap:'none'};return a;}
function slide(title,notes){const s=p.slides.add();s.background.fill=C.bg;if(title)text(s,title,80,72,1120,90,48,C.white,true);s.speakerNotes.text=notes;return s;}
let s=slide('', '第一位演讲者，0:00–0:10。开场提问：为什么创造一个完整的游戏世界，就一定需要一家庞大的游戏公司？');
text(s,'OpenRealm',80,176,1100,130,100,C.white,true);
text(s,'一个世界，无数创作者',86,330,1100,80,52,C.purple,true);
text(s,'One World. Many Creators.',88,445,1100,60,32,C.muted);
text(s,'基于 Monad 的开放式游戏共创协议',88,525,1100,45,24,C.muted);
text(s,'Oops! We Built It',88,596,600,45,30,C.purple,true);
text(s,'洪婧淇   瞿杰   梁馨匀',88,645,900,40,26,C.white);
s=slide('独立创作者，不必独自造一个世界','第一位演讲者，0:10–0:45。三位开发者分别擅长魔法森林、装备锻造和冒险故事，但难以独自承担完整游戏世界的成本。合作时，玩家资产、收益规则和运营体系又彼此割裂。为什么不能共同创造同一个世界？这就是 OpenRealm 的初衷。');
text(s,'魔法森林',80,235,350,65,40,C.purple,true);text(s,'装备锻造',480,235,350,65,40,C.purple,true);text(s,'冒险故事',880,235,320,65,40,C.purple,true);
text(s,'每个人都有出色的创意',80,355,1120,65,36);
text(s,'完整世界成本高，跨游戏合作又彼此割裂',80,435,1120,65,32,C.muted);
text(s,'让他们共同创造同一个世界',80,574,1120,70,44,C.white,true);
s=slide('OpenRealm 的三个核心机制','第二位演讲者，0:45–1:20。OpenRealm 是构建在 Monad 上、面向独立游戏开发者的开放式共创协议。第一，共同创造：围绕同一个世界观开发不同游戏模块。第二，共享身份：统一链上 Passport 让模块识别同一个玩家。第三，透明分账：预先约定规则，由智能合约自动执行。我们想建立让独立创作者共同建设游戏世界的基础设施。');
[['01','共同创造','同一世界观，不同开发者创造游戏模块'],['02','共享身份','统一链上 Passport，跨模块识别玩家'],['03','透明分账','预先约定收入规则，智能合约自动执行']].forEach((r,i)=>{let y=225+i*137;text(s,r[0],80,y,85,65,36,C.purple);text(s,r[1],195,y,260,65,36,C.white,true);text(s,r[2],480,y+5,740,65,27,C.muted);});
s=slide('Aetheria：共享世界的第一步','第三位演讲者，1:20–1:55。切换到网站。连接钱包，领取 World Passport，展示 Passport NFT。进入 Mystic Forest，展示森林场景，再进入另一位开发者创造的 Arcane Forge。强调两个模块识别同一份玩家身份。');
text(s,'World Passport',80,205,1120,80,52,C.purple,true);text(s,'连接钱包，领取身份凭证',80,297,1120,55,30,C.muted);
text(s,'Mystic Forest',80,425,540,65,42,C.white,true);text(s,'魔法森林',80,505,540,55,30,C.muted);
text(s,'Arcane Forge',700,425,500,65,42,C.white,true);text(s,'奥术工坊',700,505,500,55,30,C.muted);
text(s,'不同创作者的模块，识别同一个玩家',80,620,1120,50,30,C.mint);
s=slide('每次购买，都支持创作者与世界','第三位演讲者，1:55–2:15。在网站购买工坊模块，展示交易记录和收益状态。根据预先约定的规则，80% 归模块开发者，20% 归共享世界金库。创作者既能独立开发并获得收入，也能共同建设更大的世界。');
text(s,'80%',80,205,650,180,132,C.purple,true);text(s,'20%',780,205,420,180,132,C.mint,true);
text(s,'模块开发者',90,420,600,65,40,C.white,true);text(s,'共享世界金库',790,420,420,65,40,C.white,true);
text(s,'获得模块收入',90,505,600,55,29,C.muted);text(s,'支持世界持续建设',790,505,430,55,29,C.muted);
text(s,'Monad 智能合约按约定执行分账',90,620,1100,50,29,C.white);
s=slide('为什么选择 Monad','第一位演讲者，2:15–2:35。创作者共同建设世界，需要不依赖单一平台信任、公开透明且共同遵守的规则。Monad 上的智能合约为合作提供基础。商业模式：开发者通过模块获得收入，一部分收益支持整个世界持续建设。');
text(s,'共同创造，需要共同遵守的规则',80,225,1120,80,48,C.purple,true);
text(s,'规则公开透明',80,362,1120,60,34);
text(s,'智能合约执行约定',80,445,1120,60,34);
text(s,'减少对单一平台的信任依赖',80,528,1120,65,34);
s=slide('','第一位演讲者，2:35–3:00。今天只展示两个模块。未来希望有几十个、几百个，甚至更多创作者的故事。他们不需要加入同一家公司，也不需要放弃独立性。每个人创造世界的一部分，最终连接成一个更大的世界。We don’t need one big studio to build one big world. 我们需要的是一套让独立创作者共同创造的协议。这就是 OpenRealm，谢谢大家。');
text(s,'每个人创造世界的一部分',80,140,1120,80,56,C.white,true);text(s,'所有人的创造，连接成更大的世界',80,240,1120,80,48,C.purple,true);
text(s,"We don't need one big studio",80,402,1120,55,34,C.muted);text(s,'to build one big world.',80,456,1120,55,34,C.muted);
text(s,'OpenRealm',80,590,900,70,48,C.white,true);text(s,'谢谢',1080,608,130,50,28,C.muted);
await (await PresentationFile.exportPptx(p)).save(root+'/.ppt-build/draft.pptx');
for(let i=0;i<p.slides.items.length;i++){const png=await p.export({slide:p.slides.items[i],format:'png',scale:1});await fs.writeFile(root+`/.ppt-build/slide-${i+1}.png`,new Uint8Array(await png.arrayBuffer()));}
await finalizePresentation({workspaceDir:root,candidatePath:root+'/.ppt-build/draft.pptx',finalPath:root+'/output/OpenRealm_路演_团队版.pptx',pythonExecutable:'C:/Users/j6788/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe',integrityValidatorPath:skill+'/container_tools/inspect_presentation_package_integrity.py',layoutValidatorPath:skill+'/container_tools/inspect_presentation_layout_geometry.py',layoutArgs:['--expected-slide-size-emu','12192000,6858000','--validate-bullet-geometry','--validate-heading-fit'],fontPolicy:{basis:'design',families:['Microsoft YaHei']},verifyArtifactToolImport:true,receiptPath:root+'/.ppt-build/validation-team.json'});
console.log('DONE');


