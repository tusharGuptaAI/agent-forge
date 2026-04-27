import React, { useMemo, useState } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Badge } from '../components/ui/Badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter } from
'../components/ui/Dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue } from
'../components/ui/Select';
import {
  Search,
  UserPlus,
  Plus,
  X,
  Copy,
  ChevronDown,
  ChevronRight,
  Settings2,
  Globe,
  Building2,
  FolderOpen,
  Info,
  AlertTriangle } from
'lucide-react';
// --- Types ---
type Scope = 'organization' | 'level2' | 'level3';
type OrgRole = 'Admin' | 'Viewer';
type Level2Role = 'Admin' | 'Viewer';
type Level3Role = 'Admin' | 'Builder' | 'Viewer';
interface User {
  id: string;
  name: string;
  email: string;
  status: 'Active' | 'Pending';
}
interface Assignment {
  id: string;
  userId: string;
  scope: Scope;
  role: string;
  level2?: string;
  level3?: string;
}
// --- Hierarchy data ---
const hierarchyData: Record<string, string[]> = {
  'North America': ['Engineering', 'Sales', 'Support'],
  Europe: ['Engineering', 'Marketing'],
  'Asia Pacific': ['Operations']
};
const allLevel2s = Object.keys(hierarchyData);
const allLevel3s = [...new Set(Object.values(hierarchyData).flat())];
const generatePassword = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let pw = '';
  for (let i = 0; i < 16; i++)
  pw += chars.charAt(Math.floor(Math.random() * chars.length));
  return pw;
};
const getRolesForScope = (scope: Scope): string[] => {
  switch (scope) {
    case 'organization':
      return ['Organization Admin', 'Organization Viewer'];
    case 'level2':
      return ['Level 2 Admin', 'Level 2 Viewer'];
    case 'level3':
      return ['Level 3 Admin', 'Level 3 Builder', 'Level 3 Viewer'];
  }
};
const getScopeLabel = (scope: Scope): string => {
  switch (scope) {
    case 'organization':
      return 'Organization';
    case 'level2':
      return 'Level 2';
    case 'level3':
      return 'Level 3';
  }
};
const getRoleLabel = (assignment: Assignment): string => {
  return assignment.role;
};
const getAccessDescription = (assignment: Assignment): string => {
  switch (assignment.scope) {
    case 'organization':
      return assignment.role === 'Organization Admin' ?
      'Full access to all Level 2 and Level 3' :
      'View access to all Level 2 and Level 3';
    case 'level2':
      return assignment.role === 'Level 2 Admin' ?
      `Full access to all Level 3 under ${assignment.level2}` :
      `View access to all Level 3 under ${assignment.level2}`;
    case 'level3':
      if (assignment.role === 'Level 3 Admin')
      return `Full access to ${assignment.level3} under ${assignment.level2}`;
      if (assignment.role === 'Level 3 Builder')
      return `Builder access to ${assignment.level3} under ${assignment.level2}`;
      return `View access to ${assignment.level3} under ${assignment.level2}`;
  }
};
// --- Initial data ---
const initialUsers: User[] = [
{
  id: 'u1',
  name: 'Alex Johnson',
  email: 'alex@acme.com',
  status: 'Active'
},
{
  id: 'u2',
  name: 'Carol Smith',
  email: 'carol@acme.com',
  status: 'Active'
},
{
  id: 'u3',
  name: 'Bob Wilson',
  email: 'bob@acme.com',
  status: 'Pending'
},
{
  id: 'u4',
  name: 'Jane Doe',
  email: 'jane@acme.com',
  status: 'Active'
},
{
  id: 'u5',
  name: 'Mike Chen',
  email: 'mike@acme.com',
  status: 'Active'
}];

