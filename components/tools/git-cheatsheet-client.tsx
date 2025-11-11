'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Search, GitBranch, CheckCircle2 } from 'lucide-react';

interface GitCommand {
  command: string;
  description: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  examples?: string[];
}

const gitCommands: GitCommand[] = [
  // Basics
  { command: 'git init', description: 'Initialize a new Git repository', category: 'Basics', level: 'beginner' },
  { command: 'git clone <url>', description: 'Clone a repository from URL', category: 'Basics', level: 'beginner', examples: ['git clone https://github.com/user/repo.git'] },
  { command: 'git status', description: 'Check status of working directory', category: 'Basics', level: 'beginner' },
  { command: 'git add <file>', description: 'Stage changes for commit', category: 'Basics', level: 'beginner', examples: ['git add .', 'git add file.txt', 'git add *.js'] },
  { command: 'git commit -m "message"', description: 'Commit staged changes with message', category: 'Basics', level: 'beginner', examples: ['git commit -m "Add new feature"', 'git commit -am "Quick fix"'] },
  { command: 'git log', description: 'View commit history', category: 'Basics', level: 'beginner', examples: ['git log --oneline', 'git log --graph --all'] },
  { command: 'git diff', description: 'Show changes between commits or working tree', category: 'Basics', level: 'beginner', examples: ['git diff HEAD', 'git diff --staged'] },

  // Branching
  { command: 'git branch', description: 'List, create, or delete branches', category: 'Branching', level: 'beginner', examples: ['git branch', 'git branch feature-x', 'git branch -d old-branch'] },
  { command: 'git checkout <branch>', description: 'Switch to a different branch', category: 'Branching', level: 'beginner', examples: ['git checkout main', 'git checkout -b new-feature'] },
  { command: 'git switch <branch>', description: 'Modern way to switch branches', category: 'Branching', level: 'beginner', examples: ['git switch main', 'git switch -c new-branch'] },
  { command: 'git merge <branch>', description: 'Merge branch into current branch', category: 'Branching', level: 'intermediate', examples: ['git merge feature-branch', 'git merge --no-ff feature'] },
  { command: 'git branch -m <old> <new>', description: 'Rename a branch', category: 'Branching', level: 'intermediate' },
  { command: 'git branch -D <branch>', description: 'Force delete a branch', category: 'Branching', level: 'intermediate' },

  // Remote
  { command: 'git remote add <name> <url>', description: 'Add a remote repository', category: 'Remote', level: 'beginner', examples: ['git remote add origin https://github.com/user/repo.git'] },
  { command: 'git remote -v', description: 'List remote repositories', category: 'Remote', level: 'beginner' },
  { command: 'git fetch', description: 'Download objects and refs from remote', category: 'Remote', level: 'beginner', examples: ['git fetch origin', 'git fetch --all'] },
  { command: 'git pull', description: 'Fetch and merge from remote', category: 'Remote', level: 'beginner', examples: ['git pull origin main', 'git pull --rebase'] },
  { command: 'git push', description: 'Upload local changes to remote', category: 'Remote', level: 'beginner', examples: ['git push origin main', 'git push -u origin feature', 'git push --force'] },
  { command: 'git push -u origin <branch>', description: 'Push and set upstream branch', category: 'Remote', level: 'intermediate' },

  // Stashing
  { command: 'git stash', description: 'Temporarily save changes', category: 'Stashing', level: 'intermediate', examples: ['git stash save "work in progress"', 'git stash -u'] },
  { command: 'git stash list', description: 'List all stashed changes', category: 'Stashing', level: 'intermediate' },
  { command: 'git stash pop', description: 'Apply and remove latest stash', category: 'Stashing', level: 'intermediate' },
  { command: 'git stash apply', description: 'Apply stash without removing', category: 'Stashing', level: 'intermediate', examples: ['git stash apply stash@{0}'] },
  { command: 'git stash drop', description: 'Delete a specific stash', category: 'Stashing', level: 'intermediate', examples: ['git stash drop stash@{0}'] },

  // Undoing
  { command: 'git reset <file>', description: 'Unstage a file', category: 'Undoing', level: 'intermediate' },
  { command: 'git reset --soft HEAD~1', description: 'Undo last commit, keep changes staged', category: 'Undoing', level: 'intermediate' },
  { command: 'git reset --hard HEAD~1', description: 'Undo last commit, discard changes', category: 'Undoing', level: 'advanced' },
  { command: 'git revert <commit>', description: 'Create new commit that undoes changes', category: 'Undoing', level: 'intermediate' },
  { command: 'git checkout -- <file>', description: 'Discard changes in working directory', category: 'Undoing', level: 'intermediate' },
  { command: 'git restore <file>', description: 'Modern way to restore files', category: 'Undoing', level: 'intermediate', examples: ['git restore file.txt', 'git restore --staged file.txt'] },

  // Advanced
  { command: 'git rebase <branch>', description: 'Reapply commits on top of another branch', category: 'Advanced', level: 'advanced', examples: ['git rebase main', 'git rebase -i HEAD~3'] },
  { command: 'git cherry-pick <commit>', description: 'Apply specific commit to current branch', category: 'Advanced', level: 'advanced' },
  { command: 'git reflog', description: 'Show reference logs (history of HEAD)', category: 'Advanced', level: 'advanced' },
  { command: 'git tag <name>', description: 'Create a tag', category: 'Advanced', level: 'intermediate', examples: ['git tag v1.0.0', 'git tag -a v1.0.0 -m "Release 1.0"'] },
  { command: 'git blame <file>', description: 'Show who changed each line', category: 'Advanced', level: 'intermediate' },
  { command: 'git bisect', description: 'Binary search to find bug-introducing commit', category: 'Advanced', level: 'advanced', examples: ['git bisect start', 'git bisect bad', 'git bisect good'] },

  // Configuration
  { command: 'git config --global user.name "Name"', description: 'Set your name', category: 'Configuration', level: 'beginner' },
  { command: 'git config --global user.email "email"', description: 'Set your email', category: 'Configuration', level: 'beginner' },
  { command: 'git config --list', description: 'List all configuration', category: 'Configuration', level: 'beginner' },
  { command: 'git config --global alias.<alias> <command>', description: 'Create command alias', category: 'Configuration', level: 'intermediate', examples: ['git config --global alias.st status'] },

  // Inspection
  { command: 'git show <commit>', description: 'Show details of a commit', category: 'Inspection', level: 'intermediate' },
  { command: 'git log --oneline', description: 'Compact commit history', category: 'Inspection', level: 'beginner' },
  { command: 'git log --graph --all', description: 'Visual branch history', category: 'Inspection', level: 'intermediate' },
  { command: 'git log --author="<name>"', description: 'Filter commits by author', category: 'Inspection', level: 'intermediate' },
  { command: 'git shortlog', description: 'Summarize git log output', category: 'Inspection', level: 'intermediate' },
];

