import { useMemo, useState } from 'react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../components/ui/Select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '../components/ui/Dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../components/ui/Table';
import { Plus, ArrowLeft, Users, Bot, Workflow, Trash2 } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface Level3Access {
  level2: string;
  level3: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  level2: string;
  level3: string;
  agents: string[];
  workflows: string[];
  userIds: string[];
}

const users: User[] = [
  { id: 'u2', name: 'Carol Smith', email: 'carol@acme.com' },
  { id: 'u3', name: 'Bob Wilson', email: 'bob@acme.com' },
  { id: 'u4', name: 'Jane Doe', email: 'jane@acme.com' },
  { id: 'u5', name: 'Mike Chen', email: 'mike@acme.com' },
  { id: 'u6', name: 'Riya Patel', email: 'riya@acme.com' }
];

const userLevel3Assignments: Record<string, Level3Access[]> = {
  u2: [{ level2: 'North America', level3: 'Sales' }],
  u3: [{ level2: 'Europe', level3: 'Engineering' }],
  u4: [{ level2: 'Asia Pacific', level3: 'Operations' }],
  u5: [{ level2: 'North America', level3: 'Engineering' }],
  u6: [
    { level2: 'North America', level3: 'Engineering' },
    { level2: 'Europe', level3: 'Engineering' }
  ]
};

const initialProjects: Project[] = [
  {
    id: 'p1',
    name: 'Sales Ops Copilot',
    description: 'Sales enablement project for lead qualification.',
    level2: 'North America',
    level3: 'Sales',
    agents: ['Lead Qualifier', 'Outbound Drafter'],
    workflows: ['Inbound Triage'],
    userIds: ['u2']
  },
  {
    id: 'p2',
    name: 'Engineering Assist',
    description: 'Internal engineering productivity project.',
    level2: 'Europe',
    level3: 'Engineering',
    agents: ['PR Reviewer', 'Incident Summarizer', 'Release Notes Bot'],
    workflows: ['Bug Intake', 'Release Readiness'],
    userIds: ['u3', 'u6']
  }
];

const levelKey = (level2: string, level3: string) => `${level2}:::${level3}`;

