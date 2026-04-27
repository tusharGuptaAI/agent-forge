import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter } from
'./ui/Dialog';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { Progress } from './ui/Progress';
import { Copy, Plus, Check } from 'lucide-react';
interface AdminUser {
  id: string;
  email: string;
  password: string;
}
interface CreateOrganizationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (org: any) => void;
}
const generatePassword = () => {
  const chars =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 16; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};
const generateSlug = (name: string) => {
  return name.
  toLowerCase().
  replace(/[^a-z0-9]+/g, '-').
  replace(/(^-|-$)+/g, '');
};
export function CreateOrganizationDialog({
  open,
  onOpenChange,
  onComplete
}: CreateOrganizationDialogProps) {
  const [step, setStep] = useState(1);
  const [orgName, setOrgName] = useState('');
  const [level2Label, setLevel2Label] = useState('');
  const [level3Label, setLevel3Label] = useState('');
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  useEffect(() => {
    if (open) {
      setStep(1);
      setOrgName('');
      setLevel2Label('');
      setLevel3Label('');
      setAdmins([
      {
        id: '1',
        email: '',
        password: generatePassword()
      }]
      );
    }
  }, [open]);
  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };
  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };
  const handleAddAdmin = () => {
    setAdmins([
    ...admins,
    {
      id: Math.random().toString(),
      email: '',
      password: generatePassword()
    }]
    );
  };
  const handleAdminEmailChange = (id: string, email: string) => {
    setAdmins(
      admins.map((a) =>
      a.id === id ?
      {
        ...a,
        email
      } :
      a
      )
    );
  };
  const handleCreate = () => {
    onComplete({
      name: orgName,
      slug: generateSlug(orgName),
      status: 'Setup Pending'
    });
    onOpenChange(false);
  };
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };
  const steps = [
  {
    num: 1,
    label: 'Org Details'
  },
  {
    num: 2,
    label: 'Hierarchy'
  },
  {
    num: 3,
    label: 'Admin User'
  },
  {
    num: 4,
    label: 'Review'
  }];

  const progressValue = step / 4 * 100;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0 overflow-hidden">
        <div className="p-6 pb-4">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-2xl font-semibold">
              Create Organization
            </DialogTitle>
            <DialogDescription className="text-base text-muted-foreground mt-1">
              Step {step} of 4 — {steps[step - 1].label}
            </DialogDescription>
          </DialogHeader>

          <div className="mb-8">
            <Progress
              value={progressValue}
              className="h-2 bg-blue-100 [&>div]:bg-blue-500 mb-4" />
            
            <div className="flex justify-between relative">
              {steps.map((s, i) => {
                const isCompleted = step > s.num;
                const isCurrent = step === s.num;
                return (
                  <div
                    key={s.num}
                    className="flex items-center gap-2 z-10 bg-background pr-2">
                    
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-medium border
                      ${isCompleted ? 'bg-blue-500 border-blue-500 text-white' : isCurrent ? 'border-blue-500 text-blue-500' : 'border-muted-foreground/30 text-muted-foreground/50'}`}>
                      
                      {isCompleted ? <Check className="w-3 h-3" /> : s.num}
                    </div>
                    <span
                      className={`text-sm ${isCurrent || isCompleted ? 'text-blue-500' : 'text-muted-foreground/50'}`}>
                      
                      {s.label}
                    </span>
                  </div>);

              })}
            </div>
          </div>

          <div className="min-h-[280px]">
            {step === 1 &&
            <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="orgName" className="text-base font-medium">
                    Organization Name
                  </Label>
                  <Input
                  id="orgName"
                  placeholder="e.g. Acme Corp"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="h-12 text-base focus-visible:ring-blue-500 border-blue-500"
                  autoFocus />
                
                </div>
              </div>
            }

            {step === 2 &&
            <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="level2" className="text-base font-medium">
                    Level 2 Label
                  </Label>
                  <Input
                  id="level2"
                  placeholder="e.g. Region, Division, Business Unit"
                  value={level2Label}
                  onChange={(e) => setLevel2Label(e.target.value)}
                  className="h-12 text-base"
                  autoFocus />
                
                </div>
                <div className="space-y-2">
                  <Label htmlFor="level3" className="text-base font-medium">
                    Level 3 Label
                  </Label>
                  <Input
                  id="level3"
                  placeholder="e.g. Department, Team"
                  value={level3Label}
                  onChange={(e) => setLevel3Label(e.target.value)}
                  className="h-12 text-base" />
                
                </div>
              </div>
            }

            {step === 3 &&
            <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2">
                {admins.map((admin, index) =>
              <div
                key={admin.id}
                className="border rounded-lg p-5 space-y-4">
                
                    <h4 className="font-medium text-base">Admin {index + 1}</h4>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Email</Label>
                      <Input
                    placeholder="admin@company.com"
                    value={admin.email}
                    onChange={(e) =>
                    handleAdminEmailChange(admin.id, e.target.value)
                    }
                    className="h-11"
                    autoFocus={index === admins.length - 1} />
                  
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">
                        Generated Password
                      </Label>
                      <div className="flex gap-2">
                        <Input
                      readOnly
                      value={admin.password}
                      className="font-mono h-11" />
                    
                        <Button
                      variant="outline"
                      size="icon"
                      className="h-11 w-11 shrink-0"
                      onClick={() => copyToClipboard(admin.password)}>
                      
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
              )}
                <Button
                variant="outline"
                onClick={handleAddAdmin}
                className="w-fit gap-2 h-11">
                
                  <Plus className="w-4 h-4" /> Add Another Admin
                </Button>
              </div>
            }

            {step === 4 &&
            <div className="space-y-6 py-2">
                <div className="flex justify-between items-center border-b pb-4">
                  <span className="text-muted-foreground text-base">
                    Organization
                  </span>
                  <span className="font-medium text-base">
                    {orgName || '-'}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b pb-4">
                  <span className="text-muted-foreground text-base">
                    Organization URL
                  </span>
                  <span className="font-medium text-base">
                    {orgName ? generateSlug(orgName) : '-'}
                  </span>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-base">
                      Admin Users
                    </span>
                    <span className="font-medium text-base">
                      {admins.filter((a) => a.email).length || 1} admin(s)
                    </span>
                  </div>
                  {admins.
                filter((a) => a.email).
                map((admin, idx) =>
                <div
                  key={admin.id}
                  className="flex justify-between items-center pl-4">
                  
                        <span className="text-muted-foreground text-sm">
                          Admin {idx + 1}
                        </span>
                        <span className="text-sm">{admin.email}</span>
                      </div>
                )}
                </div>
              </div>
            }
          </div>
        </div>

        <div className="p-6 pt-4 border-t flex justify-between items-center bg-background">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 1}
            className="h-11 px-8 text-base">
            
            Back
          </Button>
          {step < 4 ?
          <Button
            onClick={handleNext}
            className="h-11 px-8 text-base bg-blue-500 hover:bg-blue-600 text-white">
            
              Next
            </Button> :

          <Button
            onClick={handleCreate}
            className="h-11 px-8 text-base bg-blue-500 hover:bg-blue-600 text-white">
            
              Create Organization
            </Button>
          }
        </div>
      </DialogContent>
    </Dialog>);

}