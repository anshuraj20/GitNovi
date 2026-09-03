// lib/course/courseCatalog.ts – Complete GitNovi Course Curriculum (72 Lessons)
// 10 Pre-Git Foundations + 16 Beginner + 16 Intermediate + 30 Advanced Commands

export type LessonContent = {
  summary?: string;
  why?: string;
  example?: string;
  command?: string;
  practice?: string;
  commonMistake?: string;
};

export type CourseLesson = {
  id: string;
  slug: string;
  title: string;
  objective: string;
  estimated_minutes: number;
  completed?: boolean;
  content: LessonContent;
};

export type CourseModuleData = {
  id: string;
  slug: 'pre-git' | 'beginner' | 'intermediate' | 'advanced';
  title: string;
  level: number;
  description: string;
  lessons: CourseLesson[];
};

export const courseCatalog: Record<string, CourseModuleData> = {
  // =========================================================================
  // PRE-GIT FOUNDATIONS (10 Lessons)
  // =========================================================================
  'pre-git': {
    id: '00000000-0000-4000-8000-000000000001',
    slug: 'pre-git',
    title: 'Pre-Git Foundations',
    level: 0,
    description: 'Master the filesystem, terminal shells, CLI navigation, and core mental models before writing your first Git command.',
    lessons: [
      {
        id: '10000000-0000-4000-8000-000000000001',
        slug: "files-and-directories",
        title: "Filesystems, Directory Trees & Path Resolution",
        objective: "Master how operating systems structure directories into trees, and understand absolute vs relative paths.",
        estimated_minutes: 12,
        content: {
          summary: "Operating systems organize data into an inverted tree structure starting from the root directory (\"/\" on Unix/macOS or \"C:\\\" on Windows). Every file and directory has a unique location represented by either an absolute path (from the root) or a relative path (from where your terminal is currently sitting). Git relies entirely on exact path identities to track files, detect renames, and stage changes.",
          why: "Git operates strictly on the filesystem. If you do not understand where your terminal is currently located or the difference between \"../src\" and \"./src\", you will accidentally initialize repositories in the wrong folder, stage unintended files, or lose track of your project structure.",
          command: "pwd && ls -la",
          example: "Absolute path: /home/alex/projects/gitnovi/src/index.ts\nRelative path: ./src/index.ts (if in /home/alex/projects/gitnovi)\nParent directory: ../other-folder\nHome shorthand: ~/projects",
          practice: "1. Print your current working directory using pwd.\n2. Identify the absolute path to your current folder.\n3. List all files including hidden system entries with ls -la.\n4. Note how \".\" refers to current directory and \"..\" refers to parent directory.",
          commonMistake: "Typing \"/folder\" (which looks in the system root) when you intended \"folder\" or \"./folder\" (which looks in your current directory)."
        }
      },
      {
        id: '10000000-0000-4000-8000-000000000002',
        slug: "terminal-and-shell",
        title: "The Terminal, Shells & CLI Mechanics",
        objective: "Understand terminal emulators, shell engines (Bash/Zsh/PowerShell), prompts, command syntax, flags, and exit codes.",
        estimated_minutes: 15,
        content: {
          summary: "The terminal is the window application (like VS Code Terminal, iTerm, or Windows Terminal), while the shell (Bash, Zsh, PowerShell) is the underlying program that interprets your typed commands. Commands follow a standard anatomy: \"command [flags/options] [arguments]\". Every executed command returns a numeric exit code (0 means success; non-zero means an error occurred).",
          why: "Git was built natively for the command line. While graphical user interfaces (GUIs) exist, professional developers and automated CI/CD pipelines communicate with Git via CLI commands. Mastering command syntax, flags, and arguments ensures you can diagnose errors and work in any environment.",
          command: "echo \"Active Shell:\" $SHELL && which git",
          example: "Command Anatomy:\ngit        commit     -m        \"Initial commit\"\n[program]  [command]  [flag]    [argument string]\n\nExit Status Check:\necho $?  # Returns 0 if the previous command succeeded",
          practice: "1. Run \"echo $SHELL\" to check which shell you are running.\n2. Run a command with both a short flag (e.g. ls -a) and a long flag (e.g. ls --all).\n3. Check the exit status of the previous command with \"echo $?\".\n4. Type a command with intentional typo (e.g. \"gitt\") and observe the non-zero exit code.",
          commonMistake: "Adding accidental spaces around flags or equals signs (e.g. typing \"git config user.name = Alex\" instead of \"git config user.name Alex\")."
        }
      },
      {
        id: '10000000-0000-4000-8000-000000000003',
        slug: "cli-navigation",
        title: "Core Filesystem Navigation (pwd, ls, cd)",
        objective: "Navigate complex directory trees effortlessly using cd, relative shortcuts (., .., ~), and detailed listing flags.",
        estimated_minutes: 15,
        content: {
          summary: "Navigation is the most frequent action in a terminal. \"pwd\" prints your working directory. \"ls\" displays files, with essential flags: \"-l\" (long listing showing permissions, size, owner, timestamp), \"-a\" (all files including hidden dotfiles), and \"-h\" (human-readable file sizes). \"cd\" changes your location using relative paths (\"cd ..\" moves up one level, \"cd -\" switches back to your previous location).",
          why: "Before running any Git command (like git init, git add, or git status), you must be in the correct directory. Moving between directories quickly and confidently in the CLI is an indispensable prerequisite.",
          command: "pwd && cd .. && ls -lh && cd -",
          example: "cd ~              # Jump to user home directory\ncd ~/projects     # Jump to projects inside home\ncd ..             # Go up to parent folder\ncd ../..          # Go up two folder levels\ncd -              # Jump back to previous directory",
          practice: "1. Open your terminal and check your current path with pwd.\n2. Navigate up two folder levels with cd ../..\n3. List all files with sizes using ls -lh.\n4. Return immediately to where you started using cd -.",
          commonMistake: "Forgetting the space in \"cd ..\" (typing \"cd..\" which fails in Bash/Zsh) or getting lost after multiple directory changes."
        }
      },
      {
        id: '10000000-0000-4000-8000-000000000004',
        slug: "cli-file-ops",
        title: "File Creation, Viewing & Redirection (mkdir, touch, cat, echo)",
        objective: "Create directories, instantiate files, write data via stream redirection, and inspect file contents from the CLI.",
        estimated_minutes: 18,
        content: {
          summary: "\"mkdir\" creates new folders (use \"mkdir -p\" to generate entire nested directory trees in one shot). \"touch\" creates blank files or updates timestamps. \"cat\" prints entire file contents to the terminal. \"echo\" outputs text, which can be redirected to files using \">\" (overwrite) or \">>\" (append).",
          why: "When building software with Git, you constantly create new modules, configuration files, and documentation. Doing this directly in the terminal without constantly switching to a mouse or file manager makes you significantly faster.",
          command: "mkdir -p project/src && touch project/src/app.js && echo \"console.log('Ready');\" > project/src/app.js && cat project/src/app.js",
          example: "mkdir -p src/components\ntouch src/components/Header.tsx\necho \"export const Header = () => <h1>Header</h1>;\" > src/components/Header.tsx\ncat src/components/Header.tsx",
          practice: "1. Create a nested folder structure: mkdir -p demo/scripts\n2. Create a file demo/scripts/main.py using touch.\n3. Write a line of code into it using echo \"print('Hello GitNovi')\" > demo/scripts/main.py.\n4. Verify its content using cat demo/scripts/main.py.",
          commonMistake: "Using \">\" (which completely wipes and overwrites the target file) when you intended to use \">>\" (which appends new lines to the end)."
        }
      },
      {
        id: '10000000-0000-4000-8000-000000000005',
        slug: "file-deletion-safety",
        title: "Moving, Renaming, Deleting & CLI Safety (mv, cp, rm, dotfiles)",
        objective: "Copy, move, rename, and safely delete files, and understand why hidden dotfiles (.git, .env) exist.",
        estimated_minutes: 15,
        content: {
          summary: "\"mv\" moves or renames files. \"cp\" copies files (use \"cp -r\" for directories). \"rm\" deletes files (use \"rm -r\" for directories). Files starting with a dot (e.g. .git, .env, .gitignore) are hidden by default in operating systems so they do not clutter normal views. Note that terminal deletion with \"rm\" is immediate and permanent (it bypasses the OS Recycle Bin/Trash).",
          why: "Understanding that .git is just a hidden folder inside your project directory removes the mystery of how Git stores data. Furthermore, understanding CLI deletion safety prevents catastrophic accidental loss of work.",
          command: "cp file.txt copy.txt && mv copy.txt renamed.txt && rm renamed.txt",
          example: "cp -r src src-backup       # Copy entire folder recursively\nmv old-name.js new-name.js  # Rename file in place\nrm -rf temp-folder         # Forcefully and recursively delete folder (CAUTION!)",
          practice: "1. Create a dummy folder with mkdir test-dir and a file touch test-dir/test.txt.\n2. Copy the file: cp test-dir/test.txt test-dir/backup.txt.\n3. Rename the copy: mv test-dir/backup.txt test-dir/final.txt.\n4. Clean up safely: rm -r test-dir.",
          commonMistake: "Running \"rm -rf *\" in the wrong directory and permanently wiping files without any possibility of recovery."
        }
      },
      {
        id: '10000000-0000-4000-8000-000000000006',
        slug: "file-inspection-paging",
        title: "Paging & Text Searching (less, head, tail, grep)",
        objective: "Inspect large files without crashing the terminal using pagers (less) and search codebase content with grep.",
        estimated_minutes: 15,
        content: {
          summary: "When files or Git logs are hundreds of lines long, running \"cat\" floods your terminal screen. Pagers like \"less\" allow comfortable scrolling line-by-line (arrow keys or j/k), page-by-page (spacebar), searching (\"/pattern\"), and exiting with \"q\". \"head -n 10\" views the top 10 lines; \"tail -n 10\" views the bottom 10 lines. \"grep -rn\" searches for matching text patterns across files.",
          why: "Git commands like \"git log\", \"git diff\", and \"git show\" automatically pipe their output into \"less\" whenever the output exceeds the terminal height. Knowing how to navigate and exit \"less\" prevents the classic beginner panic of being \"stuck\" in a terminal.",
          command: "head -n 5 package.json && grep -rn \"dependencies\" .",
          example: "less long-log.txt   # Opens pager: use Space to scroll, \"q\" to exit\ngrep -rn \"TODO\" src/  # Search for \"TODO\" recursively with line numbers in src/",
          practice: "1. Create a 20-line test file using multiple echo statements.\n2. View the first 5 lines with head -n 5.\n3. View the last 5 lines with tail -n 5.\n4. Open the file in less, search for a word by typing /word, and exit by pressing q.",
          commonMistake: "Pressing Ctrl+C repeatedly when stuck in a terminal pager like less; the standard key to exit less is \"q\"."
        }
      },
      {
        id: '10000000-0000-4000-8000-000000000007',
        slug: "vcs-mental-model",
        title: "The Version Control Paradigm: Snapshots vs Zip Backups",
        objective: "Understand why manual backups fail and how version control creates an immutable, verifiable history graph.",
        estimated_minutes: 18,
        content: {
          summary: "Before Version Control Systems (VCS), developers saved manual copies of code (\"project_v1.zip\", \"project_final_fixed.zip\"). This caused fatal problems: no record of why changes were made, no attribution of author, no way to safely merge concurrent work from two developers, and high risk of overwriting files. A modern VCS records every state as an immutable snapshot connected in a timeline graph.",
          why: "Understanding that Git is an immutable graph of project snapshots—not just a backup tool—is the fundamental mental model needed to master branching, merging, rebasing, and recovery.",
          command: "echo \"Immutable Snapshot Graph > Duplicate Zip Folders\"",
          example: "Manual Folder Backup: Duplicate entire 500MB folder 10 times = 5GB disk waste.\nGit Version Control: Stores only unique content objects indexed by cryptographic hashes.",
          practice: "1. Reflect on manual backups like \"project_v2_final.zip\".\n2. Explain why storing complete directory clones wastes storage compared to content-addressed objects.\n3. Identify why tracking author attribution and commit messages prevents team confusion.\n4. Understand the concept of an immutable snapshot.",
          commonMistake: "Treating Git like an automatic cloud autosave (like Google Docs); Git requires explicit, deliberate commits that group related changes together."
        }
      },
      {
        id: '10000000-0000-4000-8000-000000000008',
        slug: "centralized-vs-distributed",
        title: "Centralized vs Distributed Version Control Systems",
        objective: "Understand the architectural differences between CVCS (SVN/CVS) and DVCS (Git/Mercurial).",
        estimated_minutes: 15,
        content: {
          summary: "In Centralized VCS (CVCS like Subversion or Perforce), a single central server holds the entire history. Developers checkout only a single snapshot; creating branches or committing requires constant server connectivity. In Distributed VCS (DVCS like Git), every single clone on every developer machine is a full-fledged repository containing the complete project history, all branches, and all historical snapshots.",
          why: "Because Git is distributed, all operations (committing, branching, viewing logs, diffing, resetting) execute locally in milliseconds on your disk with zero network latency. If a central server goes offline, any developer clone can serve as a full recovery backup.",
          command: "git --version",
          example: "Centralized (SVN): Internet down -> Cannot commit, cannot branch, cannot inspect history.\nDistributed (Git): Full offline capability. Commit, branch, merge locally; sync with teammates when online.",
          practice: "1. Verify your Git CLI version with git --version.\n2. Consider why working offline is a huge advantage for speed and developer freedom.\n3. Explain what happens if a remote central server crashes when using a distributed VCS vs a centralized VCS.\n4. Note that every Git clone contains the complete historical object database.",
          commonMistake: "Assuming you need an active internet connection to create branches, make commits, or inspect past history in Git."
        }
      },
      {
        id: '10000000-0000-4000-8000-000000000009',
        slug: "git-vs-github",
        title: "Git vs GitHub, GitLab & Remote Platforms",
        objective: "Distinguish clearly between the local Git software and cloud hosting platforms.",
        estimated_minutes: 15,
        content: {
          summary: "Git is an open-source command-line tool created by Linus Torvalds in 2005 that runs locally on your machine to track revisions. GitHub (owned by Microsoft), GitLab, and Bitbucket are cloud hosting platforms that store remote copies of Git repositories on the internet and provide web UIs, Pull Requests/Merge Requests, issue tracking, and CI/CD pipelines.",
          why: "Beginners frequently conflate Git with GitHub, leading to confusion about account requirements, privacy, and command execution. You can build entire commercial software systems using Git locally without ever creating a GitHub account.",
          command: "echo \"Git = Local Engine; GitHub = Cloud Collaboration Platform\"",
          example: "Local Machine: Runs \"git init\", \"git commit\", \"git rebase\"\nCloud Server (GitHub): Receives \"git push\", displays Pull Request UI, runs automated test actions.",
          practice: "1. Explain the difference between running a git commit locally vs performing a git push to GitHub.\n2. Explain what a Pull Request is in relation to Git branches.\n3. Understand why a private company can host their own Git server without using GitHub.\n4. Confirm that Git is the CLI software installed on your machine.",
          commonMistake: "Believing that creating a commit automatically uploads code to GitHub (you must explicitly run git push)."
        }
      },
      {
        id: '10000000-0000-4000-8000-000000000010',
        slug: "environment-editors",
        title: "Environment Setup & Text Editors for Git",
        objective: "Configure your text editor and terminal environment for seamless Git commit authoring.",
        estimated_minutes: 15,
        content: {
          summary: "When Git requires you to write a commit message, resolve a merge conflict, or perform an interactive rebase, it opens your configured terminal text editor (such as VS Code, nano, or vim). Knowing how to configure and interact with your editor ensures you never get blocked during interactive Git operations.",
          why: "If Git opens a default editor like Vim unexpectedly during a commit or merge, beginners often get stuck because Vim uses modal editing. Setting your preferred editor (like VS Code or nano) creates a smooth, frictionless learning experience.",
          command: "git config --global core.editor \"code --wait\" # (or \"nano\")",
          example: "To set VS Code as Git editor:\ngit config --global core.editor \"code --wait\"\n\nTo set Nano as Git editor:\ngit config --global core.editor \"nano\"",
          practice: "1. Decide which editor you prefer for writing code and commit messages.\n2. Configure Git core.editor to your preferred editor.\n3. Verify the setting using git config --global core.editor.\n4. Test opening a sample file from your terminal with your configured editor.",
          commonMistake: "Leaving the editor unconfigured on systems where Vim is default, and not knowing how to save and exit (in Vim: press Esc, type :wq, and press Enter)."
        }
      }
    ]
  },

  // =========================================================================
  // BEGINNER GIT FUNDAMENTALS (16 Commands)
  // =========================================================================
  'beginner': {
    id: '00000000-0000-4000-8000-000000000002',
    slug: 'beginner',
    title: 'Beginner Git Fundamentals',
    level: 1,
    description: 'Master all 16 core everyday Git commands: configuration, initialization, cloning, staging, committing, inspecting history, diffs, and branching.',
    lessons: [
      {
        id: '20000000-0000-4000-8000-000000000001',
        slug: "git-config",
        title: "Configuring Identity, Editors & Aliases (git config)",
        objective: "Set up author name, email, default branch names, and custom CLI aliases.",
        estimated_minutes: 12,
        content: {
          summary: "Git embeds author information (user.name and user.email) immutably into every commit object. In addition, you can set default branch names (init.defaultBranch main), diff tools, and create custom shortcuts/aliases.",
          why: "Proper commit attribution is critical on team projects. Clean aliases (like \"git st\" for \"git status\") accelerate everyday development.",
          command: "git config --global user.name \"Your Name\" && git config --global user.email \"you@example.com\"",
          example: "git config --global init.defaultBranch main\ngit config --global alias.st status\ngit config --list --show-origin",
          practice: "1. List existing configurations with git config --list.\n2. Set your global name and email.\n3. Configure default branch to main.\n4. Create a custom alias: git config --global alias.br branch.",
          commonMistake: "Leaving email unconfigured, causing commits to be credited to a local system account."
        }
      },
      {
        id: '20000000-0000-4000-8000-000000000002',
        slug: "git-init",
        title: "Initializing Repositories (.git Metadata Directory)",
        objective: "Initialize a new Git repository and understand the internal structure of .git.",
        estimated_minutes: 12,
        content: {
          summary: "\"git init\" creates a hidden .git directory containing the object database (.git/objects), ref pointers (.git/refs), the HEAD pointer, configuration settings (.git/config), and the staging index file (.git/index).",
          why: "Transforms any standard directory into a fully functional, self-contained Git repository capable of tracking changes and branching.",
          command: "git init my-project && cd my-project",
          example: "mkdir my-app && cd my-app\ngit init\n# Initialized empty Git repository in /my-app/.git/",
          practice: "1. Create a directory named \"git-lab\" and enter it.\n2. Run git init to initialize repository tracking.\n3. List hidden files with ls -la to verify .git/.\n4. Run git status to verify initial clean branch state.",
          commonMistake: "Running \"git init\" inside a subfolder of an already initialized Git repository."
        }
      },
      {
        id: '20000000-0000-4000-8000-000000000003',
        slug: "git-clone",
        title: "Cloning Remote Repositories (git clone)",
        objective: "Download full remote repositories, establishing origin remotes and local tracking branches.",
        estimated_minutes: 15,
        content: {
          summary: "\"git clone <url>\" creates a local copy of an entire remote repository, downloading all commit history, tags, and branches, while configuring an \"origin\" remote pointing to the source URL.",
          why: "The universal starting point when joining existing open-source projects or enterprise company codebases.",
          command: "git clone https://github.com/org/repo.git",
          example: "git clone https://github.com/facebook/react.git\ngit clone git@github.com:org/app.git local-folder\ngit clone --depth 1 https://github.com/org/huge-repo.git",
          practice: "1. Clone a sample repository from a remote URL.\n2. Navigate into the cloned directory and check remotes with git remote -v.\n3. Inspect commit history with git log --oneline -n 5.\n4. Check working tree status with git status.",
          commonMistake: "Cloning a repository inside an existing Git repository, creating unmanaged nested repositories."
        }
      },
      {
        id: '20000000-0000-4000-8000-000000000004',
        slug: "git-status",
        title: "Inspecting Repository State & The Index (git status)",
        objective: "Inspect tracked, untracked, staged, and modified files in the working tree.",
        estimated_minutes: 12,
        content: {
          summary: "\"git status\" compares the working tree on disk against the staging area (index) and the latest commit (HEAD). It categorizes files into Untracked, Changes not staged for commit, and Changes to be committed.",
          why: "The most frequently run command in Git. It prevents accidental commits of secret tokens, debug logs, or unstaged files.",
          command: "git status -sb",
          example: "git status\n# Shows branch, staged files in green, unstaged in red\n\ngit status -s  # Short format: ?? untracked, M modified, A added",
          practice: "1. Create a new file touch index.html and run git status.\n2. Stage it with git add index.html and observe the status change.\n3. Modify index.html again and observe both staged and unstaged states simultaneously.\n4. Try the short format git status -s.",
          commonMistake: "Committing without checking git status first, leading to missed files or committing secret API keys."
        }
      },
      {
        id: '20000000-0000-4000-8000-000000000005',
        slug: "git-add",
        title: "Staging Area Mechanics & Patch Staging (git add)",
        objective: "Stage file modifications, directories, and specific hunks into the index.",
        estimated_minutes: 15,
        content: {
          summary: "\"git add\" copies file contents from the working directory into the object database as blobs and updates the .git/index file. The staging area acts as a precise pre-commit buffer.",
          why: "Allows you to craft focused, atomic commits by staging only relevant modifications rather than dumping all unstaged edits into a single messy commit.",
          command: "git add . # or git add -p",
          example: "git add README.md src/\ngit add -A          # Stage all modified, deleted, and untracked files\ngit add -p          # Interactively stage specific hunks (patches)",
          practice: "1. Create three files: file1.txt, file2.txt, file3.txt.\n2. Stage only file1.txt and file2.txt using git add.\n3. Verify that file3.txt remains untracked in git status.\n4. Practice interactive staging using git add -p on a multi-line file.",
          commonMistake: "Running \"git add .\" blindly without checking git status, staging node_modules, build artifacts, or credentials."
        }
      },
      {
        id: '20000000-0000-4000-8000-000000000006',
        slug: "git-commit",
        title: "Recording Snapshots & Authoring Commits (git commit)",
        objective: "Create permanent, immutable commit objects with structured messages and metadata.",
        estimated_minutes: 15,
        content: {
          summary: "A commit is an immutable object pointing to a tree snapshot, containing author metadata, committer timestamp, parent commit SHA(s), and a log message.",
          why: "Commits are the building blocks of Git history. Well-structured atomic commits make code reviews, rollbacks, and bug bisecting effortless.",
          command: "git commit -m \"feat: add user authentication\"",
          example: "git commit -m \"docs: update API endpoints\"\ngit commit -am \"fix: typo in header\"  # Auto-stage tracked modified files\ngit commit --amend -m \"feat: updated message\"",
          practice: "1. Stage modified files with git add.\n2. Commit with a clear imperative message: git commit -m \"feat: setup navbar\".\n3. Inspect the created commit SHA with git log -1.\n4. Amend the commit message using git commit --amend.",
          commonMistake: "Writing vague messages like \"fixed stuff\" or \"changes\", which ruins repository changelogs and debugging."
        }
      },
      {
        id: '20000000-0000-4000-8000-000000000007',
        slug: "git-log",
        title: "Exploring Commit Graphs & History (git log)",
        objective: "Inspect project history, branch topology, author filters, and visual DAG graphs.",
        estimated_minutes: 15,
        content: {
          summary: "\"git log\" traverses the commit DAG backwards from HEAD through parent pointers. Flags like \"--graph\", \"--oneline\", and \"--all\" format the history into an understandable visual timeline.",
          why: "Understanding historical changes, identifying when features were introduced, and tracing branch merge topology.",
          command: "git log --oneline --graph --decorate --all",
          example: "git log -n 5                           # Show last 5 commits\ngit log --oneline --graph --all        # Visual ASCII branch graph\ngit log --author=\"Alex\" --since=\"2 weeks ago\"",
          practice: "1. Run git log to view full commit headers.\n2. Run git log --oneline to view compact SHA and message summaries.\n3. View a colored branch graph: git log --graph --oneline --decorate --all.\n4. Filter commits by author or file path: git log -p README.md.",
          commonMistake: "Getting stuck in the terminal pager when logs are long; press \"q\" to exit less."
        }
      },
      {
        id: '20000000-0000-4000-8000-000000000008',
        slug: "git-diff",
        title: "Inspecting Line-by-Line Changes (git diff)",
        objective: "Compare working tree vs staging area, staging area vs HEAD, and differences between commits.",
        estimated_minutes: 15,
        content: {
          summary: "\"git diff\" shows exact line-by-line additions (+) and deletions (-). \"git diff\" compares Working Tree vs Index; \"git diff --cached\" (or --staged) compares Index vs HEAD; \"git diff commitA commitB\" compares two snapshots.",
          why: "Code verification before staging or committing prevents logic regressions and unintended debug statements from reaching the repository.",
          command: "git diff && git diff --staged",
          example: "git diff                 # Working tree vs Staging area\ngit diff --staged        # Staged changes vs latest commit\ngit diff main feature/login # Diff between two branches\ngit diff --stat          # Summary of files changed and line counts",
          practice: "1. Edit a tracked file and run git diff to inspect unstaged lines.\n2. Stage the file with git add and run git diff (it will be empty).\n3. Run git diff --staged to see your staged modifications.\n4. Compare two commit SHAs with git diff SHA1 SHA2.",
          commonMistake: "Running \"git diff\" and thinking you have no changes because your changes are already staged (use git diff --staged)."
        }
      },
      {
        id: '20000000-0000-4000-8000-000000000009',
        slug: "git-show",
        title: "Inspecting Objects & Specific Commits (git show)",
        objective: "Examine commit metadata, patch diffs, annotated tags, and internal Git objects.",
        estimated_minutes: 12,
        content: {
          summary: "\"git show <object>\" displays the metadata and patch diff of a specific commit, the message and signature of a tag, or the raw content of any blob in history.",
          why: "Allows targeted inspection of specific commits without wading through the entire commit log.",
          command: "git show HEAD # or git show <commit-sha>",
          example: "git show HEAD              # Show latest commit info and diff\ngit show a1b2c3d           # Show specific commit\ngit show v1.0.0            # Show annotated tag details\ngit show HEAD:package.json # View historical file content at HEAD",
          practice: "1. Run git show to inspect the latest commit on your branch.\n2. Copy an earlier commit SHA from git log and inspect it with git show <sha>.\n3. View a file as it existed in a past commit: git show HEAD~1:README.md.\n4. Inspect an annotated release tag with git show v1.0.",
          commonMistake: "Confusing \"git show\" (which inspects one object/commit) with \"git log\" (which traverses historical commit chains)."
        }
      },
      {
        id: '20000000-0000-4000-8000-000000000010',
        slug: "git-restore",
        title: "Discarding Working Tree Changes & Unstaging (git restore)",
        objective: "Safely unstage files from the index and discard working tree modifications.",
        estimated_minutes: 15,
        content: {
          summary: "Introduced in Git 2.23 to replace the overloaded \"git checkout\", \"git restore\" explicitly restores files. \"git restore <file>\" discards working tree edits; \"git restore --staged <file>\" un-stages files without losing disk edits.",
          why: "Provides a clean, dedicated syntax for undoing uncommitted changes without risking accidental branch switching.",
          command: "git restore <file> && git restore --staged <file>",
          example: "git restore src/app.js         # Discard unstaged changes in app.js\ngit restore --staged README.md # Unstage README.md (keeps disk changes)\ngit restore --source=HEAD~2 file.txt # Restore file from 2 commits ago",
          practice: "1. Modify a file and discard your unstaged edits with git restore <file>.\n2. Modify a file, stage it with git add, and unstage it with git restore --staged <file>.\n3. Verify with git status that your disk modifications are preserved.\n4. Restore a specific file from an earlier commit using --source.",
          commonMistake: "Running \"git restore <file>\" on unstaged work without realizing it permanently wipes disk modifications with no undo."
        }
      },
      {
        id: '20000000-0000-4000-8000-000000000011',
        slug: "git-rm",
        title: "Removing Tracked Files (git rm)",
        objective: "Delete files from both the working tree and staging index, or stop tracking files without deleting on disk.",
        estimated_minutes: 12,
        content: {
          summary: "\"git rm\" deletes the file on disk and stages the deletion in the index in one step. Using \"--cached\" stops tracking the file in Git while keeping it on your local disk (essential for files accidentally committed before .gitignore).",
          why: "Ensures file removals are properly recorded in the Git index rather than showing up as missing unstaged files.",
          command: "git rm <file> # or git rm --cached <file>",
          example: "git rm old-file.txt           # Deletes on disk & stages removal\ngit rm -r build/              # Recursively delete and stage folder\ngit rm --cached .env          # Stop tracking .env but keep on local disk",
          practice: "1. Create a dummy file touch dummy.txt, stage, and commit it.\n2. Remove it using git rm dummy.txt and verify git status shows \"deleted: dummy.txt\".\n3. Create a secrets file touch secrets.env, commit it, and remove it from Git tracking with git rm --cached secrets.env.\n4. Verify that secrets.env still exists on your local disk.",
          commonMistake: "Deleting a file with the OS file manager and forgetting to stage the deletion (or using git rm without --cached on private config files)."
        }
      },
      {
        id: '20000000-0000-4000-8000-000000000012',
        slug: "git-mv",
        title: "Moving & Renaming Tracked Files (git mv)",
        objective: "Move or rename files and directories while automatically staging the rename in the index.",
        estimated_minutes: 10,
        content: {
          summary: "\"git mv <old> <new>\" renames or moves a file on disk and stages the deletion of the old path and addition of the new path in the index. Git detects renames automatically based on content similarity.",
          why: "Keeps your staging index clean and preserves commit history across file refactoring.",
          command: "git mv old-name.ts new-name.ts",
          example: "git mv utils.js helpers.js\ngit mv components/ src/components/\ngit mv -f file.txt File.txt  # Force case-sensitive rename on Windows/macOS",
          practice: "1. Create a file touch utils.ts, stage, and commit it.\n2. Rename it using git mv utils.ts helpers.ts.\n3. Run git status and observe \"renamed: utils.ts -> helpers.ts\".\n4. Commit the staged rename.",
          commonMistake: "Renaming files via GUI on case-insensitive filesystems (like macOS/Windows) causing Git to miss case-only renames (use git mv -f)."
        }
      },
      {
        id: '20000000-0000-4000-8000-000000000013',
        slug: "git-branch",
        title: "Branch Management & Inspection (git branch)",
        objective: "List, create, rename, copy, and delete local and remote-tracking branches.",
        estimated_minutes: 15,
        content: {
          summary: "A Git branch is a lightweight 41-byte pointer to a commit SHA stored in .git/refs/heads/. \"git branch\" lists local branches, \"-a\" lists all including remote-tracking branches, and \"-d\" deletes merged branches safely.",
          why: "Branching is the core superpower of Git, enabling isolated feature development, bug fixes, and parallel experimentation.",
          command: "git branch -a && git branch feature/login",
          example: "git branch                   # List local branches\ngit branch -a                # List local and remote branches\ngit branch feature/cart      # Create branch without switching\ngit branch -d feature/cart   # Safe delete (only if merged)\ngit branch -D feature/cart   # Force delete branch",
          practice: "1. List all existing branches with git branch -a.\n2. Create a new branch: git branch feature/search.\n3. Rename a branch: git branch -m feature/search feature/v2-search.\n4. Safely delete a branch after merging with git branch -d.",
          commonMistake: "Deleting an unmerged branch with -D without realizing unmerged commits become orphaned and may be garbage-collected."
        }
      },
      {
        id: '20000000-0000-4000-8000-000000000014',
        slug: "git-switch",
        title: "Modern Branch Navigation (git switch)",
        objective: "Switch between existing branches and create new branches with modern, dedicated syntax.",
        estimated_minutes: 12,
        content: {
          summary: "Introduced in Git 2.23 to separate branch switching from file restoration. \"git switch <name>\" moves HEAD to the specified branch. \"git switch -c <name>\" creates and switches to a new branch simultaneously.",
          why: "Replaces confusing multi-purpose \"git checkout\" syntax with clear, safe branch navigation.",
          command: "git switch -c feature/new-feature",
          example: "git switch main               # Switch to existing main branch\ngit switch -c feature/auth    # Create and switch to feature/auth\ngit switch -                  # Switch back to previous branch\ngit switch --detach HEAD~2   # Detach HEAD at specific commit",
          practice: "1. Create and switch to a feature branch: git switch -c feature/dashboard.\n2. Make a commit on this branch.\n3. Switch back to main with git switch main.\n4. Return immediately to your feature branch using git switch -.",
          commonMistake: "Switching branches with uncommitted conflicting edits in your working tree, causing Git to abort the switch."
        }
      },
      {
        id: '20000000-0000-4000-8000-000000000015',
        slug: "git-checkout",
        title: "Switching Branches & Checking Out Snapshots (git checkout)",
        objective: "Master classic branch switching, historical snapshot checkouts, and detached HEAD states.",
        estimated_minutes: 15,
        content: {
          summary: "\"git checkout\" is the classic Git command that moves HEAD to a branch tip or specific commit. When checking out a commit SHA directly, you enter a \"Detached HEAD\" state where commits are not attached to any named branch.",
          why: "Crucial for inspecting historical releases, reviewing past commit states, and maintaining legacy repositories.",
          command: "git checkout -b feature/auth # or git checkout <sha>",
          example: "git checkout -b feature/api   # Create and switch\ngit checkout main             # Switch to main\ngit checkout a1b2c3d          # Detached HEAD at commit SHA\ngit checkout v1.0.0           # Checkout release tag",
          practice: "1. Create and switch to a branch: git checkout -b feature/legacy.\n2. Check out a past commit SHA from git log to observe the Detached HEAD notice.\n3. Create a branch from your detached position: git checkout -b fix/from-detached.\n4. Return safely to main: git checkout main.",
          commonMistake: "Making new commits in a Detached HEAD state and switching branches without naming a branch, causing the new commits to become unreachable."
        }
      },
      {
        id: '20000000-0000-4000-8000-000000000016',
        slug: "git-help",
        title: "Accessing Built-In Manuals & Docs (git help)",
        objective: "Access detailed man pages, command guides, configuration references, and tutorials from the CLI.",
        estimated_minutes: 10,
        content: {
          summary: "\"git help <command>\" (or \"git <command> --help\") opens the comprehensive, official Git manual page for any command directly in your terminal or web browser.",
          why: "Provides offline access to exhaustive flag references, detailed descriptions, and edge-case documentation.",
          command: "git help <command> # or git help everyday",
          example: "git help commit              # Open man page for git commit\ngit log --help               # Open man page for git log\ngit help -g                  # List Git user guides\ngit help everyday            # Everyday Git in 20 commands tutorial",
          practice: "1. Open the manual page for git status with git help status.\n2. Search within the man page using \"/--short\" and navigate with n/N.\n3. Explore built-in guides with git help -g.\n4. Exit the man page pager by typing q.",
          commonMistake: "Relying solely on external internet searches when the official, version-matched manual is built directly into your terminal."
        }
      }
    ]
  },

  // =========================================================================
  // INTERMEDIATE GIT COLLABORATION (16 Commands)
  // =========================================================================
  'intermediate': {
    id: '00000000-0000-4000-8000-000000000003',
    slug: 'intermediate',
    title: 'Intermediate Git Collaboration',
    level: 2,
    description: 'Master all 16 collaboration and recovery commands: remotes, fetch, pull, push, merging, rebasing, stashing, cherry-picking, reflog, and bisecting.',
    lessons: [
      {
        id: '30000000-0000-4000-8000-000000000001',
        slug: "git-remote",
        title: "Managing Remote Repository Connections (git remote)",
        objective: "Add, inspect, rename, and manage connections to remote repositories like GitHub.",
        estimated_minutes: 15,
        content: {
          summary: "\"git remote\" manages the set of tracked remote repositories. \"git remote -v\" displays configured URLs. \"git remote add <name> <url>\" connects a local repository to GitHub, GitLab, or an internal server.",
          why: "Remote tracking allows distributed teams to share commits, push feature branches, and pull upstream improvements.",
          command: "git remote -v && git remote add origin <url>",
          example: "git remote add origin https://github.com/org/repo.git\ngit remote -v                     # Show fetch and push URLs\ngit remote rename origin upstream # Rename remote\ngit remote set-url origin git@github.com:org/repo.git",
          practice: "1. List existing remotes with git remote -v.\n2. Add a sample upstream remote: git remote add upstream https://github.com/example/repo.git.\n3. Inspect remote configuration with git remote show origin.\n4. Remove the dummy remote: git remote remove upstream.",
          commonMistake: "Accidentally using the wrong protocol (HTTP vs SSH) without configuring credentials or SSH keys."
        }
      },
      {
        id: '30000000-0000-4000-8000-000000000002',
        slug: "git-fetch",
        title: "Downloading Remote Updates Safely (git fetch)",
        objective: "Download objects and refs from remote repositories without altering your local working directory.",
        estimated_minutes: 15,
        content: {
          summary: "\"git fetch\" downloads all new commits, branches, and tags from a remote into your local .git database, updating remote-tracking branches (like origin/main) without modifying your local working tree or current branch.",
          why: "Safe inspection of incoming team changes before integrating or merging them into your working code.",
          command: "git fetch origin --prune",
          example: "git fetch origin              # Download latest commits from origin\ngit fetch --all               # Fetch from all configured remotes\ngit fetch --prune             # Remove local references to deleted remote branches\ngit log HEAD..origin/main    # Review incoming commits before merging",
          practice: "1. Run git fetch origin to check for updates from the server.\n2. Compare your local branch with the remote: git log HEAD..origin/main.\n3. Use git diff HEAD origin/main to see exact code changes before merging.\n4. Fetch with --prune to clean up stale remote branches.",
          commonMistake: "Assuming \"git fetch\" updates your working files; fetch only downloads data into .git (you must merge or rebase to update your files)."
        }
      },
      {
        id: '30000000-0000-4000-8000-000000000003',
        slug: "git-pull",
        title: "Fetching & Integrating Remote Changes (git pull)",
        objective: "Fetch remote commits and integrate them into your current branch via merge or rebase.",
        estimated_minutes: 15,
        content: {
          summary: "\"git pull\" is a composite command: it executes \"git fetch\" followed immediately by \"git merge FETCH_HEAD\" (or \"git rebase\" if configured with --rebase).",
          why: "Synchronizes your active branch with the latest team contributions on the remote server.",
          command: "git pull origin main # or git pull --rebase",
          example: "git pull origin main\ngit pull --rebase origin main  # Replay local commits on top of remote\ngit pull --ff-only             # Abort if non-fast-forward merge is required",
          practice: "1. Run git pull to sync your active branch with origin.\n2. Practice running git pull --rebase to maintain a clean linear commit graph.\n3. Configure pull.rebase true globally: git config --global pull.rebase true.\n4. Observe how rebase avoids unnecessary merge commits.",
          commonMistake: "Blindly running \"git pull\" with uncommitted local modifications, leading to unexpected merge conflicts."
        }
      },
      {
        id: '30000000-0000-4000-8000-000000000004',
        slug: "git-push",
        title: "Publishing Local Commits to Remote (git push)",
        objective: "Publish local commits, branches, and tags to remote servers with upstream tracking.",
        estimated_minutes: 15,
        content: {
          summary: "\"git push <remote> <branch>\" uploads local commit objects and updates the corresponding branch reference on the remote server. Using \"-u\" (or --set-upstream) configures default tracking.",
          why: "Shares your finished features and bugfixes with your team and triggers continuous integration (CI) test suites.",
          command: "git push -u origin <branch-name>",
          example: "git push -u origin feature/login # Push and set upstream\ngit push                         # Push to configured upstream\ngit push origin --delete old-br  # Delete remote branch\ngit push --force-with-lease     # Safe force push after rebase",
          practice: "1. Create a feature branch and make a commit.\n2. Push the branch to remote setting upstream: git push -u origin feature/demo.\n3. Push tags with git push --tags.\n4. Practice deleting a remote feature branch after merge: git push origin --delete feature/demo.",
          commonMistake: "Using \"git push --force\" which can overwrite teammates commits; always prefer \"git push --force-with-lease\"."
        }
      },
      {
        id: '30000000-0000-4000-8000-000000000005',
        slug: "git-merge",
        title: "Integrating Branches: Fast-Forward & 3-Way Merges (git merge)",
        objective: "Combine independent lines of development and resolve merge conflicts step-by-step.",
        estimated_minutes: 20,
        content: {
          summary: "\"git merge\" joins two or more development histories. If no divergent commits exist, Git performs a Fast-Forward merge (moving the pointer forward). If histories diverge, Git computes a 3-way merge using the common ancestor and creates a merge commit.",
          why: "The primary mechanism for integrating completed feature branches into main development branches.",
          command: "git merge <branch-name> # or git merge --no-ff <branch-name>",
          example: "git checkout main\ngit merge feature/login       # Fast-forward or 3-way merge\ngit merge --no-ff feature/api # Force a merge commit for audit history\ngit merge --abort             # Abort merge during conflict",
          practice: "1. Create a feature branch, add a commit, and merge it into main via fast-forward.\n2. Create conflicting edits on both branches and trigger a merge conflict.\n3. Inspect conflict markers (<<<<<<<, =======, >>>>>>>), resolve the code, stage with git add, and commit.\n4. Practice using git merge --abort to cancel a merge safely.",
          commonMistake: "Committing unresolved conflict markers (<<<<<<<) into the repository, breaking the application build."
        }
      },
      {
        id: '30000000-0000-4000-8000-000000000006',
        slug: "git-stash",
        title: "Temporarily Shelving Work in Progress (git stash)",
        objective: "Save uncommitted modifications to a lightweight stack to switch branches with a clean working tree.",
        estimated_minutes: 15,
        content: {
          summary: "\"git stash\" records the uncommitted state of your working tree and staging index into a stack of stash objects, resetting your working tree to match HEAD. \"git stash pop\" restores the shelved changes.",
          why: "Essential when you need to switch branches urgently to fix a production bug without creating messy \"WIP\" commits.",
          command: "git stash push -m \"WIP: navbar\" && git stash pop",
          example: "git stash push -m \"WIP: auth modal\"\ngit stash list               # View saved stash stack\ngit stash pop                # Apply and remove top stash\ngit stash apply stash@{1}    # Apply specific stash without dropping\ngit stash drop stash@{0}     # Discard specific stash",
          practice: "1. Edit a file without committing.\n2. Save changes to stash with a descriptive message: git stash push -m \"WIP: experiment\".\n3. Verify your working tree is clean with git status.\n4. Re-apply your changes using git stash pop.",
          commonMistake: "Forgetting about old stashes on the stack for months, leading to difficult merge conflicts when popped later."
        }
      },
      {
        id: '30000000-0000-4000-8000-000000000007',
        slug: "git-tag",
        title: "Marking Release Milestones & Semantic Versions (git tag)",
        objective: "Create lightweight and annotated cryptographic release tags for software versioning.",
        estimated_minutes: 12,
        content: {
          summary: "Tags are permanent reference pointers to specific commits. Lightweight tags are simple named pointers; annotated tags are full Git objects stored with tagger name, email, date, and release notes.",
          why: "Marks official production releases (e.g. v1.0.0, v2.4.1) and triggers automated CI/CD release deployments.",
          command: "git tag -a v1.0.0 -m \"Release v1.0.0: Initial Production\"",
          example: "git tag                         # List all tags\ngit tag -a v1.2.0 -m \"Release 1.2\" # Create annotated tag\ngit tag v1.2.0-beta            # Create lightweight tag\ngit push origin v1.2.0         # Push single tag to remote\ngit push origin --tags         # Push all tags",
          practice: "1. List existing repository tags with git tag.\n2. Create an annotated release tag: git tag -a v1.0.0 -m \"Initial Release\".\n3. Inspect tag metadata using git show v1.0.0.\n4. Delete a tag locally with git tag -d v1.0.0.",
          commonMistake: "Creating lightweight tags instead of annotated tags (-a) for production releases (annotated tags preserve author attribution and date)."
        }
      },
      {
        id: '30000000-0000-4000-8000-000000000008',
        slug: "git-rebase",
        title: "Replaying Commits for Linear History & Interactive Squash (git rebase)",
        objective: "Replay local branch commits onto a new base branch and clean up history using interactive rebase.",
        estimated_minutes: 20,
        content: {
          summary: "\"git rebase <base>\" lifts your feature branch commits and replays them one-by-one on top of the target base branch, creating a completely linear history. \"git rebase -i\" allows squashing, editing, and reordering commits.",
          why: "Keeps repository history clean and readable by eliminating redundant merge commits before opening a Pull Request.",
          command: "git rebase main # or git rebase -i HEAD~3",
          example: "git fetch origin\ngit rebase origin/main         # Replay feature branch on top of latest main\ngit rebase -i HEAD~4           # Interactive rebase: squash, edit, drop\ngit rebase --continue          # Resume rebase after conflict resolution\ngit rebase --abort             # Abort rebase safely",
          practice: "1. Create 3 small commits on a feature branch.\n2. Run git rebase -i HEAD~3 to interactively squash the last 2 commits into the first.\n3. Rebase your feature branch onto main.\n4. Resolve any conflicts, stage with git add, and continue with git rebase --continue.",
          commonMistake: "Rebasing public shared branches that teammates are actively building on (never rewrite shared public history)."
        }
      },
      {
        id: '30000000-0000-4000-8000-000000000009',
        slug: "git-cherry-pick",
        title: "Applying Specific Commits from Other Branches (git cherry-pick)",
        objective: "Copy individual commit patches from one branch and apply them directly onto your active branch.",
        estimated_minutes: 15,
        content: {
          summary: "\"git cherry-pick <commit-sha>\" extracts the patch introduced by a specific historical commit and applies it as a brand new commit on top of your current HEAD.",
          why: "Ideal for backporting critical bugfixes from a main branch to a production maintenance release branch without merging all intermediate features.",
          command: "git cherry-pick <commit-sha>",
          example: "git cherry-pick a1b2c3d          # Apply single commit\ngit cherry-pick a1b2c3d..e4f5g6h # Apply range of commits\ngit cherry-pick -n <sha>         # Apply changes to staging without committing",
          practice: "1. Create a bugfix commit on a feature branch and record its SHA.\n2. Switch to your main branch with git switch main.\n3. Cherry-pick the bugfix commit: git cherry-pick <sha>.\n4. Verify with git log that the fix is applied with a new commit SHA on main.",
          commonMistake: "Cherry-picking large numbers of commits instead of merging, creating duplicate commits and future merge conflicts."
        }
      },
      {
        id: '30000000-0000-4000-8000-000000000010',
        slug: "git-revert",
        title: "Safe Public Rollbacks with Inverse Commits (git revert)",
        objective: "Undo historical commits by generating brand new inverse commits without rewriting history.",
        estimated_minutes: 15,
        content: {
          summary: "\"git revert <commit-sha>\" computes the exact opposite patch of a specified commit and creates a new commit recording the reversal. It preserves all past history intact.",
          why: "The safe, standard method for rolling back buggy commits on public, shared branches without breaking teammates history.",
          command: "git revert <commit-sha>",
          example: "git revert a1b2c3d               # Revert single commit\ngit revert HEAD                  # Revert the most recent commit\ngit revert -m 1 <merge-commit>   # Revert a merge commit specifying parent 1",
          practice: "1. Make a commit adding a test function.\n2. Revert the commit using git revert HEAD.\n3. Inspect the commit log with git log -2 to verify the new \"Revert \\\"...\\\"\" commit.\n4. Confirm that the test function is cleanly removed from the codebase.",
          commonMistake: "Using \"git reset --hard\" on shared team branches instead of \"git revert\"."
        }
      },
      {
        id: '30000000-0000-4000-8000-000000000011',
        slug: "git-reset",
        title: "Unwinding History: Soft, Mixed & Hard Resets (git reset)",
        objective: "Move HEAD pointer and manipulate index and working tree states with soft, mixed, and hard modes.",
        estimated_minutes: 20,
        content: {
          summary: "\"git reset <mode> <commit>\" moves the current branch HEAD to a previous commit. \"--soft\" keeps changes staged in the index; \"--mixed\" (default) unstages changes to the working tree; \"--hard\" completely discards changes.",
          why: "Enables flexible local history correction, un-committing mistakes, and resetting dirty sandbox states.",
          command: "git reset --soft HEAD~1 # or git reset --hard HEAD~1",
          example: "git reset --soft HEAD~1  # Undo commit; keep files staged\ngit reset HEAD~1         # Undo commit; keep files unstaged on disk\ngit reset --hard HEAD~1  # Discard commit and all disk changes (CAUTION!)",
          practice: "1. Create a test commit.\n2. Run git reset --soft HEAD~1 and verify git status shows changes staged in the index.\n3. Run git reset HEAD to unstage changes to the working tree.\n4. Re-commit and practice git reset --hard HEAD~1 (verifying permanent removal).",
          commonMistake: "Running \"git reset --hard\" with uncommitted work, permanently wiping files from disk."
        }
      },
      {
        id: '30000000-0000-4000-8000-000000000012',
        slug: "git-reflog",
        title: "The Ultimate Safety Net: Reference Logs (git reflog)",
        objective: "Recover \"lost\" commits, accidental hard resets, deleted branches, and aborted rebases.",
        estimated_minutes: 15,
        content: {
          summary: "The reference log (.git/logs/HEAD) records every single time the HEAD pointer moves (commits, checkouts, rebases, resets). Because Git retains unreferenced objects until garbage collection, lost commits can be recovered.",
          why: "Guarantees you can recover from almost any catastrophic Git mistake made in the last 30-90 days.",
          command: "git reflog # then git checkout -b recovered HEAD@{1}",
          example: "git reflog                      # Show recent HEAD movements\ngit reflog show feature/login    # Show movements of specific branch\ngit reset --hard HEAD@{3}        # Jump back to state 3 steps ago\ngit checkout -b fix HEAD@{2}     # Recover branch from reflog position",
          practice: "1. Make a commit, record its message, and run git reset --hard HEAD~1.\n2. Run git reflog to find the commit SHA before the reset.\n3. Recover the lost commit by creating a new branch: git checkout -b recovered <sha>.\n4. Verify that your lost code is restored.",
          commonMistake: "Panic-deleting a repository folder after an accidental reset instead of checking git reflog."
        }
      },
      {
        id: '30000000-0000-4000-8000-000000000013',
        slug: "git-bisect",
        title: "Automated Binary Search Bug Hunting (git bisect)",
        objective: "Isolate the exact commit that introduced a bug using automated binary search.",
        estimated_minutes: 20,
        content: {
          summary: "\"git bisect\" performs a binary search through your commit history between a known \"good\" commit and a \"bad\" commit, checking out the midpoint for testing at each step (O(log N) efficiency).",
          why: "Allows you to pinpoint the exact commit that broke a test or introduced a regression across thousands of commits in minutes.",
          command: "git bisect start && git bisect bad && git bisect good <commit>",
          example: "git bisect start\ngit bisect bad                   # Current HEAD has the bug\ngit bisect good v1.0.0           # v1.0.0 was clean\n# Test code...\ngit bisect good                  # or git bisect bad\ngit bisect reset                 # Return to original HEAD",
          practice: "1. Start bisect mode with git bisect start.\n2. Mark current commit bad: git bisect bad.\n3. Mark an older known good commit: git bisect good <sha>.\n4. Test each intermediate commit and mark good/bad until Git identifies the culprit, then run git bisect reset.",
          commonMistake: "Forgetting to run \"git bisect reset\" when finished, leaving your repository in a detached bisect state."
        }
      },
      {
        id: '30000000-0000-4000-8000-000000000014',
        slug: "git-blame",
        title: "Line-by-Line Code Attribution (git blame)",
        objective: "Inspect author, commit SHA, and timestamp for every single line of code in a file.",
        estimated_minutes: 12,
        content: {
          summary: "\"git blame <file>\" displays the commit SHA, author name, and date of the last modification for each line of a file. Using \"-L\" restricts the output to specific line ranges.",
          why: "Essential for understanding why complex code was written and finding the associated commit message or PR for context.",
          command: "git blame -L 10,25 src/index.ts",
          example: "git blame package.json\ngit blame -L 40,60 src/server.ts  # Inspect lines 40 to 60\ngit blame -e file.txt             # Show author email address\ngit blame -w file.txt             # Ignore whitespace changes",
          practice: "1. Run git blame on a multi-author file.\n2. Restrict inspection to a specific function with git blame -L 1,15 <file>.\n3. Ignore whitespace formatting with -w.\n4. Use the revealed commit SHA with git show <sha> to read the full context.",
          commonMistake: "Using blame to attribute fault instead of using it as an investigative tool to read commit messages and design intent."
        }
      },
      {
        id: '30000000-0000-4000-8000-000000000015',
        slug: "git-shortlog",
        title: "Summarizing Commit Activity by Author (git shortlog)",
        objective: "Generate release changelogs and author contribution summaries from commit history.",
        estimated_minutes: 10,
        content: {
          summary: "\"git shortlog\" groups commit messages by author name. Using \"-s\" outputs a summary commit count per contributor; \"-n\" sorts authors by total number of commits.",
          why: "Ideal for drafting release notes, acknowledging contributors, and inspecting repository activity distributions.",
          command: "git shortlog -sn --no-merges",
          example: "git shortlog -sn                 # Summary count sorted by author\ngit shortlog --since=\"1 month ago\" # Commits in the last month\ngit shortlog v1.0.0..v2.0.0       # Changelog between two releases",
          practice: "1. Run git shortlog to view grouped commit messages by author.\n2. Generate a sorted leaderboard with git shortlog -sn.\n3. Filter for recent activity with --since=\"1 week ago\".\n4. Generate a clean release changelog between two tags: git shortlog v1.0..v2.0.",
          commonMistake: "Inconsistent author names in git config (e.g. \"Alex\" vs \"Alex Smith\") causing one developer to appear as multiple authors (use .mailmap to fix)."
        }
      },
      {
        id: '30000000-0000-4000-8000-000000000016',
        slug: "git-clean",
        title: "Removing Untracked Build Artifacts & Junk (git clean)",
        objective: "Safely delete untracked files and directories from your working tree.",
        estimated_minutes: 12,
        content: {
          summary: "\"git clean\" removes untracked files that are not under version control. Using \"-n\" (dry run) previews what will be deleted; \"-f\" (force) performs deletion; \"-d\" includes untracked directories.",
          why: "Quickly cleans compiler outputs, temporary test artifacts, and build folders without having to delete and re-clone the repository.",
          command: "git clean -nd # (dry-run) then git clean -fd",
          example: "git clean -n                     # Dry run preview of files to remove\ngit clean -fd                    # Force removal of untracked files & directories\ngit clean -fdx                   # Also remove ignored files (.gitignore targets)",
          practice: "1. Create several untracked files and folders in your repository.\n2. Run a safe dry-run preview: git clean -nd.\n3. Verify which files are scheduled for deletion.\n4. Execute removal with git clean -fd and verify clean working tree with git status.",
          commonMistake: "Running \"git clean -fdx\" without a dry run (-n), which can permanently delete your untracked .env environment files."
        }
      }
    ]
  },

  // =========================================================================
  // ADVANCED GIT INTERNALS & PLUMBING (30 Commands)
  // =========================================================================
  'advanced': {
    id: '00000000-0000-4000-8000-000000000004',
    slug: 'advanced',
    title: 'Advanced Git Internals & Plumbing',
    level: 3,
    description: 'Master all 30 low-level plumbing and enterprise commands: object database, tree writing, worktrees, submodules, rerere, gc, and repository maintenance.',
    lessons: [
      {
        id: '40000000-0000-4000-8000-000000000001',
        slug: "git-cat-file",
        title: "Plumbing: Inspecting Object Database Internals (git cat-file)",
        objective: "Inspect raw contents, types, and sizes of Git objects (blobs, trees, commits, tags).",
        estimated_minutes: 15,
        content: {
          summary: "\"git cat-file\" is the core plumbing command for inspecting Git objects in .git/objects/. \"-t\" reveals the object type (blob, tree, commit, tag), \"-s\" shows byte size, and \"-p\" pretty-prints contents.",
          why: "Demystifies how Git stores data internally as a content-addressable key-value store indexed by SHA hashes.",
          command: "git cat-file -t <sha> && git cat-file -p <sha>",
          example: "git cat-file -t HEAD         # Returns \"commit\"\ngit cat-file -p HEAD         # Shows commit tree SHA, author, message\ngit cat-file -p HEAD^{tree}  # Shows tree directory listing\ngit cat-file -s <blob-sha>   # Shows size of blob in bytes",
          practice: "1. Run git rev-parse HEAD to get the latest commit SHA.\n2. Check its object type with git cat-file -t <sha>.\n3. Pretty-print the commit header and tree pointer with git cat-file -p <sha>.\n4. Pretty-print the root tree object to inspect file blob hashes.",
          commonMistake: "Assuming Git objects are compressed proprietary binary files; they are zlib-compressed text headers followed by file contents."
        }
      },
      {
        id: '40000000-0000-4000-8000-000000000002',
        slug: "git-hash-object",
        title: "Plumbing: Computing Hashes & Creating Blobs (git hash-object)",
        objective: "Compute SHA-1/SHA-256 hashes of data and manually store raw blobs in .git/objects.",
        estimated_minutes: 15,
        content: {
          summary: "\"git hash-object\" computes the cryptographic hash of a file or stream and optionally writes it into the object database with the \"-w\" flag as an immutable blob.",
          why: "Demonstrates content-addressable storage: identical file content always yields the exact same SHA hash regardless of filename.",
          command: "echo \"hello git\" | git hash-object -w --stdin",
          example: "git hash-object file.txt                 # Calculate SHA without writing\necho \"hello\" | git hash-object -w --stdin # Store blob in .git/objects\ngit cat-file -p <returned-sha>           # Verify stored content",
          practice: "1. Hash a string into Git: echo \"GitNovi internals\" | git hash-object -w --stdin.\n2. Note the returned 40-character SHA hash.\n3. Verify the file exists on disk inside .git/objects/xx/yyyy...\n4. Read the blob content back using git cat-file -p <sha>.",
          commonMistake: "Expecting filenames or permissions to be stored in blobs; blobs store only raw file contents (trees store filenames and mode bits)."
        }
      },
      {
        id: '40000000-0000-4000-8000-000000000003',
        slug: "git-ls-tree",
        title: "Plumbing: Inspecting Tree Objects & Directories (git ls-tree)",
        objective: "Inspect tree objects, mode bits, blob references, and directory hierarchies.",
        estimated_minutes: 15,
        content: {
          summary: "\"git ls-tree\" lists the contents of a tree object, displaying file permissions (100644 for regular files, 100755 for executables, 040000 for subtrees), object types, SHA hashes, and filenames.",
          why: "Reveals how Git represents directory structures and file metadata as directed acyclic graphs of trees and blobs.",
          command: "git ls-tree -r HEAD",
          example: "git ls-tree HEAD                 # List top-level directory objects\ngit ls-tree -r HEAD              # Recursively list all files and blobs\ngit ls-tree -d HEAD              # List only directory tree objects",
          practice: "1. Run git ls-tree HEAD to view the root tree object.\n2. Inspect the file mode bits (100644 vs 100755 for executable scripts).\n3. Run a recursive listing with git ls-tree -r HEAD.\n4. Inspect a subtree object hash with git cat-file -p <tree-sha>.",
          commonMistake: "Confusing tree objects with commit objects; trees represent folder listings, while commits wrap trees with author metadata."
        }
      },
      {
        id: '40000000-0000-4000-8000-000000000004',
        slug: "git-write-tree",
        title: "Plumbing: Writing the Index to Tree Objects (git write-tree)",
        objective: "Create a permanent tree object in .git/objects from the current staging index.",
        estimated_minutes: 15,
        content: {
          summary: "\"git write-tree\" reads the current staging index (.git/index) and writes a new tree object into .git/objects for the root and every nested directory, returning the root tree SHA.",
          why: "The exact low-level plumbing operation executed by \"git commit\" during the first phase of snapshot creation.",
          command: "git write-tree",
          example: "git add .\ngit write-tree                   # Returns root tree SHA\ngit cat-file -p <returned-sha>   # Inspect created tree structure",
          practice: "1. Stage several files using git add.\n2. Manually write the tree object with git write-tree.\n3. Inspect the created tree object with git cat-file -p <sha>.\n4. Note how the tree object matches the staged index state.",
          commonMistake: "Running \"git write-tree\" with an empty staging area, which writes an empty tree object."
        }
      },
      {
        id: '40000000-0000-4000-8000-000000000005',
        slug: "git-commit-tree",
        title: "Plumbing: Low-Level Commit Creation (git commit-tree)",
        objective: "Manually construct commit objects linking tree objects and parent commits without porcelain helpers.",
        estimated_minutes: 15,
        content: {
          summary: "\"git commit-tree <tree-sha> -p <parent-sha> -m <message>\" creates a new commit object directly in the object database pointing to the specified tree snapshot and parent commit.",
          why: "Demonstrates how porcelain \"git commit\" works under the hood and allows scripted construction of synthetic commit graphs.",
          command: "git commit-tree <tree-sha> -p <parent-sha> -m \"Commit message\"",
          example: "TREE=$(git write-tree)\nCOMMIT=$(git commit-tree $TREE -p HEAD -m \"Plumbing commit\")\ngit update-ref refs/heads/main $COMMIT",
          practice: "1. Generate a tree SHA with git write-tree.\n2. Create a manual commit object: git commit-tree <tree-sha> -p HEAD -m \"Manual commit\".\n3. Inspect the raw commit object with git cat-file -p <commit-sha>.\n4. Point your active branch to it using git update-ref.",
          commonMistake: "Omitting parent pointers (-p) when creating subsequent commits, creating orphaned root commits."
        }
      },
      {
        id: '40000000-0000-4000-8000-000000000006',
        slug: "git-read-tree",
        title: "Plumbing: Reading Tree Objects into the Index (git read-tree)",
        objective: "Populate the staging index directly from a tree object without modifying files on disk.",
        estimated_minutes: 15,
        content: {
          summary: "\"git read-tree <tree-ish>\" reads a tree object specified by a commit or tree SHA into the staging area, replacing or merging index entries.",
          why: "Used in low-level scripting, 3-way merge algorithms, and sparse-checkout preparation.",
          command: "git read-tree <tree-sha> # or git read-tree -m -u <tree1> <tree2>",
          example: "git read-tree HEAD~1           # Load previous commit tree into index\ngit read-tree -m -u HEAD branch # 2-way merge trees and update working tree",
          practice: "1. Inspect your current index with git status.\n2. Load a past commit tree into the index: git read-tree HEAD~1.\n3. Run git status to see differences staged against HEAD.\n4. Reset the index back with git read-tree HEAD.",
          commonMistake: "Using git read-tree without \"-u\", which updates the index but leaves disk files unchanged, creating working tree desynchronization."
        }
      },
      {
        id: '40000000-0000-4000-8000-000000000007',
        slug: "git-update-index",
        title: "Plumbing: Staging Index Manipulation & Flags (git update-index)",
        objective: "Manipulate index cache entries, toggle executable bits, and mark assume-unchanged flags.",
        estimated_minutes: 15,
        content: {
          summary: "\"git update-index\" directly registers file modifications into the .git/index file. Powerful flags like \"--assume-unchanged\" and \"--chmod=+x\" allow index-level file management.",
          why: "Allows advanced developers to toggle executable bits without changing file content and ignore local modifications to tracked config templates.",
          command: "git update-index --chmod=+x script.sh",
          example: "git update-index --add file.txt         # Add file directly to index\ngit update-index --chmod=+x run.sh       # Make file executable in Git\ngit update-index --assume-unchanged cfg  # Tell Git to ignore local edits\ngit update-index --no-assume-unchanged   # Restore change tracking",
          practice: "1. Create a script touch deploy.sh and make it executable in Git: git update-index --chmod=+x deploy.sh.\n2. Inspect mode bits with git ls-files -s (verify 100755).\n3. Tell Git to ignore local changes to a config file: git update-index --assume-unchanged config.json.\n4. Restore normal tracking with --no-assume-unchanged.",
          commonMistake: "Using \"--assume-unchanged\" on shared files and forgetting it is set, leading to confusing merge issues later."
        }
      },
      {
        id: '40000000-0000-4000-8000-000000000008',
        slug: "git-ls-files",
        title: "Plumbing: Listing Indexed, Untracked & Stage Files (git ls-files)",
        objective: "Query the staging index to view staged files, stage conflict numbers, and untracked files.",
        estimated_minutes: 12,
        content: {
          summary: "\"git ls-files\" queries the index file directly. \"-s\" displays stage numbers (0 for normal, 1 for ancestor, 2 for ours, 3 for theirs during conflicts); \"-o\" lists untracked files.",
          why: "Indispensable for scripting, tool integration, and debugging complex multi-stage merge conflicts.",
          command: "git ls-files -s && git ls-files -o --exclude-standard",
          example: "git ls-files                      # List all tracked files\ngit ls-files -s                   # Show stage numbers, mode bits, and blob hashes\ngit ls-files -o --exclude-standard # List untracked files respecting .gitignore\ngit ls-files -u                   # List unmerged conflict files",
          practice: "1. List all files currently tracked in the index with git ls-files.\n2. Inspect the stage numbers and blob SHAs with git ls-files -s.\n3. List untracked files with git ls-files -o --exclude-standard.\n4. Inspect unmerged files during a conflict with git ls-files -u.",
          commonMistake: "Confusing \"git ls-files\" (which reads the .git/index file) with \"ls\" (which reads your local disk filesystem)."
        }
      },
      {
        id: '40000000-0000-4000-8000-000000000009',
        slug: "git-rev-parse",
        title: "Plumbing: Resolving Revisions & SHA Parameters (git rev-parse)",
        objective: "Translate friendly branch names, tags, and relative revisions (HEAD~2, HEAD^) into exact 40-character SHAs.",
        estimated_minutes: 12,
        content: {
          summary: "\"git rev-parse\" is the primary plumbing parameter parser. It resolves revisions like \"HEAD\", \"main\", \"HEAD~3\", and \"v1.0\" into unambiguous object SHA hashes.",
          why: "Used universally in Git hooks, CI/CD scripts, and developer tooling to obtain canonical commit hashes.",
          command: "git rev-parse HEAD && git rev-parse --show-toplevel",
          example: "git rev-parse HEAD               # Returns exact commit SHA\ngit rev-parse --short HEAD       # Returns 7-character short SHA\ngit rev-parse --show-toplevel    # Root directory path of repository\ngit rev-parse --is-inside-work-tree # Check if inside Git repo",
          practice: "1. Get the current commit SHA: git rev-parse HEAD.\n2. Get the short SHA: git rev-parse --short HEAD.\n3. Find the repository root folder from any nested subfolder: git rev-parse --show-toplevel.\n4. Test if a directory is inside a Git repo: git rev-parse --is-inside-work-tree.",
          commonMistake: "Relying on hardcoded paths in shell scripts instead of using \"git rev-parse --show-toplevel\"."
        }
      },
      {
        id: '40000000-0000-4000-8000-000000000010',
        slug: "git-rev-list",
        title: "Plumbing: Traversing & Filtering Commit Lists (git rev-list)",
        objective: "Traverse commit graphs in reverse chronological order and filter commits for scripting.",
        estimated_minutes: 12,
        content: {
          summary: "\"git rev-list\" is the underlying plumbing engine behind \"git log\". It outputs raw commit SHAs matching search, range, and filtering criteria.",
          why: "Used in deployment scripts to count total commits, check divergence, and find common ancestors.",
          command: "git rev-list --count HEAD",
          example: "git rev-list HEAD                # List all commit SHAs reachable from HEAD\ngit rev-list --count HEAD        # Total number of commits on current branch\ngit rev-list origin/main..HEAD   # List unpushed local commits\ngit rev-list --max-parents=0 HEAD # Find the initial root commit",
          practice: "1. Count total commits in your repository: git rev-list --count HEAD.\n2. List commits reachable on your branch: git rev-list -n 5 HEAD.\n3. Find the initial root commit of the repository: git rev-list --max-parents=0 HEAD.\n4. Check how many commits ahead your branch is: git rev-list --count origin/main..HEAD.",
          commonMistake: "Parsing \"git log\" in shell scripts with regex when \"git rev-list\" provides clean, raw SHA outputs."
        }
      },
      {
        id: '40000000-0000-4000-8000-000000000011',
        slug: "git-show-ref",
        title: "Plumbing: Listing All Reference Pointers (git show-ref)",
        objective: "List all references (heads, tags, remotes) alongside their target commit SHAs.",
        estimated_minutes: 10,
        content: {
          summary: "\"git show-ref\" displays all reference files (.git/refs/heads/*, .git/refs/tags/*, .git/refs/remotes/*) and the commit hashes they point to.",
          why: "Provides a fast, scriptable inventory of all branch pointers and tags in a repository.",
          command: "git show-ref --heads && git show-ref --tags",
          example: "git show-ref                     # List all references\ngit show-ref --heads             # List local branches\ngit show-ref --tags              # List all tags\ngit show-ref --verify refs/heads/main # Check if branch exists",
          practice: "1. Run git show-ref to list all reference pointers.\n2. Filter for local branch heads only with git show-ref --heads.\n3. Filter for tags with git show-ref --tags.\n4. Verify if a branch exists in a script: git show-ref --verify refs/heads/main.",
          commonMistake: "Directly inspecting .git/refs/ directory with bash \"ls\" (packed refs stored in .git/packed-refs will be missed)."
        }
      },
      {
        id: '40000000-0000-4000-8000-000000000012',
        slug: "git-update-ref",
        title: "Plumbing: Safely Updating Reference Pointers (git update-ref)",
        objective: "Directly update or delete reference pointers with atomic safety checks.",
        estimated_minutes: 12,
        content: {
          summary: "\"git update-ref <ref> <new-sha> [<old-sha>]\" safely updates the SHA hash stored in a reference. If <old-sha> is provided, the update only succeeds if the ref matches the expected value.",
          why: "The exact low-level mechanism Git uses to advance branch pointers after commits and merges.",
          command: "git update-ref refs/heads/feature <new-sha>",
          example: "git update-ref refs/heads/main a1b2c3d # Move main to commit SHA\ngit update-ref -d refs/heads/old-feature  # Delete reference\ngit update-ref refs/heads/main <new> <old> # Atomic compare-and-swap",
          practice: "1. Create a dummy branch ref: git update-ref refs/heads/manual-test HEAD.\n2. Verify with git branch that \"manual-test\" appears.\n3. Safely delete the reference: git update-ref -d refs/heads/manual-test.\n4. Note how refs are updated atomically.",
          commonMistake: "Directly editing .git/refs/ files with echo (can corrupt packed-refs and bypass reflog recording)."
        }
      },
      {
        id: '40000000-0000-4000-8000-000000000013',
        slug: "git-symbolic-ref",
        title: "Plumbing: Managing Symbolic References & HEAD (git symbolic-ref)",
        objective: "Read and manipulate symbolic reference pointers like HEAD.",
        estimated_minutes: 10,
        content: {
          summary: "A symbolic ref is a reference that points to another reference (e.g. .git/HEAD contains \"ref: refs/heads/main\"). \"git symbolic-ref\" reads or updates these symbolic pointers.",
          why: "Explains how Git tracks which branch is currently checked out vs being in a detached HEAD state.",
          command: "git symbolic-ref HEAD",
          example: "git symbolic-ref HEAD                    # Returns \"refs/heads/main\"\ngit symbolic-ref --short HEAD            # Returns \"main\"\ngit symbolic-ref HEAD refs/heads/feature # Point HEAD to another branch",
          practice: "1. Inspect your current symbolic HEAD: git symbolic-ref HEAD.\n2. Print the short branch name: git symbolic-ref --short HEAD.\n3. Checkout a commit directly (detached HEAD) and run git symbolic-ref HEAD (observe error).\n4. Return to main with git switch main.",
          commonMistake: "Trying to run \"git symbolic-ref HEAD\" when in a detached HEAD state (symbolic refs only exist when attached to a named branch)."
        }
      },
      {
        id: '40000000-0000-4000-8000-000000000014',
        slug: "git-for-each-ref",
        title: "Plumbing: Iterating & Formatting References (git for-each-ref)",
        objective: "Query, sort, filter, and format custom reference lists using templating syntax.",
        estimated_minutes: 15,
        content: {
          summary: "\"git for-each-ref\" iterates through all references matching a pattern and outputs them according to a custom formatting template (e.g. author date, committer, upstream tracking branch).",
          why: "The ultimate tool for building custom CLI dashboards, branch sorting tools, and release changelogs.",
          command: "git for-each-ref --sort=-committerdate --format=\"%(refname:short) %(committerdate:relative)\"",
          example: "git for-each-ref --sort=-committerdate refs/heads/ # Sort branches by recent activity\ngit for-each-ref --format=\"%(refname:short) <- %(upstream:short)\" refs/heads/\ngit for-each-ref --format=\"%(tag) - %(subject)\" refs/tags/",
          practice: "1. List all local branches sorted by most recently committed: git for-each-ref --sort=-committerdate refs/heads/.\n2. Format output with author and relative date: --format=\"%(refname:short) - %(authordate:relative)\".\n3. List all tags with release messages.\n4. Use formatting to build a custom terminal branch summary.",
          commonMistake: "Using complex bash piping on \"git branch\" when \"git for-each-ref --format\" provides native formatting."
        }
      },
      {
        id: '40000000-0000-4000-8000-000000000015',
        slug: "git-merge-base",
        title: "Plumbing: Finding Common Ancestors (git merge-base)",
        objective: "Find the best common ancestor commit between two branches for 3-way merging.",
        estimated_minutes: 12,
        content: {
          summary: "\"git merge-base <commit1> <commit2>\" traverses the commit DAG to find the lowest common ancestor (the base commit used during 3-way merges).",
          why: "Used internally by Git during merge and rebase calculations, and by CI systems to detect PR changes.",
          command: "git merge-base main feature/login",
          example: "git merge-base main feature/login # Returns common ancestor SHA\ngit diff $(git merge-base main HEAD) HEAD # Show only changes introduced on branch\ngit merge-base --is-ancestor A B  # Check if A is reachable ancestor of B",
          practice: "1. Create a feature branch and make 2 commits.\n2. Find the common ancestor with main: git merge-base main HEAD.\n3. Diff only the branch modifications: git diff $(git merge-base main HEAD) HEAD.\n4. Test ancestor relationship: git merge-base --is-ancestor <ancestor-sha> HEAD.",
          commonMistake: "Diffing \"git diff main HEAD\" (which includes changes made on main) when you intended to diff only your branch work."
        }
      },
      {
        id: '40000000-0000-4000-8000-000000000016',
        slug: "git-check-ignore",
        title: "Plumbing: Debugging .gitignore Rules (git check-ignore)",
        objective: "Debug why specific files are ignored or un-ignored by .gitignore rules.",
        estimated_minutes: 10,
        content: {
          summary: "\"git check-ignore -v <path>\" tests file paths against all active .gitignore files (project root, subdirectories, and global ignore) and outputs the exact file and line number responsible for ignoring it.",
          why: "Eliminates guesswork when files are unexpectedly ignored or failing to be ignored by Git.",
          command: "git check-ignore -v <filepath>",
          example: "git check-ignore -v src/app.log    # Outputs: .gitignore:4:*.log  src/app.log\ngit check-ignore -v .env           # Verify .env rule\ngit check-ignore -n file.txt       # Check without verbose rule info",
          practice: "1. Create a .gitignore file with \"*.log\" and \"temp/\".\n2. Test a sample file: git check-ignore -v debug.log.\n3. Inspect the matching line number in the output.\n4. Test an un-ignored file and observe exit status 1.",
          commonMistake: "Trying to ignore a file that was already committed into Git (you must run git rm --cached <file> first)."
        }
      },
      {
        id: '40000000-0000-4000-8000-000000000017',
        slug: "git-worktree",
        title: "Managing Multiple Working Trees Simultaneously (git worktree)",
        objective: "Check out and work on multiple branches at the same time in separate directory folders.",
        estimated_minutes: 20,
        content: {
          summary: "\"git worktree\" allows a single repository to have multiple working trees attached to it, each with its own checked-out branch and index, sharing the same .git object database.",
          why: "Allows you to review PRs, run long test suites, or fix urgent production bugs in a second folder without stashing or switching your active branch.",
          command: "git worktree add ../hotfix-branch main",
          example: "git worktree add ../hotfix main   # Create hotfix folder on main branch\ngit worktree list                 # List active working trees\ngit worktree remove ../hotfix      # Remove worktree after completion\ngit worktree prune                # Clean up stale worktree metadata",
          practice: "1. Create a second working tree: git worktree add ../repo-review main.\n2. Open the second folder and verify it has a linked .git file.\n3. List active worktrees with git worktree list.\n4. Remove the temporary worktree with git worktree remove ../repo-review.",
          commonMistake: "Trying to check out the same branch simultaneously in two different worktrees (Git prohibits this to prevent index corruption)."
        }
      },
      {
        id: '40000000-0000-4000-8000-000000000018',
        slug: "git-sparse-checkout",
        title: "Monorepo Optimization & Partial Checkouts (git sparse-checkout)",
        objective: "Check out only specific folders of large monorepos to save disk space and accelerate builds.",
        estimated_minutes: 18,
        content: {
          summary: "\"git sparse-checkout\" enables sparse cone patterns, allowing developers in massive monorepos to populate only the specific subdirectories they are actively working on.",
          why: "Dramatically accelerates disk operations and IDE indexing on enterprise monorepos containing gigabytes of code.",
          command: "git sparse-checkout init --cone && git sparse-checkout set src/frontend",
          example: "git sparse-checkout init --cone\ngit sparse-checkout set packages/auth packages/core\ngit sparse-checkout list         # Show active sparse folders\ngit sparse-checkout disable      # Restore full repository checkout",
          practice: "1. Initialize sparse checkout: git sparse-checkout init --cone.\n2. Set sparse checkout to a single folder: git sparse-checkout set src/.\n3. Verify that other folders are excluded from your disk while remaining in Git history.\n4. Restore full checkout: git sparse-checkout disable.",
          commonMistake: "Manually editing sparse-checkout patterns without cone mode, causing slow wildcard pattern evaluation."
        }
      },
      {
        id: '40000000-0000-4000-8000-000000000019',
        slug: "git-submodule",
        title: "Managing Nested External Repositories (git submodule)",
        objective: "Embed and track external Git repositories inside a parent repository at specific commit pins.",
        estimated_minutes: 20,
        content: {
          summary: "\"git submodule\" keeps a separate Git repository as a subdirectory of another Git repository. The parent repository tracks the submodule not by branch, but by pinning an exact commit SHA.",
          why: "Standard for sharing shared component libraries, native C/C++ engine dependencies, and vendor frameworks.",
          command: "git submodule add <url> <path> && git submodule update --init --recursive",
          example: "git submodule add https://github.com/lib/core.git libs/core\ngit submodule update --init --recursive # Initialize submodules after clone\ngit submodule foreach git pull origin main # Update all submodules",
          practice: "1. Add a sample submodule: git submodule add https://github.com/example/lib.git vendor/lib.\n2. Inspect the created .gitmodules file.\n3. Commit the submodule pointer in the parent repository.\n4. Practice updating submodules with git submodule update --init.",
          commonMistake: "Making changes inside a submodule folder without committing and pushing the submodule first before committing in the parent repo."
        }
      },
      {
        id: '40000000-0000-4000-8000-000000000020',
        slug: "git-subtree",
        title: "Subtree Merging & Monorepo Splitting (git subtree)",
        objective: "Merge external repository histories into subdirectories without submodule complexity.",
        estimated_minutes: 18,
        content: {
          summary: "\"git subtree\" merges the commit history of an external repository directly into a subfolder of your project. Unlike submodules, subtrees require no extra configuration files (.gitmodules) or clone flags.",
          why: "Provides a seamless workflow for embedding dependencies and splitting subfolders into standalone open-source repos.",
          command: "git subtree add --prefix=lib/ <url> main --squash",
          example: "git subtree add --prefix=plugins/auth https://github.com/org/plugin.git main --squash\ngit subtree pull --prefix=plugins/auth https://github.com/org/plugin.git main --squash\ngit subtree push --prefix=plugins/auth https://github.com/org/plugin.git main",
          practice: "1. Add an external repository as a subtree: git subtree add --prefix=shared/ <url> main --squash.\n2. Verify the files are directly committed in your repository.\n3. Pull updates from upstream using git subtree pull.\n4. Understand the tradeoff: clean single-repo clones vs large history size.",
          commonMistake: "Forgetting the \"--squash\" flag, which pulls thousands of individual external commits into your project history."
        }
      },
      {
        id: '40000000-0000-4000-8000-000000000021',
        slug: "git-rerere",
        title: "Reuse Recorded Resolution of Merge Conflicts (git rerere)",
        objective: "Automatically record and replay merge conflict resolutions during repeated rebases and merges.",
        estimated_minutes: 15,
        content: {
          summary: "\"git rerere\" (Reuse Recorded Resolution) records how you resolved a conflicted merge hunk and automatically applies the exact same resolution the next time Git encounters the same conflict.",
          why: "Saves enormous time during long-lived feature branch rebasing where the same conflict appears across multiple rebase steps.",
          command: "git config --global rerere.enabled true",
          example: "git config --global rerere.enabled true # Enable rerere\ngit rerere status                      # Show recorded conflict files\ngit rerere diff                        # Show conflict resolution diff\ngit rerere clear                       # Clear recorded resolutions",
          practice: "1. Enable rerere globally: git config --global rerere.enabled true.\n2. Resolve a merge conflict and commit.\n3. Abort or reset the merge and re-run the merge.\n4. Observe Git output: \"Resolved ... using previous resolution\".",
          commonMistake: "Recording an incorrect conflict resolution, causing Git to re-apply the broken code in future merges (use git rerere clear to fix)."
        }
      },
      {
        id: '40000000-0000-4000-8000-000000000022',
        slug: "git-gc",
        title: "Garbage Collection & Repository Optimization (git gc)",
        objective: "Clean up unreachable objects, compress file revisions into packfiles, and pack refs.",
        estimated_minutes: 15,
        content: {
          summary: "\"git gc\" (Garbage Collection) optimizes your repository by packing loose objects into efficient compressed packfiles (.pack), packing loose refs into .git/packed-refs, and pruning orphaned objects older than the expiry window.",
          why: "Reduces disk consumption and significantly speeds up repository operations on large codebases.",
          command: "git gc --aggressive --prune=now",
          example: "git gc                           # Standard cleanup\ngit gc --aggressive              # Deep delta compression optimization\ngit gc --prune=now               # Immediately remove unreachable objects\ngit count-objects -v             # Inspect object counts before and after",
          practice: "1. Inspect loose object counts with git count-objects -v.\n2. Run git gc to optimize repository storage.\n3. Verify that loose objects were packed into .git/objects/pack/.\n4. Check the reduced disk size.",
          commonMistake: "Running \"git gc --prune=now\" immediately after making a mistake, which deletes unreachable commits that could have been recovered from reflog."
        }
      },
      {
        id: '40000000-0000-4000-8000-000000000023',
        slug: "git-prune",
        title: "Plumbing: Pruning Unreachable Objects (git prune)",
        objective: "Remove unreferenced objects from the object database that have no pointers from refs or reflog.",
        estimated_minutes: 12,
        content: {
          summary: "\"git prune\" scans the object database and removes objects that cannot be reached from any branch, tag, or reflog pointer. It is usually called automatically by \"git gc\".",
          why: "Frees disk space after removing large accidentally committed binary files.",
          command: "git prune --dry-run # then git prune",
          example: "git prune -n                     # Dry run preview of objects to prune\ngit prune --expire 2.weeks.ago   # Prune objects older than 2 weeks\ngit prune --progress",
          practice: "1. Create an unreachable commit and expire its reflog entry.\n2. Run a dry-run preview: git prune --dry-run.\n3. Execute prune to clean up unreachable objects.\n4. Verify with git fsck that no dangling objects remain.",
          commonMistake: "Running \"git prune\" without expiring reflogs first (reflogs prevent objects from being considered unreachable)."
        }
      },
      {
        id: '40000000-0000-4000-8000-000000000024',
        slug: "git-repack",
        title: "Plumbing: Packing Loose Objects into Packfiles (git repack)",
        objective: "Combine loose objects into delta-compressed packfiles and generate pack index files.",
        estimated_minutes: 15,
        content: {
          summary: "\"git repack\" aggregates individual loose object files into single packfiles (.pack) with binary index lookup tables (.idx), calculating delta compression across similar files.",
          why: "The core storage compression engine that gives Git its unmatched speed and minimal disk footprint.",
          command: "git repack -a -d --depth=50 --window=250",
          example: "git repack -a -d                 # Pack all objects and delete redundant loose objects\ngit repack -A -d                 # Pack all reachable objects\ngit verify-pack -v .git/objects/pack/*.idx # Inspect packfile contents",
          practice: "1. Create several commits with loose objects.\n2. Run git repack -a -d to pack all objects.\n3. Inspect the generated .pack and .idx files in .git/objects/pack/.\n4. Verify packfile contents with git verify-pack.",
          commonMistake: "Assuming loose objects are permanently kept loose; Git automatically repacks objects when loose counts exceed thresholds."
        }
      },
      {
        id: '40000000-0000-4000-8000-000000000025',
        slug: "git-count-objects",
        title: "Plumbing: Inspecting Object Counts & Storage Metrics (git count-objects)",
        objective: "Inspect loose object counts, packfile counts, and repository disk consumption.",
        estimated_minutes: 10,
        content: {
          summary: "\"git count-objects -v\" reports the exact count of loose objects on disk, their size in kilobytes, the number of packfiles, and total repository storage.",
          why: "Provides instant diagnostics on whether a repository requires garbage collection or contains bloated packfiles.",
          command: "git count-objects -v -H",
          example: "git count-objects               # Show loose object count and disk size\ngit count-objects -v            # Detailed verbose diagnostic\ngit count-objects -v -H         # Human-readable sizes (MB/GB)",
          practice: "1. Run git count-objects to check current loose objects.\n2. Run git count-objects -v -H for a human-readable storage summary.\n3. Create 5 new commits and observe count increase.\n4. Run git gc and observe the counts consolidate into packfiles.",
          commonMistake: "Judging repository health solely by total directory size without checking if loose objects are un-packed."
        }
      },
      {
        id: '40000000-0000-4000-8000-000000000026',
        slug: "git-fsck",
        title: "Plumbing: Verifying Object Database Integrity (git fsck)",
        objective: "Verify connectivity, cryptographic hashes, and health of all objects in the repository database.",
        estimated_minutes: 15,
        content: {
          summary: "\"git fsck\" (File System Consistency Check) verifies the integrity of the object database, checking SHA hashes, detecting corrupted blobs, and listing dangling (unreachable) commits.",
          why: "Diagnoses corrupted repositories after sudden power outages, disk failures, or broken network transfers.",
          command: "git fsck --full --strict",
          example: "git fsck                         # Check repository connectivity\ngit fsck --full --strict         # Strict thorough validation\ngit fsck --lost-found            # Export dangling objects to .git/lost-found/",
          practice: "1. Run git fsck to verify complete repository integrity.\n2. Inspect any reported dangling blobs or commits.\n3. Export dangling objects with git fsck --lost-found.\n4. Confirm zero corruption reported.",
          commonMistake: "Assuming \"dangling commit\" warnings mean repository corruption (dangling commits are simply unreferenced commits waiting for gc)."
        }
      },
      {
        id: '40000000-0000-4000-8000-000000000027',
        slug: "git-maintenance",
        title: "Automating Background Maintenance & Optimization (git maintenance)",
        objective: "Configure automated background maintenance tasks (prefetch, gc, commit-graph, loose-objects).",
        estimated_minutes: 15,
        content: {
          summary: "Introduced in Git 2.29, \"git maintenance\" registers system background scheduler tasks (cron/systemd/launchd) to prefetch remote updates, repack loose objects, and update the commit-graph hourly.",
          why: "Maintains peak performance on massive enterprise repositories automatically in the background.",
          command: "git maintenance start && git maintenance run",
          example: "git maintenance start            # Enable background scheduler tasks\ngit maintenance run --task=gc    # Manually trigger specific maintenance task\ngit maintenance stop             # Disable background maintenance",
          practice: "1. Start background maintenance with git maintenance start.\n2. Run an immediate maintenance cycle: git maintenance run.\n3. Inspect configured maintenance tasks with git config --get-regexp maintenance.\n4. Learn how commit-graph acceleration speeds up git log.",
          commonMistake: "Manually scheduling ad-hoc cron jobs for \"git gc\" instead of using the standardized \"git maintenance start\" tool."
        }
      },
      {
        id: '40000000-0000-4000-8000-000000000028',
        slug: "git-archive",
        title: "Exporting Clean Code Archives & Tarballs (git archive)",
        objective: "Create clean zip and tar.gz release archives of any commit or tree without .git metadata.",
        estimated_minutes: 12,
        content: {
          summary: "\"git archive\" exports the working files of a specific commit, branch, or release tag into a clean .zip or .tar.gz archive, excluding all .git metadata and respecting .gitattributes export-ignore rules.",
          why: "Standard tool for generating production deployment tarballs and release asset packages.",
          command: "git archive --format=zip --output=release.zip HEAD",
          example: "git archive -o release.zip HEAD  # Export current HEAD as zip\ngit archive --format=tar.gz -o v1.0.tar.gz v1.0.0 # Export tag as tarball\ngit archive --prefix=project/ -o app.zip main # Add root folder prefix inside zip",
          practice: "1. Export your latest commit to a zip archive: git archive -o build.zip HEAD.\n2. Unzip and verify that no .git folder is included.\n3. Add export-ignore to .gitattributes for test folders.\n4. Verify that ignored test files are excluded from the exported archive.",
          commonMistake: "Manually zipping repository folders and accidentally including private .git history, secrets, and gitignored files in production builds."
        }
      },
      {
        id: '40000000-0000-4000-8000-000000000029',
        slug: "git-bundle",
        title: "Packaging Commits into Offline Bundle Files (git bundle)",
        objective: "Package repository branches and commits into standalone binary bundle files for offline transport.",
        estimated_minutes: 15,
        content: {
          summary: "\"git bundle\" packages Git objects and references into a single binary file that can be transported via USB drive or air-gapped network and cloned/fetched like a standard remote repository.",
          why: "Enables full Git collaboration in secure air-gapped defense, aerospace, or offline environments without network connectivity.",
          command: "git bundle create repo.bundle --all",
          example: "git bundle create my-feature.bundle main..feature/auth\ngit bundle verify my-feature.bundle\ngit clone my-feature.bundle -b feature/auth my-app\ngit pull my-feature.bundle feature/auth",
          practice: "1. Create a bundle of your feature branch: git bundle create feature.bundle main..HEAD.\n2. Verify the bundle integrity with git bundle verify feature.bundle.\n3. In a separate directory, fetch from the bundle: git pull path/to/feature.bundle.\n4. Observe how offline Git transport works seamlessly.",
          commonMistake: "Creating a bundle with missing prerequisite commits that the target recipient repository does not possess."
        }
      },
      {
        id: '40000000-0000-4000-8000-000000000030',
        slug: "git-credential",
        title: "Plumbing: Managing Credentials & Auth Helpers (git credential)",
        objective: "Store, retrieve, and approve authentication credentials using native credential helpers.",
        estimated_minutes: 12,
        content: {
          summary: "\"git credential\" is the low-level interface that communicates with OS credential managers (Windows Credential Manager, macOS Keychain, Linux libsecret) to securely store and retrieve HTTPS personal access tokens.",
          why: "Ensures secure credential storage so developers do not have to type passwords on every push/fetch.",
          command: "git config --global credential.helper store # (or manager/osxkeychain)",
          example: "git config --global credential.helper osxkeychain # macOS\ngit config --global credential.helper manager     # Windows/Cross-platform\necho \"protocol=https\nhost=github.com\" | git credential fill",
          practice: "1. Check your active credential helper: git config --global credential.helper.\n2. Query the credential helper for a host using git credential fill.\n3. Understand how tokens are securely encrypted in OS keychains.\n4. Configure the official Git Credential Manager.",
          commonMistake: "Saving plaintext passwords in configuration files instead of using encrypted OS credential helpers."
        }
      }
    ]
  }
};
