export type TerminalLine={input?:string;output:string;error?:boolean};
export function prompt(branch:string, cwd='/'):string{return `learner@gitnovi:${cwd} (${branch})$`;}
