import React, { useState } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger } from
'./components/ui/Sidebar';
import { OrganizationsPage } from './pages/OrganizationsPage';
import { OverviewPage } from './pages/OverviewPage';
import { HierarchyPage } from './pages/HierarchyPage';
import { UserManagementPage } from './pages/UserManagementPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { AgentsPage } from './pages/AgentsPage';
import { WorkflowPage } from './pages/WorkflowPage';
import {
  Zap,
  Building2,
  Users,
  GitMerge,
  PlaySquare,
  Plug,
  ShieldCheck,
  Database,
  Settings,
  ChevronRight,
  ChevronDown,
  LayoutDashboard,
  Network,
  UserCog,
  FolderKanban,
  Bot,
  Workflow } from
'lucide-react';
export function App() {
  const [activePage, setActivePage] = useState('organizations');
  const [isOrgMenuOpen, setIsOrgMenuOpen] = useState(true);
  const [isBuilderMenuOpen, setIsBuilderMenuOpen] = useState(true);
  const renderPage = () => {
    switch (activePage) {
      case 'organizations':
        return <OrganizationsPage />;
      case 'overview':
        return <OverviewPage />;
      case 'hierarchy':
        return <HierarchyPage />;
      case 'user-management':
        return <UserManagementPage />;
      case 'projects':
        return <ProjectsPage />;
      case 'agents':
        return <AgentsPage />;
      case 'workflow':
        return <WorkflowPage />;
      default:
        return <OrganizationsPage />;
    }
  };
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar
          className="border-r-0 bg-slate-950 text-slate-300"
          variant="sidebar">
          
          <SidebarHeader className="p-4 border-b border-slate-800/50">
            <div className="flex items-center gap-3 px-2">
              <div className="bg-blue-500 p-1.5 rounded-md text-white">
                <Zap className="w-5 h-5 fill-current" />
              </div>
              <span className="font-semibold text-white text-lg tracking-tight">
                Agent Forge
              </span>
            </div>
          </SidebarHeader>
          <SidebarContent className="p-4">
            <SidebarGroup>
              <div className="text-xs font-semibold text-slate-500 mb-2 px-2 tracking-wider">
                PLATFORM
              </div>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={activePage === 'organizations'}
                    onClick={() => setActivePage('organizations')}
                    className={
                    activePage === 'organizations' ?
                    'bg-slate-800/50 text-white hover:bg-slate-800 hover:text-white' :
                    'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                    }>
                    
                    <Building2 className="w-4 h-4 mr-2" />
                    <span>Organizations</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>

            <SidebarGroup className="mt-4">
              <button
                onClick={() => setIsOrgMenuOpen(!isOrgMenuOpen)}
                className="flex items-center justify-between w-full text-xs font-semibold text-slate-500 mb-2 px-2 tracking-wider hover:text-slate-400 transition-colors">
                
                <span>ORGANIZATION</span>
                {isOrgMenuOpen ?
                <ChevronDown className="w-3.5 h-3.5" /> :

                <ChevronRight className="w-3.5 h-3.5" />
                }
              </button>
              {isOrgMenuOpen &&
              <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                    isActive={activePage === 'overview'}
                    onClick={() => setActivePage('overview')}
                    className={
                    activePage === 'overview' ?
                    'bg-slate-800/50 text-white hover:bg-slate-800 hover:text-white' :
                    'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                    }>
                    
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      <span>Overview</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                    isActive={activePage === 'hierarchy'}
                    onClick={() => setActivePage('hierarchy')}
                    className={
                    activePage === 'hierarchy' ?
                    'bg-slate-800/50 text-white hover:bg-slate-800 hover:text-white' :
                    'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                    }>
                    
                      <Network className="w-4 h-4 mr-2" />
                      <span>Hierarchy</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                    isActive={activePage === 'user-management'}
                    onClick={() => setActivePage('user-management')}
                    className={
                    activePage === 'user-management' ?
                    'bg-slate-800/50 text-white hover:bg-slate-800 hover:text-white' :
                    'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                    }>
                    
                      <UserCog className="w-4 h-4 mr-2" />
                      <span>User Management</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              }
            </SidebarGroup>

            <SidebarGroup className="mt-4">
              <button
                onClick={() => setIsBuilderMenuOpen(!isBuilderMenuOpen)}
                className="flex items-center justify-between w-full text-xs font-semibold text-slate-500 mb-2 px-2 tracking-wider hover:text-slate-400 transition-colors">
                
                <span>BUILDER</span>
                {isBuilderMenuOpen ?
                <ChevronDown className="w-3.5 h-3.5" /> :

                <ChevronRight className="w-3.5 h-3.5" />
                }
              </button>
              {isBuilderMenuOpen &&
              <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                    isActive={activePage === 'projects'}
                    onClick={() => setActivePage('projects')}
                    className={
                    activePage === 'projects' ?
                    'bg-slate-800/50 text-white hover:bg-slate-800 hover:text-white' :
                    'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                    }>
                    
                      <FolderKanban className="w-4 h-4 mr-2" />
                      <span>Projects</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                    isActive={activePage === 'agents'}
                    onClick={() => setActivePage('agents')}
                    className={
                    activePage === 'agents' ?
                    'bg-slate-800/50 text-white hover:bg-slate-800 hover:text-white' :
                    'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                    }>
                    
                      <Bot className="w-4 h-4 mr-2" />
                      <span>Agents</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                    isActive={activePage === 'workflow'}
                    onClick={() => setActivePage('workflow')}
                    className={
                    activePage === 'workflow' ?
                    'bg-slate-800/50 text-white hover:bg-slate-800 hover:text-white' :
                    'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                    }>
                    
                      <GitMerge className="w-4 h-4 mr-2" />
                      <span>Workflow</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              }
            </SidebarGroup>

            <SidebarGroup className="mt-4">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton className="text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 justify-between">
                    <div className="flex items-center">
                      <PlaySquare className="w-4 h-4 mr-2 opacity-70" />
                      <span>RUNS</span>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton className="text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 justify-between">
                    <div className="flex items-center">
                      <Plug className="w-4 h-4 mr-2 opacity-70" />
                      <span>INTEGRATIONS</span>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton className="text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 justify-between">
                    <div className="flex items-center">
                      <ShieldCheck className="w-4 h-4 mr-2 opacity-70" />
                      <span>GOVERNANCE</span>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton className="text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 justify-between">
                    <div className="flex items-center">
                      <Database className="w-4 h-4 mr-2 opacity-70" />
                      <span>DATA & MEMORY</span>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton className="text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 justify-between">
                    <div className="flex items-center">
                      <Settings className="w-4 h-4 mr-2 opacity-70" />
                      <span>SETTINGS</span>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="flex flex-col flex-1 bg-white">
          <header className="h-14 border-b flex items-center justify-between px-4 bg-white shrink-0">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-slate-500 hover:text-slate-900" />
            </div>
            <div className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 py-1.5 px-2 rounded-md transition-colors">
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium">
                AJ
              </div>
              <span className="text-sm font-medium text-slate-700">
                Alex Johnson
              </span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </div>
          </header>
          <main className="flex-1 overflow-auto bg-slate-50/50">
            {renderPage()}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>);

}