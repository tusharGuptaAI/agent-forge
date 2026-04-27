import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter } from
'../components/ui/Dialog';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import {
  Plus,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronRight,
  Building2,
  FolderOpen } from
'lucide-react';
interface Level3 {
  id: string;
  name: string;
}
interface Level2 {
  id: string;
  name: string;
  children: Level3[];
}
const initialHierarchy: Level2[] = [
{
  id: '1',
  name: 'North America',
  children: [
  {
    id: '1-1',
    name: 'Engineering'
  },
  {
    id: '1-2',
    name: 'Sales'
  },
  {
    id: '1-3',
    name: 'Support'
  }]

},
{
  id: '2',
  name: 'Europe',
  children: [
  {
    id: '2-1',
    name: 'Engineering'
  },
  {
    id: '2-2',
    name: 'Marketing'
  }]

},
{
  id: '3',
  name: 'Asia Pacific',
  children: [
  {
    id: '3-1',
    name: 'Operations'
  }]

}];

export function HierarchyPage() {
  const [hierarchy, setHierarchy] = useState<Level2[]>(initialHierarchy);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    new Set(['1', '2', '3'])
  );
  // Dialog states
  const [isAddL2Open, setIsAddL2Open] = useState(false);
  const [isAddL3Open, setIsAddL3Open] = useState(false);
  const [isEditL2Open, setIsEditL2Open] = useState(false);
  const [isEditL3Open, setIsEditL3Open] = useState(false);
  // Form states
  const [inputValue, setInputValue] = useState('');
  const [activeParentId, setActiveParentId] = useState<string | null>(null);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };
  // Level 2 Actions
  const handleAddL2 = () => {
    if (!inputValue.trim()) return;
    const newItem: Level2 = {
      id: Math.random().toString(),
      name: inputValue.trim(),
      children: []
    };
    setHierarchy([...hierarchy, newItem]);
    setExpandedItems(new Set([...expandedItems, newItem.id]));
    setIsAddL2Open(false);
    setInputValue('');
  };
  const handleEditL2 = () => {
    if (!inputValue.trim() || !activeItemId) return;
    setHierarchy(
      hierarchy.map((item) =>
      item.id === activeItemId ?
      {
        ...item,
        name: inputValue.trim()
      } :
      item
      )
    );
    setIsEditL2Open(false);
    setInputValue('');
  };
  const handleDeleteL2 = (id: string) => {
    setHierarchy(hierarchy.filter((item) => item.id !== id));
  };
  // Level 3 Actions
  const handleAddL3 = () => {
    if (!inputValue.trim() || !activeParentId) return;
    const newItem: Level3 = {
      id: Math.random().toString(),
      name: inputValue.trim()
    };
    setHierarchy(
      hierarchy.map((item) =>
      item.id === activeParentId ?
      {
        ...item,
        children: [...item.children, newItem]
      } :
      item
      )
    );
    setExpandedItems(new Set([...expandedItems, activeParentId]));
    setIsAddL3Open(false);
    setInputValue('');
  };
  const handleEditL3 = () => {
    if (!inputValue.trim() || !activeItemId || !activeParentId) return;
    setHierarchy(
      hierarchy.map((parent) =>
      parent.id === activeParentId ?
      {
        ...parent,
        children: parent.children.map((child) =>
        child.id === activeItemId ?
        {
          ...child,
          name: inputValue.trim()
        } :
        child
        )
      } :
      parent
      )
    );
    setIsEditL3Open(false);
    setInputValue('');
  };
  const handleDeleteL3 = (parentId: string, childId: string) => {
    setHierarchy(
      hierarchy.map((parent) =>
      parent.id === parentId ?
      {
        ...parent,
        children: parent.children.filter((child) => child.id !== childId)
      } :
      parent
      )
    );
  };
  const openAddL2 = () => {
    setInputValue('');
    setIsAddL2Open(true);
  };
  const openAddL3 = (parentId: string) => {
    setActiveParentId(parentId);
    setInputValue('');
    setIsAddL3Open(true);
  };
  const openEditL2 = (item: Level2) => {
    setActiveItemId(item.id);
    setInputValue(item.name);
    setIsEditL2Open(true);
  };
  const openEditL3 = (parentId: string, item: Level3) => {
    setActiveParentId(parentId);
    setActiveItemId(item.id);
    setInputValue(item.name);
    setIsEditL3Open(true);
  };
  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Hierarchy</h1>
          <p className="text-muted-foreground">
            Define your organization and manage access across Level 2 and Level 3
          </p>
        </div>
        <Button
          onClick={openAddL2}
          className="bg-blue-500 hover:bg-blue-600 text-white gap-2 h-10 px-4">
          
          <Plus className="w-4 h-4" /> Create Level 2
        </Button>
      </div>

      <div className="border rounded-lg bg-card overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Organization Hierarchy</h2>
        </div>

        <div className="p-2">
          {hierarchy.length === 0 ?
          <div className="p-8 text-center text-muted-foreground">
              No hierarchy created yet. Click Create Hierarchy to get started.
            </div> :

          <div className="space-y-1">
              {hierarchy.map((l2) =>
            <div key={l2.id} className="flex flex-col">
                  {/* Level 2 Row */}
                  <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-md group">
                    <div className="flex items-center gap-3">
                      <button
                    onClick={() => toggleExpand(l2.id)}
                    className="p-1 hover:bg-slate-200 rounded text-slate-500">
                    
                        {expandedItems.has(l2.id) ?
                    <ChevronDown className="w-4 h-4" /> :

                    <ChevronRight className="w-4 h-4" />
                    }
                      </button>
                      <Building2 className="w-5 h-5 text-slate-500" />
                      <span className="font-medium">{l2.name}</span>
                      <span className="text-sm text-slate-400 ml-2">
                        (Level 2)
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-500"
                    onClick={() => openAddL3(l2.id)}>
                    
                        <Plus className="w-4 h-4" />
                      </Button>
                      <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-500"
                    onClick={() => openEditL2(l2)}>
                    
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => handleDeleteL2(l2.id)}>
                    
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Level 3 Rows */}
                  {expandedItems.has(l2.id) &&
              <div className="flex flex-col ml-12 border-l pl-4 space-y-1 my-1">
                      {l2.children.map((l3) =>
                <div
                  key={l3.id}
                  className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-md group">
                  
                          <div className="flex items-center gap-3 pl-2">
                            <FolderOpen className="w-4 h-4 text-slate-400" />
                            <span>{l3.name}</span>
                            <span className="text-sm text-slate-400 ml-2">
                              (Level 3)
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-500"
                      onClick={() => openEditL3(l2.id, l3)}>
                      
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => handleDeleteL3(l2.id, l3.id)}>
                      
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                )}
                      {l2.children.length === 0 &&
                <div className="p-2 pl-4 text-sm text-slate-400 italic">
                          No Level 3 items yet.
                        </div>
                }
                    </div>
              }
                </div>
            )}
            </div>
          }
        </div>
      </div>

      {/* Add Level 2 Dialog */}
      <Dialog open={isAddL2Open} onOpenChange={setIsAddL2Open}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Level 2</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="name" className="mb-2 block">
              Name
            </Label>
            <Input
              id="name"
              placeholder="Enter name"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              autoFocus />
            
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddL2Open(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddL2}
              className="bg-blue-500 hover:bg-blue-600 text-white">
              
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Level 2 Dialog */}
      <Dialog open={isEditL2Open} onOpenChange={setIsEditL2Open}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Level 2</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="edit-l2-name" className="mb-2 block">
              Name
            </Label>
            <Input
              id="edit-l2-name"
              placeholder="Enter name"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              autoFocus />
            
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditL2Open(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleEditL2}
              className="bg-blue-500 hover:bg-blue-600 text-white">
              
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Level 3 Dialog */}
      <Dialog open={isAddL3Open} onOpenChange={setIsAddL3Open}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Level 3</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="l3-name" className="mb-2 block">
              Name
            </Label>
            <Input
              id="l3-name"
              placeholder="Enter name"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              autoFocus />
            
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddL3Open(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddL3}
              className="bg-blue-500 hover:bg-blue-600 text-white">
              
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Level 3 Dialog */}
      <Dialog open={isEditL3Open} onOpenChange={setIsEditL3Open}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Level 3</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="edit-l3-name" className="mb-2 block">
              Name
            </Label>
            <Input
              id="edit-l3-name"
              placeholder="Enter name"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              autoFocus />
            
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditL3Open(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleEditL3}
              className="bg-blue-500 hover:bg-blue-600 text-white">
              
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>);

}