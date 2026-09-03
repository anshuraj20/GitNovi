insert into course_modules(slug,title,level,description) values
('pre-git','Pre-Git',0,'Prerequisites for Git'),('beginner','Beginner',1,'Everyday Git fundamentals'),('intermediate','Intermediate',2,'Collaboration and recovery'),('advanced','Advanced',3,'Git internals and expert workflows')
on conflict(slug) do nothing;

insert into lessons(module_id,slug,title,objective,content,estimated_minutes,sort_order)
select id,'files-folders','Files, folders and paths','Understand the filesystem vocabulary Git relies on.','Learn files, directories, absolute paths, relative paths, working directories, hidden files and why Git needs precise path identity.',12,1 from course_modules where slug='pre-git'
on conflict(slug) do nothing;
insert into lessons(module_id,slug,title,objective,content,estimated_minutes,sort_order)
select id,'command-line','Command line and shells','Use a terminal confidently before learning Git.','Understand terminals, shells, arguments, standard output, standard error, exit status and safe virtual shell practice.',15,2 from course_modules where slug='pre-git'
on conflict(slug) do nothing;
insert into lessons(module_id,slug,title,objective,content,estimated_minutes,sort_order)
select id,'version-control','Why version control exists','Understand snapshots, history and collaboration.','Version control records project history so changes can be compared, reviewed, shared and recovered. Git is distributed.',15,3 from course_modules where slug='pre-git'
on conflict(slug) do nothing;
insert into lessons(module_id,slug,title,objective,content,estimated_minutes,sort_order)
select id,'git-vs-hosting','Git vs GitHub','Separate Git from Git hosting platforms.','Git is the version-control system. GitHub, GitLab and Bitbucket are hosting and collaboration platforms built around Git workflows.',10,4 from course_modules where slug='pre-git'
on conflict(slug) do nothing;

insert into lessons(module_id,slug,title,objective,content,estimated_minutes,sort_order)
select id,'mental-model','The Git mental model','Understand working tree, index, repository and HEAD.','Separate the working tree from the index and object database. A commit points to a tree snapshot and parent commit(s).',18,1 from course_modules where slug='beginner'
on conflict(slug) do nothing;
insert into lessons(module_id,slug,title,objective,content,estimated_minutes,sort_order)
select id,'init-status','git init and git status','Create repositories and inspect state.','Initialize a repository and read branch, staged, unstaged and untracked state.',15,2 from course_modules where slug='beginner'
on conflict(slug) do nothing;
insert into lessons(module_id,slug,title,objective,content,estimated_minutes,sort_order)
select id,'staging-commits','Staging and commits','Turn changes into durable history.','git add chooses content for the next snapshot. git commit creates a new commit object from the index.',20,3 from course_modules where slug='beginner'
on conflict(slug) do nothing;
insert into lessons(module_id,slug,title,objective,content,estimated_minutes,sort_order)
select id,'branches','Branches and switching','Create and navigate branch pointers.','Branches are movable references to commits. Learn branch creation, switching and detached HEAD.',18,4 from course_modules where slug='beginner'
on conflict(slug) do nothing;

insert into lessons(module_id,slug,title,objective,content,estimated_minutes,sort_order)
select id,'remotes','Remotes and tracking branches','Understand origin, fetch, push and pull.','A remote names another repository. Fetch updates remote-tracking refs; push transfers objects and updates remote refs when allowed.',20,1 from course_modules where slug='intermediate'
on conflict(slug) do nothing;
insert into lessons(module_id,slug,title,objective,content,estimated_minutes,sort_order)
select id,'merge-conflicts','Merge and conflict resolution','Resolve divergent histories safely.','Understand fast-forward and three-way merges, conflict markers, merge state and abort/retry workflows.',25,2 from course_modules where slug='intermediate'
on conflict(slug) do nothing;
insert into lessons(module_id,slug,title,objective,content,estimated_minutes,sort_order)
select id,'rebase','Rebase safely','Understand replayed commits and conflict recovery.','Rebase copies commits onto a new base and rewrites commit IDs. Learn continue, skip and abort.',25,3 from course_modules where slug='intermediate'
on conflict(slug) do nothing;
insert into lessons(module_id,slug,title,objective,content,estimated_minutes,sort_order)
select id,'recovery','Reset, revert and reflog','Recover from common mistakes.','Compare reset and revert and use reflog to recover local reference movements.',22,4 from course_modules where slug='intermediate'
on conflict(slug) do nothing;

insert into lessons(module_id,slug,title,objective,content,estimated_minutes,sort_order)
select id,'objects','Git object database','Inspect blobs, trees and commits.','Git stores content-addressed objects. Blobs store file contents, trees map names to object IDs, and commits connect snapshots.',30,1 from course_modules where slug='advanced'
on conflict(slug) do nothing;
insert into lessons(module_id,slug,title,objective,content,estimated_minutes,sort_order)
select id,'refs-reflogs','Refs, HEAD and reflogs','Understand references and recovery data.','Study refs/heads, refs/remotes, HEAD and reflogs as the moving pointers that make Git history navigable.',25,2 from course_modules where slug='advanced'
on conflict(slug) do nothing;
insert into lessons(module_id,slug,title,objective,content,estimated_minutes,sort_order)
select id,'plumbing','Git plumbing commands','Use low-level commands to inspect and construct history.','Explore cat-file, hash-object, ls-tree, rev-parse, rev-list, update-ref, write-tree and commit-tree.',30,3 from course_modules where slug='advanced'
on conflict(slug) do nothing;
insert into lessons(module_id,slug,title,objective,content,estimated_minutes,sort_order)
select id,'worktrees-sparse','Worktrees and sparse checkout','Work efficiently in large repositories.','Use multiple worktrees and sparse checkout concepts to reduce context switching and working-set size.',25,4 from course_modules where slug='advanced'
on conflict(slug) do nothing;
insert into lessons(module_id,slug,title,objective,content,estimated_minutes,sort_order)
select id,'maintenance','Packfiles and repository maintenance','Understand storage and performance.','Learn loose objects, packfiles, reachability, gc, repack, commit graphs and maintenance.',30,5 from course_modules where slug='advanced'
on conflict(slug) do nothing;

insert into achievements(id,title,description) values
('first-lesson','First Lesson','Complete your first lesson'),('first-commit','First Commit','Create a commit in the terminal'),('branch-explorer','Branch Explorer','Create and switch branches'),('merge-master','Merge Master','Complete a merge challenge'),('rebase-apprentice','Rebase Apprentice','Complete a rebase challenge'),('recovery-expert','Recovery Expert','Recover work with reflog'),('internals-explorer','Git Internals Explorer','Inspect Git objects'),('terminal-warrior','Terminal Warrior','Complete five terminal challenges'),('streak-7','7 Day Streak','Learn for seven consecutive days'),('streak-30','30 Day Streak','Learn for thirty consecutive days'),('course-complete','Course Completed','Complete all required learning')
on conflict(id) do nothing;

insert into terminal_challenges(slug,title,level,instructions) values
('first-commit','First Commit','beginner','Initialize a repository, create a file, stage it, and commit it.'),
('conflict-solver','Conflict Solver','intermediate','Create divergent branches and resolve a merge conflict.'),
('reflog-rescue','Reflog Rescue','advanced','Recover a commit after a destructive reset.'),
('object-detective','Object Detective','advanced','Inspect the objects behind a revision.')
on conflict(slug) do nothing;