export default function GitCheatsheetClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);

  const categories = ['All', ...Array.from(new Set(gitCommands.map((cmd) => cmd.category)))];

  const filteredCommands = gitCommands.filter((cmd) => {
    const matchesSearch =
      cmd.command.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cmd.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || cmd.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || cmd.level === selectedLevel;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const copyCommand = (command: string) => {
    navigator.clipboard.writeText(command);
    setCopiedCommand(command);
    setTimeout(() => setCopiedCommand(null), 2000);
  };

  return (
    <div className="container mx-auto max-w-7xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Git Commands Cheatsheet</h1>
          <p className="text-muted-foreground">
            Quick reference for commonly used Git commands
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          <GitBranch className="mr-1 h-3 w-3" />
          Git
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>About This Tool</CardTitle>
          <CardDescription>
            Comprehensive Git commands reference for developers of all skill levels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Search and discover Git commands for every workflow need. From basic repository operations to advanced branching strategies, this cheatsheet covers 50+ essential Git commands with practical examples. Perfect for beginners learning Git and experienced developers who need quick reference.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2 flex items-center">
                <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                Key Features
              </h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• 50+ commands organized by category</li>
                <li>• Filter by skill level (beginner, intermediate, advanced)</li>
                <li>• Search commands and descriptions</li>
                <li>• Copy commands with one click</li>
                <li>• Practical command examples</li>
                <li>• Git workflow best practices</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 flex items-center">
                <GitBranch className="mr-2 h-4 w-4 text-primary" />
                Use Cases
              </h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Quick Git command lookup</li>
                <li>• Learn Git fundamentals and advanced features</li>
                <li>• Copy commands for terminal use</li>
                <li>• Understand branching strategies</li>
                <li>• Reference during development workflow</li>
                <li>• Teach Git to team members</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>Find the Git command you need</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search commands or descriptions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Tabs value={selectedLevel} onValueChange={setSelectedLevel}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Levels</TabsTrigger>
              <TabsTrigger value="beginner">Beginner</TabsTrigger>
              <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {filteredCommands.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center p-12 text-muted-foreground">
              No commands found matching your criteria
            </CardContent>
          </Card>
        ) : (
          filteredCommands.map((cmd, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <code className="text-lg font-mono font-semibold bg-muted px-3 py-1 rounded">
                        {cmd.command}
                      </code>
                      <Badge variant="outline" className="text-xs">
                        {cmd.level}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {cmd.category}
                      </Badge>
                    </div>
                    <CardDescription className="text-base">{cmd.description}</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyCommand(cmd.command.split(' ')[0] === 'git' ? cmd.command : `git ${cmd.command}`)}
                  >
                    {copiedCommand === (cmd.command.split(' ')[0] === 'git' ? cmd.command : `git ${cmd.command}`) ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              {cmd.examples && cmd.examples.length > 0 && (
                <CardContent>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Examples:</p>
                    {cmd.examples.map((example, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between bg-muted px-3 py-2 rounded text-sm font-mono"
                      >
                        <code>{example}</code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyCommand(example)}
                          className="h-6 w-6 p-0"
                        >
                          {copiedCommand === example ? (
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Git Workflow Tips</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-semibold mb-1">Commit Often</p>
            <p className="text-muted-foreground">Make small, focused commits with clear messages</p>
          </div>
          <div>
            <p className="font-semibold mb-1">Pull Before Push</p>
            <p className="text-muted-foreground">Always pull latest changes before pushing your work</p>
          </div>
          <div>
            <p className="font-semibold mb-1">Use Branches</p>
            <p className="text-muted-foreground">Create feature branches for new work</p>
          </div>
          <div>
            <p className="font-semibold mb-1">Write Good Messages</p>
            <p className="text-muted-foreground">Use descriptive commit messages explaining what and why</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