const initialAssignments: Assignment[] = [
// Alex: Org Admin — full access everywhere
{
  id: 'a1',
  userId: 'u1',
  scope: 'organization',
  role: 'Organization Admin'
},
// Carol: Level 2 Admin on Europe + Level 3 Builder on North America/Sales
{
  id: 'a2',
  userId: 'u2',
  scope: 'level2',
  role: 'Level 2 Admin',
  level2: 'Europe'
},
{
  id: 'a3',
  userId: 'u2',
  scope: 'level3',
  role: 'Level 3 Builder',
  level2: 'North America',
  level3: 'Sales'
},
// Bob: Level 2 Viewer on North America + Level 3 Builder on Europe/Engineering
{
  id: 'a4',
  userId: 'u3',
  scope: 'level2',
  role: 'Level 2 Viewer',
  level2: 'North America'
},
{
  id: 'a5',
  userId: 'u3',
  scope: 'level3',
  role: 'Level 3 Builder',
  level2: 'Europe',
  level3: 'Engineering'
},
// Jane: single Level 3 Builder
{
  id: 'a6',
  userId: 'u4',
  scope: 'level3',
  role: 'Level 3 Builder',
  level2: 'Asia Pacific',
  level3: 'Operations'
},
// Mike: single Level 3 Admin
{
  id: 'a7',
  userId: 'u5',
  scope: 'level3',
  role: 'Level 3 Admin',
  level2: 'North America',
  level3: 'Engineering'
}];

