import { RepoState, emptyRepo } from './core';
import { runShell, Result } from './commands';
export class GitDispatcher { state:RepoState; history:string[]=[]; constructor(state=emptyRepo()){this.state=state;} execute(input:string):Result{const r=runShell(input,this.state);this.state=r.state;this.history.unshift(input);return r;} reset(){this.state=emptyRepo();this.history=[];} }