export function ProjectsPage() {
  // Simulated signed-in user access context (UX-only mocked data).
  const currentUserId = 'u6';
  const currentUserContexts = userLevel3Assignments[currentUserId] ?? [];

  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newLevel2, setNewLevel2] = useState(currentUserContexts[0]?.level2 ?? '');
  const [newLevel3, setNewLevel3] = useState(currentUserContexts[0]?.level3 ?? '');
  const [userToAdd, setUserToAdd] = useState('');

  const accessibleScopeKeys = useMemo(
    () =>
    new Set(
      currentUserContexts.map((scope) => levelKey(scope.level2, scope.level3))
    ),
    [currentUserContexts]
  );

  const selectedProject =
  projects.find(
    (project) =>
    project.id === selectedProjectId &&
    accessibleScopeKeys.has(levelKey(project.level2, project.level3))
  ) ?? null;

  const visibleProjects = useMemo(() => {
    return projects.filter((project) =>
    accessibleScopeKeys.has(levelKey(project.level2, project.level3))
    );
  }, [projects, accessibleScopeKeys]);

  const allowedCreateScopes = useMemo(
    () => accessibleScopeKeys,
    [accessibleScopeKeys]
  );

  const visibleLevel2Options = useMemo(
    () => [...new Set(currentUserContexts.map((scope) => scope.level2))],
    [currentUserContexts]
  );

  const visibleLevel3Options = useMemo(
    () =>
    currentUserContexts.
    filter((scope) => scope.level2 === newLevel2).
    map((scope) => scope.level3).
    filter((level3, index, all) => all.indexOf(level3) === index).
    filter((level3) =>
    allowedCreateScopes.has(levelKey(newLevel2, level3))
    ),
    [currentUserContexts, newLevel2, allowedCreateScopes]
  );

  const eligibleUsersForProject = useMemo(() => {
    if (!selectedProject) return [];
    const scopeKey = levelKey(selectedProject.level2, selectedProject.level3);
    return users.filter((user) => {
      if (selectedProject.userIds.includes(user.id)) return false;
      const assignments = userLevel3Assignments[user.id] ?? [];
      return assignments.some(
        (assignment) => levelKey(assignment.level2, assignment.level3) === scopeKey
      );
    });
  }, [selectedProject]);

  const resetCreateForm = () => {
    const defaultContext = currentUserContexts[0];
    setNewName('');
    setNewDescription('');
    setNewLevel2(defaultContext?.level2 ?? '');
    setNewLevel3(defaultContext?.level3 ?? '');
  };

  const openCreateDialog = () => {
    resetCreateForm();
    setIsCreateOpen(true);
  };

  const handleCreateProject = () => {
    if (!newName.trim() || !newLevel2 || !newLevel3) return;
    if (!allowedCreateScopes.has(levelKey(newLevel2, newLevel3))) return;

    const createdProject: Project = {
      id: Math.random().toString(36).slice(2),
      name: newName.trim(),
      description: newDescription.trim(),
      level2: newLevel2,
      level3: newLevel3,
      agents: [],
      workflows: [],
      userIds: [currentUserId]
    };
    setProjects((prev) => [createdProject, ...prev]);
    setSelectedProjectId(createdProject.id);
    setIsCreateOpen(false);
  };

  const handleAddUserToProject = () => {
    if (!selectedProject || !userToAdd) return;
    setProjects((prev) =>
    prev.map((project) =>
    project.id === selectedProject.id ?
    { ...project, userIds: [...project.userIds, userToAdd] } :
    project
    )
    );
    setUserToAdd('');
    setIsAddUserOpen(false);
  };

  const handleRemoveUserFromProject = (userId: string) => {
    if (!selectedProject) return;
    setProjects((prev) =>
    prev.map((project) =>
    project.id === selectedProject.id ?
    { ...project, userIds: project.userIds.filter((id) => id !== userId) } :
    project
    )
    );
  };

  if (selectedProject) {
    const projectUsers = users.filter((user) => selectedProject.userIds.includes(user.id));

    return (
      <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <button
              onClick={() => setSelectedProjectId(null)}
              className="flex items-center text-sm text-slate-500 hover:text-slate-900 mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Projects
            </button>
            <h1 className="text-3xl font-semibold mb-2">{selectedProject.name}</h1>
            <p className="text-muted-foreground">{selectedProject.description || 'No description.'}</p>
            <div className="mt-3">
              <Badge variant="outline" className="bg-slate-50 border-slate-200 text-slate-700">
                {selectedProject.level2} / {selectedProject.level3}
              </Badge>
            </div>
          </div>
          <Button
            onClick={() => setIsAddUserOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white gap-2">
            <Plus className="w-4 h-4" />
            Add User
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="border rounded-lg bg-white p-4">
            <div className="flex items-center gap-2 mb-3 text-sm font-medium">
              <Bot className="w-4 h-4 text-slate-500" />
              Agents ({selectedProject.agents.length})
            </div>
            <div className="space-y-2">
              {selectedProject.agents.length > 0 ?
              selectedProject.agents.map((agent) =>
              <div key={agent} className="text-sm border rounded-md px-3 py-2 bg-slate-50">
                    {agent}
                  </div>
              ) :
              <p className="text-sm text-muted-foreground">No agents in this project.</p>
              }
            </div>
          </div>

          <div className="border rounded-lg bg-white p-4">
            <div className="flex items-center gap-2 mb-3 text-sm font-medium">
              <Workflow className="w-4 h-4 text-slate-500" />
              Workflows ({selectedProject.workflows.length})
            </div>
            <div className="space-y-2">
              {selectedProject.workflows.length > 0 ?
              selectedProject.workflows.map((flow) =>
              <div key={flow} className="text-sm border rounded-md px-3 py-2 bg-slate-50">
                    {flow}
                  </div>
              ) :
              <p className="text-sm text-muted-foreground">No workflows in this project.</p>
              }
            </div>
          </div>

          <div className="border rounded-lg bg-white p-4">
            <div className="flex items-center gap-2 mb-3 text-sm font-medium">
              <Users className="w-4 h-4 text-slate-500" />
              Users ({projectUsers.length})
            </div>
            <div className="space-y-2">
              {projectUsers.length > 0 ?
              projectUsers.map((user) =>
              <div
                key={user.id}
                className="flex items-center justify-between border rounded-md px-3 py-2 bg-slate-50">
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => handleRemoveUserFromProject(user.id)}
                    title="Remove user from project">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ) :
              <p className="text-sm text-muted-foreground">No users assigned.</p>
              }
            </div>
          </div>
        </div>

        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogContent className="sm:max-w-[460px]">
            <DialogHeader>
              <DialogTitle>Add User to Project</DialogTitle>
              <DialogDescription>
                Only users with access to {selectedProject.level2} / {selectedProject.level3} can be added.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2 py-2">
              <Label>Select user</Label>
              <Select value={userToAdd} onValueChange={setUserToAdd}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an eligible user" />
                </SelectTrigger>
                <SelectContent>
                  {eligibleUsersForProject.map((user) =>
                  <SelectItem key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {eligibleUsersForProject.length === 0 &&
              <p className="text-xs text-muted-foreground">
                  No eligible users available for this project scope.
                </p>
              }
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAddUserToProject}
                disabled={!userToAdd}
                className="bg-blue-500 hover:bg-blue-600 text-white">
                Add User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>);
  }

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Projects</h1>
          <p className="text-muted-foreground">
            Create Level 3 scoped projects and control which users can access them.
          </p>
        </div>
        <Button
          onClick={openCreateDialog}
          className="bg-blue-500 hover:bg-blue-600 text-white gap-2 shrink-0">
          <Plus className="w-4 h-4" />
          Create Project
        </Button>
      </div>

      <div className="border rounded-lg bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Level 2</TableHead>
              <TableHead>Level 3</TableHead>
              <TableHead>Agents</TableHead>
              <TableHead>Workflows</TableHead>
              <TableHead>Users</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleProjects.map((project) =>
            <TableRow
              key={project.id}
              className="cursor-pointer"
              onClick={() => setSelectedProjectId(project.id)}>
                <TableCell className="font-medium">{project.name}</TableCell>
                <TableCell className="max-w-[360px] truncate">
                  {project.description || '-'}
                </TableCell>
                <TableCell>{project.level2}</TableCell>
                <TableCell>{project.level3}</TableCell>
                <TableCell>{project.agents.length}</TableCell>
                <TableCell>{project.workflows.length}</TableCell>
                <TableCell>{project.userIds.length}</TableCell>
              </TableRow>
            )}
            {visibleProjects.length === 0 &&
            <TableRow>
                <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                  No projects in your accessible levels yet. Create your first project.
                </TableCell>
              </TableRow>
            }
          </TableBody>
        </Table>
      </div>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Create Project</DialogTitle>
            <DialogDescription>
              Projects are created inside a Level 3 scope and are visible only to users in that scope.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Project Name</Label>
              <Input
                placeholder="e.g. Support QA Automation"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                autoFocus />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                placeholder="What is this project for?"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Level 2</Label>
              <Select
                value={newLevel2}
                onValueChange={(value) => {
                  setNewLevel2(value);
                  setNewLevel3('');
                }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Level 2" />
                </SelectTrigger>
                <SelectContent>
                  {visibleLevel2Options.map((level2) =>
                  <SelectItem key={level2} value={level2}>
                      {level2}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Level 3</Label>
              <Select
                value={newLevel3}
                onValueChange={(value) => {
                  setNewLevel3(value);
                }}>
                <SelectTrigger disabled={!newLevel2}>
                  <SelectValue placeholder={newLevel2 ? 'Select Level 3' : 'Select Level 2 first'} />
                </SelectTrigger>
                <SelectContent>
                  {visibleLevel3Options.map((level3) =>
                  <SelectItem
                    key={level3}
                    value={level3}>
                      {level3}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                You can create projects only in your own Level 3 contexts.
              </p>
              {newLevel2 && visibleLevel3Options.length === 0 &&
              <p className="text-xs text-amber-700">
                  You do not have Level 3 access under this Level 2.
                </p>
              }
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateProject}
              disabled={!newName.trim() || !allowedCreateScopes.has(levelKey(newLevel2, newLevel3))}
              className="bg-blue-500 hover:bg-blue-600 text-white">
              Create Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>);
}