# Terminal
The terminal never executes host shell commands. Shell-like commands are handled by the virtual filesystem and Git commands are dispatched into `GitDispatcher`. Unsupported commands return an explicit educational message rather than crashing.
