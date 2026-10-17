// Run from repository root. Supply deployer key via local environment only.
import fs from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire(new URL('../contracts/package.json',import.meta.url));
const {JsonRpcProvider,Wallet,ContractFactory,isAddress,parseEther}=require('ethers');
const {TREASURY_ADDRESS,FOREST_CREATOR_ADDRESS,FORGE_CREATOR_ADDRESS,DEPLOYER_PRIVATE_KEY}=process.env;
for(const [name,value] of Object.entries({TREASURY_ADDRESS,FOREST_CREATOR_ADDRESS,FORGE_CREATOR_ADDRESS}))if(!value||!isAddress(value)||/^0x0{40}$/i.test(value))throw Error(`Set valid ${name}`);
if(!DEPLOYER_PRIVATE_KEY)throw Error('Set DEPLOYER_PRIVATE_KEY locally; never commit or share it');
const provider=new JsonRpcProvider(process.env.MONAD_RPC_URL||'https://testnet-rpc.monad.xyz');
if((await provider.getNetwork()).chainId!==10143n)throw Error('Only Monad Testnet chain 10143 is allowed');
const file='deployments/monad-testnet.json';
const prior=JSON.parse(fs.readFileSync(file,'utf8'));
if(prior.contractAddress)throw Error('Deployment already recorded: inspect it before deploying again');
const wallet=new Wallet(DEPLOYER_PRIVATE_KEY,provider);
const artifact=JSON.parse(fs.readFileSync('contracts/artifacts/WorldProtocol.json','utf8'));
const contract=await new ContractFactory(artifact.abi,artifact.evm.bytecode.object,wallet).deploy(wallet.address,TREASURY_ADDRESS);
const deployment=contract.deploymentTransaction();
const record={chainId:10143,worldId:1,contractAddress:await contract.getAddress(),deploymentTransactionHash:deployment.hash,treasuryAddress:TREASURY_ADDRESS,moduleIds:[1,2],verificationStatus:'not-verified',status:'deployment-submitted',registrationTransactions:[],liveAcceptance:'not-run'};
const save=()=>fs.writeFileSync(file,JSON.stringify(record,null,2)+'\n');save();
const receipt=await deployment.wait();record.deploymentBlock=receipt.blockNumber;record.status='deployed-registration-pending';save();
for(const [id,name,creator,price] of [[1,'Mystic Forest',FOREST_CREATOR_ADDRESS,0n],[2,'Arcane Forge',FORGE_CREATOR_ADDRESS,parseEther('0.001')]]){
 const t=await contract.registerModule(id,name,creator,price);record.registrationTransactions.push({moduleId:id,hash:t.hash,status:'submitted'});save();await t.wait();record.registrationTransactions.at(-1).status='confirmed';save();
}
record.status='deployed-and-registered';save();console.log(JSON.stringify(record,null,2));
