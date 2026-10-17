import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import solc from 'solc';
export const root = path.dirname(fileURLToPath(import.meta.url));
export function compile(extra = {}) {
  const input = {language:'Solidity',sources:{'WorldProtocol.sol':{content:fs.readFileSync(path.join(root,'WorldProtocol.sol'),'utf8')},...extra},settings:{optimizer:{enabled:true,runs:200},evmVersion:'paris',outputSelection:{'*':{'*':['abi','evm.bytecode.object','evm.deployedBytecode.object']}}}};
  const output = JSON.parse(solc.compile(JSON.stringify(input),{import:p=>{try{return {contents:fs.readFileSync(path.join(root,'node_modules',p),'utf8')}}catch{return {error:`Missing import: ${p}`}}}}));
  const errors=(output.errors??[]).filter(e=>e.severity==='error');
  if(errors.length) throw new Error(errors.map(e=>e.formattedMessage).join('\n'));
  return output.contracts;
}
if(process.argv[1]===fileURLToPath(import.meta.url)) {
  const artifact=compile()['WorldProtocol.sol'].WorldProtocol;
  fs.mkdirSync(path.join(root,'artifacts'),{recursive:true});
  fs.writeFileSync(path.join(root,'artifacts/WorldProtocol.json'),JSON.stringify(artifact,null,2)+'\n');
  fs.writeFileSync(path.join(root,'WorldProtocol.abi.json'),JSON.stringify(artifact.abi,null,2)+'\n');
  console.log(`Compiled Solidity ${solc.version()}; runtime ${artifact.evm.deployedBytecode.object.length/2} bytes`);
}
