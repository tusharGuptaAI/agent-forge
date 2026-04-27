import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow } from
'../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Plus, Pencil } from 'lucide-react';
import { CreateOrganizationDialog } from '../components/CreateOrganizationDialog';
const initialOrgs = [
{
  id: '1',
  name: 'Acme Corp',
  slug: 'acme-corp',
  status: 'Active'
},
{
  id: '2',
  name: 'Globex Industries',
  slug: 'globex',
  status: 'Active'
},
{
  id: '3',
  name: 'Initech',
  slug: 'initech',
  status: 'Setup Pending'
},
{
  id: '4',
  name: 'Umbrella Corp',
  slug: 'umbrella-corp',
  status: 'Active'
},
{
  id: '5',
  name: 'Stark Industries',
  slug: 'stark-industries',
  status: 'Active'
}];

export function OrganizationsPage() {
  const [orgs, setOrgs] = useState(initialOrgs);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const handleCreateOrg = (newOrg: any) => {
    setOrgs([
    {
      id: Math.random().toString(),
      ...newOrg
    },
    ...orgs]
    );
  };
  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Organizations</h1>
          <p className="text-muted-foreground">
            Create and manage organizations and their administrators
          </p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white gap-2 h-10 px-4">
          
          <Plus className="w-4 h-4" /> Create Organization
        </Button>
      </div>

      <div className="border rounded-lg bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[300px] font-medium text-muted-foreground">
                Name
              </TableHead>
              <TableHead className="font-medium text-muted-foreground">
                Slug
              </TableHead>
              <TableHead className="font-medium text-muted-foreground">
                Status
              </TableHead>
              <TableHead className="text-right font-medium text-muted-foreground">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orgs.map((org) =>
            <TableRow key={org.id}>
                <TableCell className="font-medium">{org.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {org.slug}
                </TableCell>
                <TableCell>
                  {org.status === 'Active' ?
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200 hover:bg-green-50 font-normal px-2.5 py-0.5">
                  
                      Active
                    </Badge> :

                <Badge
                  variant="outline"
                  className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50 font-normal px-2.5 py-0.5">
                  
                      Setup Pending
                    </Badge>
                }
                </TableCell>
                <TableCell className="text-right">
                  <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground">
                  
                    <Pencil className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <CreateOrganizationDialog
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onComplete={handleCreateOrg} />
      
    </div>);

}