interface UserGroup {
  user: User;
  assignments: Assignment[];
}
export function UserManagementPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [assignments, setAssignments] =
  useState<Assignment[]>(initialAssignments);
  const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set());
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterScope, setFilterScope] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  // Invite dialog
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteScope, setInviteScope] = useState<Scope>('level3');
  const [inviteLevel2, setInviteLevel2] = useState('');
  const [inviteLevel3, setInviteLevel3] = useState('');
  const [inviteRole, setInviteRole] = useState('');
  const [invitePassword, setInvitePassword] = useState('');
  // Add assignment dialog
  const [isAddAssignOpen, setIsAddAssignOpen] = useState(false);
  const [assignUserId, setAssignUserId] = useState('');
  const [assignScope, setAssignScope] = useState<Scope>('level3');
  const [assignLevel2, setAssignLevel2] = useState('');
  const [assignLevel3, setAssignLevel3] = useState('');
  const [assignRole, setAssignRole] = useState('');
  // Manage access dialog
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [manageUserId, setManageUserId] = useState('');
  // Group assignments by user
  const userGroups = useMemo((): UserGroup[] => {
    return users.
    map((user) => ({
      user,
      assignments: assignments.filter((a) => a.userId === user.id)
    })).
    filter((g) => g.assignments.length > 0).
    filter((g) => {
      const matchesSearch =
      searchQuery === '' ||
      g.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesScope =
      filterScope === 'all' ||
      g.assignments.some((a) => a.scope === filterScope);
      const matchesRole =
      filterRole === 'all' ||
      g.assignments.some((a) => a.role === filterRole);
      return matchesSearch && matchesScope && matchesRole;
    });
  }, [users, assignments, searchQuery, filterScope, filterRole]);
  const toggleUserExpand = (userId: string) => {
    const next = new Set(expandedUsers);
    if (next.has(userId)) next.delete(userId);else
    next.add(userId);
    setExpandedUsers(next);
  };
  // Invite
  const openInvite = () => {
    setInviteEmail('');
    setInviteName('');
    setInviteScope('level3');
    setInviteLevel2('');
    setInviteLevel3('');
    setInviteRole('');
    setInvitePassword(generatePassword());
    setIsInviteOpen(true);
  };
  const handleInvite = () => {
    if (!inviteEmail.trim() || !inviteName.trim() || !inviteRole) return;
    if (inviteScope === 'level2' && !inviteLevel2) return;
    if (inviteScope === 'level3' && (!inviteLevel2 || !inviteLevel3)) return;
    const newUser: User = {
      id: Math.random().toString(),
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      status: 'Pending'
    };
    const newAssignment: Assignment = {
      id: Math.random().toString(),
      userId: newUser.id,
      scope: inviteScope,
      role: inviteRole,
      ...(inviteScope !== 'organization' && {
        level2: inviteLevel2
      }),
      ...(inviteScope === 'level3' && {
        level3: inviteLevel3
      })
    };
    setUsers([...users, newUser]);
    setAssignments([...assignments, newAssignment]);
    setExpandedUsers(new Set([...expandedUsers, newUser.id]));
    setIsInviteOpen(false);
  };
  // Add assignment
  const openAddAssignment = (userId: string) => {
    setAssignUserId(userId);
    setAssignScope('level3');
    setAssignLevel2('');
    setAssignLevel3('');
    setAssignRole('');
    setIsAddAssignOpen(true);
  };
  const handleAddAssignment = () => {
    if (!assignRole) return;
    if (assignScope === 'level2' && !assignLevel2) return;
    if (assignScope === 'level3' && (!assignLevel2 || !assignLevel3)) return;
    setAssignments([
    ...assignments,
    {
      id: Math.random().toString(),
      userId: assignUserId,
      scope: assignScope,
      role: assignRole,
      ...(assignScope !== 'organization' && {
        level2: assignLevel2
      }),
      ...(assignScope === 'level3' && {
        level3: assignLevel3
      })
    }]
    );
    setIsAddAssignOpen(false);
  };
  // Manage access
  const openManageAccess = (userId: string) => {
    setManageUserId(userId);
    setIsManageOpen(true);
  };
  const manageUser = users.find((u) => u.id === manageUserId);
  const manageAssignments = assignments.filter((a) => a.userId === manageUserId);
  // Role change
  const handleRoleChange = (assignmentId: string, newRole: string) => {
    setAssignments(
      assignments.map((a) =>
      a.id === assignmentId ?
      {
        ...a,
        role: newRole
      } :
      a
      )
    );
  };
  // Remove assignment
  const handleRemoveAssignment = (assignmentId: string) => {
    setAssignments(assignments.filter((a) => a.id !== assignmentId));
  };
  // Toggle user status
  const handleToggleStatus = (userId: string) => {
    setUsers(
      users.map((u) =>
      u.id === userId ?
      {
        ...u,
        status: u.status === 'Active' ? 'Pending' : 'Active'
      } :
      u
      )
    );
  };
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };
  const getLevel3Options = (level2: string) =>
  level2 ? hierarchyData[level2] || [] : [];
  const assignUser = users.find((u) => u.id === assignUserId);
  const getScopeIcon = (scope: Scope) => {
    switch (scope) {
      case 'organization':
        return <Globe className="w-3.5 h-3.5" />;
      case 'level2':
        return <Building2 className="w-3.5 h-3.5" />;
      case 'level3':
        return <FolderOpen className="w-3.5 h-3.5" />;
    }
  };
  const getScopeBadgeColor = (scope: Scope) => {
    switch (scope) {
      case 'organization':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'level2':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'level3':
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };
  // Scope-aware role assignment form (shared between invite and add assignment)
  const renderScopeRoleForm = (
  scope: Scope,
  setScope: (s: Scope) => void,
  level2: string,
  setLevel2: (v: string) => void,
  level3: string,
  setLevel3: (v: string) => void,
  role: string,
  setRole: (v: string) => void,
  existingAssignments: Assignment[] = []) =>
  {
    // Check for conflicts
    const orgAssignment = existingAssignments.find(
      (a) => a.scope === 'organization'
    );
    const l2Assignment = level2 ?
    existingAssignments.find(
      (a) => a.scope === 'level2' && a.level2 === level2
    ) :
    undefined;
    const hasOrgConflict = scope !== 'organization' && orgAssignment;
    const hasL2Conflict = scope === 'level3' && l2Assignment;
    return (
      <>
        <div className="space-y-2">
          <Label className="font-medium">Access Scope</Label>
          <Select
            value={scope}
            onValueChange={(val) => {
              setScope(val as Scope);
              setLevel2('');
              setLevel3('');
              setRole('');
            }}>
            
            <SelectTrigger>
              <SelectValue placeholder="Select scope" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="organization">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-purple-500" /> Organization
                </div>
              </SelectItem>
              <SelectItem value="level2">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-500" /> Level 2
                </div>
              </SelectItem>
              <SelectItem value="level3">
                <div className="flex items-center gap-2">
                  <FolderOpen className="w-4 h-4 text-slate-500" /> Level 3
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="font-medium">Role</Label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              {getRolesForScope(scope).map((r) =>
              <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        {scope === 'organization' &&
        <div className="p-3 bg-purple-50 border border-purple-100 rounded-lg flex items-start gap-2">
            <Info className="w-4 h-4 text-purple-500 mt-0.5 shrink-0" />
            <p className="text-xs text-purple-700">
              This role grants access to the entire organization. No Level 2 or
              Level 3 selection is needed.
            </p>
          </div>
        }

        {(scope === 'level2' || scope === 'level3') &&
        <div className="space-y-2">
            <Label className="font-medium">Level 2</Label>
            <Select
            value={level2}
            onValueChange={(val) => {
              setLevel2(val);
              setLevel3('');
            }}>
            
              <SelectTrigger>
                <SelectValue placeholder="Select Level 2" />
              </SelectTrigger>
              <SelectContent>
                {allLevel2s.map((l2) =>
              <SelectItem key={l2} value={l2}>
                    {l2}
                  </SelectItem>
              )}
              </SelectContent>
            </Select>
          </div>
        }

        {scope === 'level2' && level2 &&
        <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
            <div className="text-xs text-blue-700">
              <p className="font-medium mb-1">
                Automatically covers all Level 3 under {level2}:
              </p>
              <p className="opacity-90">
                {hierarchyData[level2]?.join(', ') || 'None'}
              </p>
            </div>
          </div>
        }

        {scope === 'level3' &&
        <div className="space-y-2">
            <Label className="font-medium">Level 3</Label>
            <Select value={level3} onValueChange={setLevel3} disabled={!level2}>
              <SelectTrigger>
                <SelectValue
                placeholder={
                level2 ? 'Select Level 3' : 'Select a Level 2 first'
                } />
              
              </SelectTrigger>
              <SelectContent>
                {getLevel3Options(level2).map((l3) =>
              <SelectItem key={l3} value={l3}>
                    {l3}
                  </SelectItem>
              )}
              </SelectContent>
            </Select>
          </div>
        }

        {/* Conflict Warnings */}
        {hasOrgConflict &&
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-700">
              This user already has Organization {orgAssignment?.role} access
              which overrides this assignment.
            </p>
          </div>
        }

        {!hasOrgConflict && hasL2Conflict &&
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-700">
              {l2Assignment?.role} on {level2} already covers all Level 3 under
              it.
            </p>
          </div>
        }
      </>);

  };
  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-semibold mb-2">User Management</h1>
          <p className="text-muted-foreground">
            Manage users and their access across the organization hierarchy.
          </p>
        </div>
        <Button
          onClick={openInvite}
          className="bg-blue-500 hover:bg-blue-600 text-white gap-2 h-10 px-4">
          
          <UserPlus className="w-4 h-4" /> Invite User
        </Button>
      </div>

      {/* Filters */}
      <div className="border rounded-lg bg-card mb-6">
        <div className="p-4 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9" />
            
          </div>
          <Select value={filterScope} onValueChange={setFilterScope}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All scopes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All scopes</SelectItem>
              <SelectItem value="organization">Organization</SelectItem>
              <SelectItem value="level2">Level 2</SelectItem>
              <SelectItem value="level3">Level 3</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roles</SelectItem>
              <SelectItem value="Organization Admin">
                Organization Admin
              </SelectItem>
              <SelectItem value="Organization Viewer">
                Organization Viewer
              </SelectItem>
              <SelectItem value="Level 2 Admin">Level 2 Admin</SelectItem>
              <SelectItem value="Level 2 Viewer">Level 2 Viewer</SelectItem>
              <SelectItem value="Level 3 Admin">Level 3 Admin</SelectItem>
              <SelectItem value="Level 3 Builder">Level 3 Builder</SelectItem>
              <SelectItem value="Level 3 Viewer">Level 3 Viewer</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* User Groups */}
      <div className="space-y-3">
        {userGroups.length === 0 ?
        <div className="border rounded-lg bg-card p-8 text-center text-muted-foreground">
            No users found. Invite a user to get started.
          </div> :

        userGroups.map(({ user, assignments: userAssignments }) => {
          const isExpanded = expandedUsers.has(user.id);
          const assignmentCount = userAssignments.length;
          const hasOrgRole = userAssignments.some(
            (a) => a.scope === 'organization'
          );
          return (
            <div
              key={user.id}
              className="border rounded-lg bg-card overflow-hidden">
              
                {/* User Header */}
                <div className="flex items-center gap-4 px-5 py-4 bg-white">
                  <button
                  onClick={() => toggleUserExpand(user.id)}
                  className="p-0.5 hover:bg-slate-100 rounded text-slate-400 transition-colors">
                  
                    {isExpanded ?
                  <ChevronDown className="w-4 h-4" /> :

                  <ChevronRight className="w-4 h-4" />
                  }
                  </button>
                  <div className="flex items-center gap-3 min-w-[200px]">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-medium text-slate-600">
                      {user.name.
                    split(' ').
                    map((n) => n[0]).
                    join('')}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{user.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {user.email}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-auto">
                    <Badge variant="secondary" className="text-xs font-normal">
                      {assignmentCount}{' '}
                      {assignmentCount === 1 ? 'role' : 'roles'}
                    </Badge>
                    {user.status === 'Active' ?
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200 hover:bg-green-50 font-normal text-xs">
                    
                        Active
                      </Badge> :

                  <Badge
                    variant="outline"
                    className="bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-50 font-normal text-xs">
                    
                        Pending
                      </Badge>
                  }
                    <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-3 text-xs text-slate-500 gap-1.5"
                    onClick={() => openManageAccess(user.id)}>
                    
                      <Settings2 className="w-3.5 h-3.5" /> Manage
                    </Button>
                  </div>
                </div>

                {/* Assignment Rows */}
                {isExpanded &&
              <div className="border-t bg-slate-50/50">
                    <div className="grid grid-cols-[120px_1fr_1fr] gap-4 px-5 py-2 text-xs font-medium text-muted-foreground border-b border-slate-100">
                      <span className="pl-6">Scope</span>
                      <span>Target</span>
                      <span>Access</span>
                    </div>
                    {userAssignments.map((assignment) =>
                <div
                  key={assignment.id}
                  className="grid grid-cols-[120px_1fr_1fr] gap-4 px-5 py-3 items-start border-b border-slate-100 last:border-b-0 hover:bg-slate-50 transition-colors">
                  
                        <div className="pl-6 pt-1">
                          <Badge
                      variant="outline"
                      className={`text-xs font-normal gap-1 ${getScopeBadgeColor(assignment.scope)}`}>
                      
                            {getScopeIcon(assignment.scope)}
                            {getScopeLabel(assignment.scope)}
                          </Badge>
                        </div>
                        <div className="pt-1">
                          <div className="text-sm">
                            {assignment.scope === 'organization' &&
                      'Entire Organization'}
                            {assignment.scope === 'level2' && assignment.level2}
                            {assignment.scope === 'level3' &&
                      `${assignment.level2} → ${assignment.level3}`}
                          </div>
                          {assignment.scope === 'level2' &&
                    assignment.level2 &&
                    <div className="text-xs text-muted-foreground mt-1">
                                Covers:{' '}
                                {hierarchyData[assignment.level2]?.join(', ') ||
                      'None'}
                              </div>
                    }
                        </div>
                        <span className="text-xs text-muted-foreground pt-1.5">
                          {assignment.role} — {getAccessDescription(assignment)}
                        </span>
                      </div>
                )}
                  </div>
              }
              </div>);

        })
        }
      </div>

      {/* Invite User Dialog */}
      <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Invite User</DialogTitle>
            <DialogDescription>
              Send an invitation to join this organization. You can add more
              assignments after the user is created.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="font-medium">Email</Label>
              <Input
                placeholder="user@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                autoFocus />
              
            </div>
            <div className="space-y-2">
              <Label className="font-medium">Name</Label>
              <Input
                placeholder="Full name"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)} />
              
            </div>

            {renderScopeRoleForm(
              inviteScope,
              setInviteScope,
              inviteLevel2,
              setInviteLevel2,
              inviteLevel3,
              setInviteLevel3,
              inviteRole,
              setInviteRole,
              []
            )}

            <div className="space-y-2">
              <Label className="font-medium">Generated Password</Label>
              <div className="flex gap-2">
                <Input readOnly value={invitePassword} className="font-mono" />
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0"
                  onClick={() => copyToClipboard(invitePassword)}>
                  
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Share this password with the user. It will only be shown once.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsInviteOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleInvite}
              className="bg-blue-500 hover:bg-blue-600 text-white">
              
              Send Invite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Assignment Dialog */}
      <Dialog open={isAddAssignOpen} onOpenChange={setIsAddAssignOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Add Assignment</DialogTitle>
            <DialogDescription>
              Add a new role assignment for {assignUser?.name || 'this user'}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {renderScopeRoleForm(
              assignScope,
              setAssignScope,
              assignLevel2,
              setAssignLevel2,
              assignLevel3,
              setAssignLevel3,
              assignRole,
              setAssignRole,
              assignments.filter((a) => a.userId === assignUserId)
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddAssignOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddAssignment}
              className="bg-blue-500 hover:bg-blue-600 text-white">
              
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage Access Dialog */}
      <Dialog open={isManageOpen} onOpenChange={setIsManageOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Manage Access</DialogTitle>
            <DialogDescription>
              {manageUser ?
              `Manage role assignments and status for ${manageUser.name}.` :
              'Manage user access.'}
            </DialogDescription>
          </DialogHeader>
          {manageUser &&
          <div className="py-2 space-y-5">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-sm font-medium text-slate-600">
                    {manageUser.name.
                  split(' ').
                  map((n) => n[0]).
                  join('')}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{manageUser.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {manageUser.email}
                    </div>
                  </div>
                </div>
                <Button
                variant="outline"
                size="sm"
                className={`text-xs h-7 ${manageUser.status === 'Active' ? 'text-amber-600 border-amber-200 hover:bg-amber-50' : 'text-green-600 border-green-200 hover:bg-green-50'}`}
                onClick={() => handleToggleStatus(manageUser.id)}>
                
                  {manageUser.status === 'Active' ? 'Deactivate' : 'Activate'}
                </Button>
              </div>

              <div>
                <div className="text-sm font-medium mb-3">
                  Role Assignments ({manageAssignments.length})
                </div>
                <div className="space-y-2">
                  {manageAssignments.map((a) =>
                <div
                  key={a.id}
                  className="flex items-start justify-between p-3 border rounded-lg bg-white">
                  
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <Badge
                      variant="outline"
                      className={`text-xs font-normal gap-1 shrink-0 mt-0.5 ${getScopeBadgeColor(a.scope)}`}>
                      
                          {getScopeIcon(a.scope)}
                          {getScopeLabel(a.scope)}
                        </Badge>
                        <div className="min-w-0">
                          <div className="text-sm font-medium truncate">
                            {a.scope === 'organization' &&
                        'Entire Organization'}
                            {a.scope === 'level2' && a.level2}
                            {a.scope === 'level3' &&
                        `${a.level2} → ${a.level3}`}
                          </div>
                          {a.scope === 'level2' && a.level2 &&
                      <div className="text-xs text-muted-foreground mt-0.5">
                              Covers:{' '}
                              {hierarchyData[a.level2]?.join(', ') || 'None'}
                            </div>
                      }
                          <div className="text-xs text-muted-foreground truncate mt-0.5">
                            {getAccessDescription(a)}
                          </div>
                        </div>
                        <Select
                      value={a.role}
                      onValueChange={(val) => handleRoleChange(a.id, val)}>
                      
                          <SelectTrigger className="h-7 text-xs w-[100px] shrink-0 ml-auto">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {getRolesForScope(a.scope).map((r) =>
                        <SelectItem key={r} value={r}>
                                {r}
                              </SelectItem>
                        )}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-slate-400 hover:text-red-500 hover:bg-red-50 ml-2 shrink-0"
                    onClick={() => handleRemoveAssignment(a.id)}
                    title="Remove">
                    
                        <X className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                )}
                  {manageAssignments.length === 0 &&
                <div className="text-sm text-muted-foreground text-center py-4">
                      No assignments remaining.
                    </div>
                }
                </div>
              </div>

              <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs"
              onClick={() => {
                setIsManageOpen(false);
                openAddAssignment(manageUser.id);
              }}>
              
                <Plus className="w-3.5 h-3.5" /> Add Assignment
              </Button>
            </div>
          }
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsManageOpen(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>);

}