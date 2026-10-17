import {test,after} from 'node:test';
import assert from 'node:assert/strict';
import ganache from 'ganache';
import {BrowserProvider,ContractFactory,parseEther,ZeroAddress} from 'ethers';
import {compile} from '../compile.mjs';
const contracts=compile({'Payee.sol':{content:`pragma solidity ^0.8.24;
interface I {function withdraw() external;}
contract Payee { bool public rejectPayment; bool public reentryBlocked; I public target;
function configure(address t,bool reject_) external {target=I(t);rejectPayment=reject_;}
function claim() external {target.withdraw();}
receive() external payable {require(!rejectPayment,"reject"); try target.withdraw() {revert("reentry succeeded");} catch {reentryBlocked=true;}}
}`}});
const node=ganache.provider({logging:{quiet:true},chain:{hardfork:'shanghai'}});
const provider=new BrowserProvider(node); provider.pollingInterval=10;
const [owner,creator,treasury,alice,bob]=await Promise.all([0,1,2,3,4].map(i=>provider.getSigner(i)));
const addresses=await Promise.all([owner,creator,treasury,alice,bob].map(s=>s.getAddress()));
const price=parseEther('0.001');
async function deploy(treasuryAddress=addresses[2]) {
 const c=await new ContractFactory(contracts['WorldProtocol.sol'].WorldProtocol.abi,contracts['WorldProtocol.sol'].WorldProtocol.evm.bytecode.object,owner).deploy(addresses[0],treasuryAddress);await c.waitForDeployment();return c;
}
async function tx(p) {await (await p).wait();}
async function setup() {const c=await deploy();await tx(c.registerModule(1,'Mystic Forest',addresses[1],0));await tx(c.registerModule(2,'Arcane Forge',addresses[1],price));return c;}
after(async()=>{await node.disconnect();});
test('rejects zero treasury',async()=>{await assert.rejects(deploy(ZeroAddress));});
test('admin-only registry, immutable IDs, exact getter order and disabled access',async()=>{
 const c=await setup();const m=await c.modules(2);assert.deepEqual([...m],['Arcane Forge',addresses[1],price,true]);
 await assert.rejects(c.connect(alice).registerModule(3,'Other',addresses[1],0));
 await assert.rejects(c.registerModule(2,'Overwrite',addresses[1],0));
 await assert.rejects(c.registerModule(3,'Bad',ZeroAddress,0));
 await tx(c.connect(alice).mintPassport());assert.equal(await c.hasAccess(addresses[3],1),true);
 assert.equal(await c.hasAccess(ZeroAddress,1),false);assert.equal(await c.hasAccess(addresses[3],99),false);
 await tx(c.setModuleActive(1,false));assert.equal(await c.hasAccess(addresses[3],1),false);
 await assert.rejects(c.connect(alice).buyModule(1));
});
test('mint once, ERC721 transfer removes access; purchase does not follow NFT',async()=>{
 const c=await setup();await tx(c.connect(alice).mintPassport());assert.equal(await c.ownerOf(1),addresses[3]);
 await assert.rejects(c.connect(alice).mintPassport());await tx(c.connect(alice).buyModule(2,{value:price}));
 await tx(c.connect(alice).transferFrom(addresses[3],addresses[4],1));
 assert.equal(await c.hasAccess(addresses[3],2),false);assert.equal(await c.hasAccess(addresses[4],1),true);assert.equal(await c.hasAccess(addresses[4],2),false);
 await assert.rejects(c.connect(alice).mintPassport());
 await tx(c.connect(bob).transferFrom(addresses[4],addresses[3],1));assert.equal(await c.hasAccess(addresses[3],2),true);
});
test('enforces passport, exact payment, single purchase; accounts 80/20 and withdraws',async()=>{
 const c=await setup();await assert.rejects(c.connect(alice).buyModule(2,{value:price}));await tx(c.connect(alice).mintPassport());
 for(const value of [price-1n,price+1n])await assert.rejects(c.connect(alice).buyModule(2,{value}));
 await assert.rejects(c.connect(alice).buyModule(99,{value:price}));
 await tx(c.connect(alice).buyModule(2,{value:price}));await assert.rejects(c.connect(alice).buyModule(2,{value:price}));
 assert.equal(await c.pendingWithdrawals(addresses[1]),price*80n/100n);assert.equal(await c.pendingWithdrawals(addresses[2]),price*20n/100n);
 assert.equal(await c.hasAccess(addresses[3],2),true);await assert.rejects(c.connect(alice).withdraw());
 await tx(c.setModuleActive(2,false));await tx(c.connect(creator).withdraw());await tx(c.connect(treasury).withdraw());
 assert.equal(await c.pendingWithdrawals(addresses[1]),0n);assert.equal(await provider.getBalance(await c.getAddress()),0n);
});
test('rounding, cross-module accumulation, and creator equal to treasury',async()=>{
 const c=await deploy(addresses[1]);await tx(c.registerModule(1,'Odd',addresses[1],7));await tx(c.registerModule(2,'Second',addresses[1],11));
 await tx(c.connect(alice).mintPassport());await tx(c.connect(alice).buyModule(1,{value:7}));await tx(c.connect(alice).buyModule(2,{value:11}));
 assert.equal(await c.pendingWithdrawals(addresses[1]),18n);await tx(c.connect(creator).withdraw());assert.equal(await c.pendingWithdrawals(addresses[1]),0n);
});
test('failed payout preserves balance; reentrant withdrawal is blocked',async()=>{
 const a=contracts['Payee.sol'].Payee;const payee=await new ContractFactory(a.abi,a.evm.bytecode.object,owner).deploy();await payee.waitForDeployment();
 const c=await deploy();await tx(c.registerModule(1,'Paid',await payee.getAddress(),price));await tx(c.connect(alice).mintPassport());await tx(c.connect(alice).buyModule(1,{value:price}));
 await tx(payee.configure(await c.getAddress(),true));await assert.rejects(payee.claim());assert.equal(await c.pendingWithdrawals(await payee.getAddress()),price*80n/100n);
 await tx(payee.configure(await c.getAddress(),false));await tx(payee.claim({gasLimit:500000}));assert.equal(await payee.reentryBlocked(),true);assert.equal(await c.pendingWithdrawals(await payee.getAddress()),0n);
});
