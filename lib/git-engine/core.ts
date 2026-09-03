export type FileMap = Record<string,string>;
export type GitObject = { type:'blob'|'tree'|'commit'|'tag'; content:string; id:string };
export type Commit = { id:string; tree:string; parentIds:string[]; message:string; author:string; timestamp:number };
export type ReflogEntry = { oldId:string; newId:string; ref:string; message:string; timestamp:number };
export type Remote = { name:string; branches:Record<string,string> };
export type Index = Record<string,string>;
export type RepoState = {
  initialized:boolean; files:FileMap; index:Index; objects:Record<string,GitObject>; commits:Record<string,Commit>;
  refs:Record<string,string>; head:string; headSymbolic:boolean; reflogs:Record<string,ReflogEntry[]>; remotes:Record<string,Remote>;
  branch:string; detached:boolean; merge?:{target:string;base:string;conflicts:string[]}; rebase?:{onto:string;original:string;queue:string[];current?:string}; stash: Array<{id:string;files:FileMap;index:Index;message:string}>;
};
export function emptyRepo():RepoState { return {initialized:false,files:{},index:{},objects:{},commits:{},refs:{},head:'',headSymbolic:true,reflogs:{},remotes:{},branch:'main',detached:false,stash:[]}; }
export function oid(input:string):string {
  const bytes=Array.from(new TextEncoder().encode(input)); const bitLen=bytes.length*8; bytes.push(0x80); while(bytes.length%64!==56)bytes.push(0); for(let i=7;i>=0;i--)bytes.push((bitLen/2**(8*i))&255); let h0=0x67452301,h1=0xEFCDAB89,h2=0x98BADCFE,h3=0x10325476,h4=0xC3D2E1F0; const rol=(x:number,n:number)=>(x<<n)|(x>>>(32-n)); for(let c=0;c<bytes.length;c+=64){const w=new Array<number>(80).fill(0);for(let i=0;i<16;i++)w[i]=((bytes[c+i*4]<<24)|(bytes[c+i*4+1]<<16)|(bytes[c+i*4+2]<<8)|bytes[c+i*4+3])>>>0;for(let i=16;i<80;i++)w[i]=rol(w[i-3]^w[i-8]^w[i-14]^w[i-16],1)>>>0;let a=h0,b=h1,d=h3,e=h4,cc=h2;for(let i=0;i<80;i++){let f=0,k=0;if(i<20){f=(b&cc)|((~b)&d);k=0x5A827999}else if(i<40){f=b^cc^d;k=0x6ED9EBA1}else if(i<60){f=(b&cc)|(b&d)|(cc&d);k=0x8F1BBCDC}else{f=b^cc^d;k=0xCA62C1D6}const t=(rol(a,5)+f+e+k+w[i])>>>0;e=d;d=cc;cc=rol(b,30)>>>0;b=a;a=t}h0=(h0+a)>>>0;h1=(h1+b)>>>0;h2=(h2+cc)>>>0;h3=(h3+d)>>>0;h4=(h4+e)>>>0}return [h0,h1,h2,h3,h4].map(x=>x.toString(16).padStart(8,'0')).join(''); }
export function short(id:string):string { return id.slice(0,7); }
export function cloneRepo(r:RepoState):RepoState { return structuredClone(r); }
export function treeId(files:FileMap, objects:Record<string,GitObject>):string { const entries=Object.keys(files).sort().map(p=>`${p}\0${files[p]}`).join('\n'); const id=oid(`tree ${entries}`); objects[id]={id,type:'tree',content:entries}; return id; }
export function commitId(tree:string, parents:string[], message:string, author:string, timestamp:number):string { return oid(`commit\0${tree}\0${parents.join(',')}\0${author}\0${timestamp}\0${message}`); }
export function recordRef(r:RepoState, ref:string, oldId:string, newId:string, message:string){ (r.reflogs[ref]??=[]).unshift({oldId,newId,ref,message,timestamp:Date.now()}); }
export function currentCommit(r:RepoState):string { return r.detached ? r.head : (r.refs[`heads/${r.branch}`]??''); }
export function currentFiles(r:RepoState):FileMap { return {...r.files}; }
export function commitTreeFiles(r:RepoState, tree:string):FileMap {
  const obj=r.objects[tree];
  if(!obj || obj.type!=='tree' || !obj.content) return {};
  const files:FileMap={};
  for(const line of obj.content.split('\n')){
    if(!line) continue;
    const i=line.indexOf('\0');
    if(i>=0) files[line.slice(0,i)]=line.slice(i+1);
  }
  return files;
}
export function headFiles(r:RepoState):FileMap {
  const id=currentCommit(r);
  if(!id) return {};
  const c=r.commits[id];
  return c ? commitTreeFiles(r,c.tree) : {};
}
export function createCommit(r:RepoState,message:string,author='GitNovi Learner'):string { const tree=treeId(r.index,r.objects); const parent=currentCommit(r); const ts=Date.now(); const id=commitId(tree,parent?[parent]:[],message,author,ts); r.objects[id]={id,type:'commit',content:JSON.stringify({tree,parents:parent?[parent]:[],message,author,timestamp:ts})}; r.commits[id]={id,tree,parentIds:parent?[parent]:[],message,author,timestamp:ts}; const ref=r.detached?'HEAD':`heads/${r.branch}`; const old=currentCommit(r); if(r.detached){r.head=id;} else r.refs[ref]=id; recordRef(r,ref,old,id,`commit: ${message}`); r.files={...r.index}; r.index={}; return id; }
export function commitTree(r:RepoState, tree:string, parents:string[], message:string, author='GitNovi Learner'):string { const ts=Date.now(); const id=commitId(tree,parents,message,author,ts); r.objects[id]={id,type:'commit',content:JSON.stringify({tree,parents,message,author,timestamp:ts})}; r.commits[id]={id,tree,parentIds:parents,message,author,timestamp:ts}; return id; }
export function ancestorSet(r:RepoState,start:string):Set<string>{const s=new Set<string>(); const q=[start]; while(q.length){const x=q.pop()!; if(!x||s.has(x))continue; s.add(x); q.push(...(r.commits[x]?.parentIds??[]));} return s;}
export function commonAncestor(r:RepoState,a:string,b:string):string|undefined { const aa=ancestorSet(r,a); const q=[b]; while(q.length){const x=q.shift()!; if(aa.has(x))return x; q.push(...(r.commits[x]?.parentIds??[]));} }
export function checkoutCommitFiles(r:RepoState,id:string){const c=r.commits[id]; if(!c)return; const tree=r.objects[c.tree]; if(!tree)return; const files:FileMap={}; if(tree.content) for(const line of tree.content.split('\n')){if(!line)continue; const i=line.indexOf('\0'); files[line.slice(0,i)]=line.slice(i+1);} r.files={...files}; r.index={...files};}
