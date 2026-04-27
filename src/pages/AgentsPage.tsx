import { useState } from 'react';
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
  Plus,
  Pencil,
  Trash2,
  Bot,
  Search,
  ArrowLeft,
  X,
  Play,
  Save,
  Send,
  ChevronDown,
  ChevronRight,
  Layers,
  ArrowRight,
  Info,
  Wrench,
  GitBranch,
  UserCheck } from
'lucide-react';
interface Step {
  id: string;
  name: string;
  type: 'llm' | 'tool' | 'condition' | 'human_review';
  prompt: string;
  modelOverride: string;
  tools: string[];
  routing: string;
  conditionalRoutes: Array<{
    expression: string;
    targetStepId: string;
  }>;
  toolId: string;
  inputMapping: string;
  outputMapping: string;
  reviewerInstructions: string;
}
interface Agent {
  id: string;
  name: string;
  description: string;
  model: string;
  systemPrompt: string;
  inputs: string[];
  outputs: string[];
  temperature: string;
  memory: string;
  tools: string[];
}
const initialAgents: Agent[] = [
{
  id: '1',
  name: 'Customer Support Agent',
  description: 'Handles customer inquiries and resolves common issues.',
  model: 'gpt-4.1',
  systemPrompt:
  'You are a helpful customer support assistant. Always be polite and concise.',
  inputs: ['message', 'userId', 'locale'],
  outputs: ['response'],
  temperature: '0.3',
  memory: 'Session',
  tools: ['CRM Lookup', 'Docs KB']
},
{
  id: '2',
  name: 'Data Extraction Agent',
  description: 'Extracts structured data from unstructured documents.',
  model: 'claude-3.7-sonnet',
  systemPrompt:
  'Extract key entities from the provided text and format as JSON.',
  inputs: ['message', 'documentText'],
  outputs: ['response', 'extractedData'],
  temperature: '0.1',
  memory: 'Disabled',
  tools: []
}];

type ViewState = 'list' | 'create' | 'builder';
type BuilderTab = 'build' | 'test';
export function AgentsPage() {
  const [view, setView] = useState<ViewState>('list');
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [activeAgentId, setActiveAgentId] = useState<string | null>(null);
  // List View State
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  // Create View State
  const [createName, setCreateName] = useState('');
  const [createModel, setCreateModel] = useState('gpt-4.1');
  const [createPrompt, setCreatePrompt] = useState('');
  const [createInputs, setCreateInputs] = useState<string[]>(['message']);
  const [newInputName, setNewInputName] = useState('');
  // Builder View State
  const [activeTab, setActiveTab] = useState<BuilderTab>('build');
  const [testInput, setTestInput] = useState('');
  const [testOutput, setTestOutput] = useState<string | null>(null);
  const [isInputExpanded, setIsInputExpanded] = useState(false);
  const [isOutputExpanded, setIsOutputExpanded] = useState(false);
  // Steps State
  const [hasSteps, setHasSteps] = useState(false);
  const [showStepsExplainer, setShowStepsExplainer] = useState(false);
  const [steps, setSteps] = useState<Step[]>([]);
  const [showStepTypePicker, setShowStepTypePicker] = useState(false);
  const [expandedStepId, setExpandedStepId] = useState<string | null>(null);
  const activeAgent = agents.find((a) => a.id === activeAgentId);
  // --- List View Handlers ---
  const filteredAgents = agents.filter(
    (agent) =>
    searchQuery === '' ||
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const openCreate = () => {
    setCreateName('');
    setCreateModel('gpt-4.1');
    setCreatePrompt('');
    setCreateInputs(['message']);
    setNewInputName('');
    setView('create');
  };
  const openBuilder = (agentId: string) => {
    setActiveAgentId(agentId);
    setActiveTab('build');
    setTestOutput(null);
    setTestInput('');
    setView('builder');
  };
  const openDelete = (agentId: string) => {
    setDeleteId(agentId);
    setIsDeleteOpen(true);
  };
  const handleDelete = () => {
    setAgents(agents.filter((a) => a.id !== deleteId));
    setIsDeleteOpen(false);
  };
  // --- Create View Handlers ---
  const handleAddCreateInput = () => {
    if (newInputName.trim() && !createInputs.includes(newInputName.trim())) {
      setCreateInputs([...createInputs, newInputName.trim()]);
      setNewInputName('');
    }
  };
  const handleRemoveCreateInput = (input: string) => {
    if (input === 'message') return; // prevent removing default
    setCreateInputs(createInputs.filter((i) => i !== input));
  };
  const handleCreateSubmit = () => {
    if (!createName.trim()) return;
    const newAgent: Agent = {
      id: Math.random().toString(),
      name: createName.trim(),
      description: '',
      model: createModel,
      systemPrompt: createPrompt.trim() || 'You are a helpful AI assistant.',
      inputs: createInputs,
      outputs: ['response'],
      temperature: '0.3',
      memory: 'Session',
      tools: []
    };
    setAgents([newAgent, ...agents]);
    setActiveAgentId(newAgent.id);
    setView('builder');
  };
  // --- Builder View Handlers ---
  const updateActiveAgent = (updates: Partial<Agent>) => {
    if (!activeAgentId) return;
    setAgents(
      agents.map((a) =>
      a.id === activeAgentId ?
      {
        ...a,
        ...updates
      } :
      a
      )
    );
  };
  const handleRunTest = () => {
    if (!testInput.trim()) return;
    setTestOutput(null);
    // Simulate API call
    setTimeout(() => {
      setTestOutput(
        `This is a simulated response from ${activeAgent?.name} using model ${activeAgent?.model}.\n\nI received your input: "${testInput}"\n\nBased on my system prompt, I am processing this request accordingly.`
      );
    }, 800);
  };
  const addStep = (type: Step['type']) => {
    const typeNameMap = {
      llm: 'LLM Call',
      tool: 'Tool Call',
      condition: 'Condition',
      human_review: 'Human Review'
    };
    const newStep: Step = {
      id: Math.random().toString(),
      name: typeNameMap[type],
      type,
      prompt: '',
      modelOverride: '',
      tools: [],
      routing: 'next',
      conditionalRoutes: [],
      toolId: '',
      inputMapping: '',
      outputMapping: '',
      reviewerInstructions: ''
    };
    setSteps([...steps, newStep]);
    setExpandedStepId(newStep.id);
    setShowStepTypePicker(false);
  };
  const updateStep = (id: string, updates: Partial<Step>) => {
    setSteps(
      steps.map((s) =>
      s.id === id ?
      {
        ...s,
        ...updates
      } :
      s
      )
    );
  };
  const getStepTypeLabel = (type: Step['type']) => {
    switch (type) {
      case 'llm':
        return 'LLM Call';
      case 'tool':
        return 'Tool Call';
      case 'condition':
        return 'Condition';
      case 'human_review':
        return 'Human review';
    }
  };
  const getStepTypeBadgeClass = (type: Step['type']) => {
    switch (type) {
      case 'llm':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'tool':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'condition':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'human_review':
        return 'bg-green-50 text-green-700 border-green-200';
    }
  };
  const getRoutingSummary = (step: Step) => {
    if (step.type === 'condition') {
      const conditions =
      step.conditionalRoutes.length > 0 ?
      `${step.conditionalRoutes.length} condition route${step.conditionalRoutes.length > 1 ? 's' : ''}` :
      'No condition routes';
      return `${conditions} | Fallback: ${step.routing === 'end' ? 'End workflow' : 'Next step'}`;
    }
    return step.routing === 'end' ? 'Ends workflow' : 'Routes to next step';
  };
  const removeStep = (stepId: string) => {
    if (expandedStepId === stepId) setExpandedStepId(null);
    setSteps(steps.filter((s) => s.id !== stepId));
  };
  const renderStepTypePicker = () =>
  <div className="bg-white border rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-900">
          {steps.length === 0 ? 'Choose first workflow step type' : 'Choose step type'}
        </h3>
        <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6"
        onClick={() => setShowStepTypePicker(false)}>
          <X className="w-4 h-4" />
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => addStep('llm')}
          className="flex items-start gap-3 p-3 rounded-lg border hover:border-blue-300 hover:bg-blue-50 text-left transition-colors">
          <div className="mt-0.5 p-1.5 bg-blue-100 text-blue-600 rounded-md shrink-0">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-900">LLM Call</div>
            <div className="text-xs text-slate-500">Send a prompt to the model</div>
          </div>
        </button>
        <button
          onClick={() => addStep('tool')}
          className="flex items-start gap-3 p-3 rounded-lg border hover:border-amber-300 hover:bg-amber-50 text-left transition-colors">
          <div className="mt-0.5 p-1.5 bg-amber-100 text-amber-600 rounded-md shrink-0">
            <Wrench className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-900">Tool Call</div>
            <div className="text-xs text-slate-500">Execute a capability</div>
          </div>
        </button>
        <button
          onClick={() => addStep('condition')}
          className="flex items-start gap-3 p-3 rounded-lg border hover:border-purple-300 hover:bg-purple-50 text-left transition-colors">
          <div className="mt-0.5 p-1.5 bg-purple-100 text-purple-600 rounded-md shrink-0">
            <GitBranch className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-900">Condition</div>
            <div className="text-xs text-slate-500">Branch by routing logic</div>
          </div>
        </button>
        <button
          onClick={() => addStep('human_review')}
          className="flex items-start gap-3 p-3 rounded-lg border hover:border-green-300 hover:bg-green-50 text-left transition-colors">
          <div className="mt-0.5 p-1.5 bg-green-100 text-green-600 rounded-md shrink-0">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-900">Human review</div>
            <div className="text-xs text-slate-500">Pause for reviewer decision</div>
          </div>
        </button>
      </div>
    </div>;
  // --- Renderers ---
  // --- Renderers ---
  if (view === 'create') {
    return (
      <div className="p-8 max-w-3xl mx-auto w-full">
        <button
          onClick={() => setView('list')}
          className="flex items-center text-sm text-slate-500 hover:text-slate-900 mb-6 transition-colors">
          
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Agents
        </button>

        <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b bg-slate-50/50">
            <h1 className="text-2xl font-semibold mb-1">Create Agent</h1>
            <p className="text-muted-foreground text-sm">
              Give your agent a name, a system prompt, and a starting model. You
              can refine everything later.
            </p>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="font-medium">
                  Agent Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="e.g. Customer Support Assistant"
                  value={createName}
                  onChange={(e) => setCreateName(e.target.value)}
                  autoFocus />
                
              </div>
              <div className="space-y-2">
                <Label className="font-medium">Model Selection</Label>
                <Select value={createModel} onValueChange={setCreateModel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4.1">gpt-4.1 (default)</SelectItem>
                    <SelectItem value="claude-3.7-sonnet">
                      claude-3.7-sonnet
                    </SelectItem>
                    <SelectItem value="gemini-1.5-pro">
                      gemini-1.5-pro
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-medium">System Prompt</Label>
              <textarea
                placeholder="You are a helpful assistant..."
                value={createPrompt}
                onChange={(e) => setCreatePrompt(e.target.value)}
                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none" />
              
            </div>
          </div>

          <div className="p-6 border-t bg-slate-50/50 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setView('list')}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateSubmit}
              className="bg-blue-500 hover:bg-blue-600 text-white"
              disabled={!createName.trim()}>
              
              Create Agent
            </Button>
          </div>
        </div>
      </div>);

  }
  if (view === 'builder' && activeAgent) {
    return (
      <div className="flex flex-col h-full bg-slate-50/50">
        <div className="bg-white border-b px-6 py-4 shrink-0">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-4">
              <button
                onClick={() => setView('list')}
                className="mt-1 p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                title="Back to Agents">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-semibold text-slate-900">{activeAgent.name}</h1>
                {activeAgent.description &&
                <p className="text-sm text-muted-foreground mt-1.5">
                    {activeAgent.description}
                  </p>
                }
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="gap-2">
                <Save className="w-4 h-4" /> Save Draft
              </Button>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white gap-2">
                <Send className="w-4 h-4" /> Publish
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-center -mx-6 px-6 pb-2">
            <div className="bg-slate-200 p-1.5 rounded-xl flex items-center gap-1.5">
              <button
                className={`px-7 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'build' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-300/60'}`}
                onClick={() => setActiveTab('build')}>
                Build
              </button>
              <button
                className={`px-7 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'test' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-300/60'}`}
                onClick={() => setActiveTab('test')}>
                Test
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto w-full">
            {activeTab === 'build' ?
            <div className="grid grid-cols-1 lg:grid-cols-[7fr_3fr] gap-6">
                <div className="space-y-6">
                  <div className="bg-white border rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold mb-2">Global instruction</h3>
                    <p className="text-xs text-slate-500 mb-3">
                      Applies across all workflow steps.
                    </p>
                    <textarea
                      value={activeAgent.systemPrompt}
                      onChange={(e) => updateActiveAgent({ systemPrompt: e.target.value })}
                      className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y"
                      placeholder="Enter the global instruction for this agent..." />

                    <div className="mt-4 pt-4 border-t border-slate-100">
                      {hasSteps ?
                      <div className="flex items-center justify-between gap-4 text-sm">
                          <div className="flex items-center gap-2 text-slate-700">
                            <Layers className="w-4 h-4 text-blue-500" />
                            <span className="font-medium">Step-based workflow enabled</span>
                          </div>
                          <button
                            onClick={() => {
                              setHasSteps(false);
                              setShowStepsExplainer(false);
                              setShowStepTypePicker(false);
                              setExpandedStepId(null);
                            }}
                            className="text-slate-500 hover:text-slate-900 transition-colors">
                            Back to simple mode
                          </button>
                        </div> :

                      <div className="flex items-center gap-3">
                          <button
                            onClick={() => setShowStepsExplainer(true)}
                            className="inline-flex items-center gap-2 rounded-md border border-dashed border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:border-slate-400 hover:bg-slate-50 transition-colors">
                            <Layers className="w-4 h-4" />
                            Add steps for more control
                          </button>
                          <span className="text-xs text-slate-500">Turn this into a workflow when needed.</span>
                        </div>
                      }
                    </div>
                  </div>

                  {!hasSteps && showStepsExplainer &&
                  <div className="bg-white border border-blue-200 rounded-xl p-5 shadow-sm">
                      <h3 className="text-sm font-semibold text-slate-900 mb-2">
                        Switching to workflow steps
                      </h3>
                      <ul className="space-y-2 text-sm text-slate-700 mb-4">
                        <li>- Global instruction stays global.</li>
                        <li>- Build explicit workflow steps with routing.</li>
                        <li>- Tools remain available capabilities until assigned.</li>
                        <li>- First step can be LLM, Tool, Condition, or Human review.</li>
                      </ul>
                      <div className="flex items-center gap-3">
                        <Button
                          onClick={() => {
                            setHasSteps(true);
                            setShowStepsExplainer(false);
                            if (steps.length === 0) setShowStepTypePicker(true);
                          }}
                          className="bg-blue-500 hover:bg-blue-600 text-white">
                          Continue
                        </Button>
                        <button
                          onClick={() => setShowStepsExplainer(false)}
                          className="text-sm text-slate-500 hover:text-slate-700 transition-colors">
                          Cancel
                        </button>
                      </div>
                    </div>
                  }

                  {hasSteps &&
                  <div className="space-y-4">
                      {steps.length === 0 &&
                      <div className="bg-white border rounded-xl p-8 text-center shadow-sm">
                          <h3 className="text-lg font-semibold text-slate-900 mb-2">
                            Start building your workflow
                          </h3>
                          <p className="text-sm text-slate-500 mb-4">Add your first step.</p>
                          {!showStepTypePicker &&
                          <Button
                            variant="outline"
                            onClick={() => setShowStepTypePicker(true)}
                            className="gap-2">
                              <Plus className="w-4 h-4" /> Add first step
                            </Button>
                          }
                        </div>
                      }

                      {steps.length === 0 && showStepTypePicker && renderStepTypePicker()}

                      {steps.map((step, index) => {
                        const isExpanded = expandedStepId === step.id;
                        const typeLabel = getStepTypeLabel(step.type);
                        return (
                          <div
                            key={step.id}
                            className={`bg-white border rounded-xl shadow-sm ${
                              isExpanded ?
                                'relative z-10 overflow-visible border-blue-200' :
                                'overflow-hidden'
                            }`}>
                            <div
                              className="p-4 cursor-pointer hover:bg-slate-50/70 transition-colors"
                              onClick={() => setExpandedStepId(isExpanded ? null : step.id)}>
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium shrink-0 ${isExpanded ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                                    {index + 1}
                                  </div>
                                  <Input
                                    value={step.name}
                                    onChange={(e) => updateStep(step.id, { name: e.target.value })}
                                    onClick={(e) => e.stopPropagation()}
                                    className="h-8 w-[220px] border-transparent hover:border-input focus:border-input bg-transparent px-2 -ml-2 font-medium" />
                                  <Badge variant="outline" className={`font-normal ${getStepTypeBadgeClass(step.type)}`}>
                                    {typeLabel}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  {isExpanded ?
                                  <ChevronDown className="w-4 h-4 text-blue-500" /> :
                                  <ChevronRight className="w-4 h-4 text-slate-400" />
                                  }
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeStep(step.id);
                                    }}>
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                              <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-slate-600">
                                <div className="rounded-md bg-slate-50 px-2.5 py-1.5">
                                  <span className="font-medium text-slate-700">Input: </span>
                                  {step.inputMapping || 'Agent input'}
                                </div>
                                <div className="rounded-md bg-slate-50 px-2.5 py-1.5">
                                  <span className="font-medium text-slate-700">Output: </span>
                                  {step.outputMapping || 'Step output'}
                                </div>
                                <div className="rounded-md bg-slate-50 px-2.5 py-1.5">
                                  <span className="font-medium text-slate-700">Routing: </span>
                                  {getRoutingSummary(step)}
                                </div>
                              </div>
                            </div>

                            {isExpanded &&
                            <div className="border-t p-4 space-y-4">
                                {step.type === 'llm' &&
                                <>
                                    <div className="space-y-2">
                                      <Label className="font-medium">Step prompt</Label>
                                      <textarea
                                        value={step.prompt}
                                        onChange={(e) => updateStep(step.id, { prompt: e.target.value })}
                                        className="flex min-h-[110px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y"
                                        placeholder="Add instructions for this step..." />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label className="font-medium">Model override</Label>
                                        <Select
                                          value={step.modelOverride || 'default'}
                                          onValueChange={(val) => updateStep(step.id, { modelOverride: val === 'default' ? '' : val })}>
                                          <SelectTrigger>
                                            <SelectValue placeholder="Use agent default" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="default">Use agent default</SelectItem>
                                            <SelectItem value="gpt-4.1">gpt-4.1</SelectItem>
                                            <SelectItem value="claude-3.7-sonnet">claude-3.7-sonnet</SelectItem>
                                            <SelectItem value="gemini-1.5-pro">gemini-1.5-pro</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div className="space-y-2">
                                        <Label className="font-medium">Routing</Label>
                                        <Select value={step.routing} onValueChange={(val) => updateStep(step.id, { routing: val })}>
                                          <SelectTrigger><SelectValue /></SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="next">Next step</SelectItem>
                                            <SelectItem value="end">End workflow</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label className="font-medium">Input mapping</Label>
                                        <Input
                                          value={step.inputMapping}
                                          onChange={(e) => updateStep(step.id, { inputMapping: e.target.value })}
                                          placeholder="e.g. user_message" />
                                      </div>
                                      <div className="space-y-2">
                                        <Label className="font-medium">Output mapping</Label>
                                        <Input
                                          value={step.outputMapping}
                                          onChange={(e) => updateStep(step.id, { outputMapping: e.target.value })}
                                          placeholder="e.g. response_draft" />
                                      </div>
                                    </div>
                                  </>
                                }

                                {step.type === 'tool' &&
                                <>
                                    <div className="space-y-2">
                                      <Label className="font-medium">Assigned capability</Label>
                                      <Select
                                        value={step.toolId || 'none'}
                                        onValueChange={(val) => updateStep(step.id, { toolId: val === 'none' ? '' : val })}>
                                        <SelectTrigger><SelectValue placeholder="Select a tool" /></SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="none">Select a tool...</SelectItem>
                                          <SelectItem value="crm_lookup">CRM Lookup</SelectItem>
                                          <SelectItem value="docs_kb">Docs KB</SelectItem>
                                          <SelectItem value="web_search">Web Search</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label className="font-medium">Input mapping</Label>
                                        <textarea
                                          value={step.inputMapping}
                                          onChange={(e) => updateStep(step.id, { inputMapping: e.target.value })}
                                          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y"
                                          placeholder='{"query":"{{previous.output}}"}' />
                                      </div>
                                      <div className="space-y-2">
                                        <Label className="font-medium">Output mapping</Label>
                                        <Input
                                          value={step.outputMapping}
                                          onChange={(e) => updateStep(step.id, { outputMapping: e.target.value })}
                                          className="font-mono text-sm"
                                          placeholder="e.g. tool_result" />
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="font-medium">Routing</Label>
                                      <Select value={step.routing} onValueChange={(val) => updateStep(step.id, { routing: val })}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="next">Next step</SelectItem>
                                          <SelectItem value="end">End workflow</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </>
                                }

                                {step.type === 'condition' &&
                                <>
                                    <div className="space-y-2">
                                      <Label className="font-medium">Routing logic</Label>
                                      <div className="rounded-lg border p-3 space-y-2">
                                        {step.conditionalRoutes.map((route, i) =>
                                        <div key={i} className="grid grid-cols-[1fr_180px_36px] gap-2 items-center">
                                            <Input
                                            value={route.expression}
                                            onChange={(e) => {
                                              const updated = [...step.conditionalRoutes];
                                              updated[i].expression = e.target.value;
                                              updateStep(step.id, { conditionalRoutes: updated });
                                            }}
                                            placeholder="If confidence < 0.7" />
                                            <Select
                                            value={route.targetStepId || 'end'}
                                            onValueChange={(val) => {
                                              const updated = [...step.conditionalRoutes];
                                              updated[i].targetStepId = val;
                                              updateStep(step.id, { conditionalRoutes: updated });
                                            }}>
                                              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="end">End workflow</SelectItem>
                                                {steps.filter((s) => s.id !== step.id).map((s) =>
                                              <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                                              )}
                                              </SelectContent>
                                            </Select>
                                            <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-slate-400 hover:text-red-600"
                                            onClick={() =>
                                            updateStep(step.id, {
                                              conditionalRoutes: step.conditionalRoutes.filter((_, idx) => idx !== i)
                                            })
                                            }>
                                              <X className="w-4 h-4" />
                                            </Button>
                                          </div>
                                        )}
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="w-full border-dashed text-xs h-8"
                                          onClick={() =>
                                          updateStep(step.id, {
                                            conditionalRoutes: [
                                            ...step.conditionalRoutes,
                                            { expression: '', targetStepId: 'end' }]
                                          })
                                          }>
                                          <Plus className="w-3 h-3 mr-1" /> Add condition route
                                        </Button>
                                      </div>
                                      <p className="text-xs text-slate-500">
                                        Example: If complaint =&gt; Escalate, Else =&gt; Next step.
                                      </p>
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="font-medium">Fallback route</Label>
                                      <Select value={step.routing} onValueChange={(val) => updateStep(step.id, { routing: val })}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="next">Next step</SelectItem>
                                          <SelectItem value="end">End workflow</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </>
                                }

                                {step.type === 'human_review' &&
                                <>
                                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                                      <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                                      <div className="text-sm text-amber-800">
                                        <span className="font-semibold">Execution pauses for human review.</span>{' '}
                                        A reviewer must inspect inputs and approve before workflow continues.
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="font-medium">Reviewer instructions</Label>
                                      <textarea
                                        value={step.reviewerInstructions}
                                        onChange={(e) => updateStep(step.id, { reviewerInstructions: e.target.value })}
                                        className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y"
                                        placeholder="What should the reviewer verify?" />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label className="font-medium">Input fields under review</Label>
                                        <Input
                                          value={step.inputMapping}
                                          onChange={(e) => updateStep(step.id, { inputMapping: e.target.value })}
                                          placeholder="e.g. draft_reply, risk_score" />
                                      </div>
                                      <div className="space-y-2">
                                        <Label className="font-medium">Decision output field</Label>
                                        <Input
                                          value={step.outputMapping}
                                          onChange={(e) => updateStep(step.id, { outputMapping: e.target.value })}
                                          placeholder="e.g. reviewer_decision" />
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="font-medium">Routing after approval</Label>
                                      <Select value={step.routing} onValueChange={(val) => updateStep(step.id, { routing: val })}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="next">Next step</SelectItem>
                                          <SelectItem value="end">End workflow</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </>
                                }
                              </div>
                            }
                          </div>);
                      })}

                      {steps.length > 0 && showStepTypePicker && renderStepTypePicker()}

                      {steps.length > 0 && !showStepTypePicker &&
                      <button
                        onClick={() => setShowStepTypePicker(true)}
                        className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-sm font-medium text-slate-500 hover:text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                          <Plus className="w-4 h-4" /> Add Step
                        </button>
                      }
                    </div>
                  }
                </div>

                <div className="space-y-6">
                  <div className="bg-white border rounded-xl p-6 shadow-sm space-y-8">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label className="font-medium text-base">Model</Label>
                        <Select value={activeAgent.model} onValueChange={(val) => updateActiveAgent({ model: val })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="gpt-4.1">gpt-4.1</SelectItem>
                            <SelectItem value="claude-3.7-sonnet">claude-3.7-sonnet</SelectItem>
                            <SelectItem value="gemini-1.5-pro">gemini-1.5-pro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="h-px bg-slate-100 -mx-6"></div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium text-base text-slate-900">Available capabilities</h3>
                        <p className="text-xs text-slate-500 mt-1">
                          Tools and knowledge are available globally. Assign them explicitly to workflow steps.
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {activeAgent.tools.map((tool) =>
                        <Badge
                          key={tool}
                          variant="secondary"
                          className="px-2.5 py-1 bg-slate-100 border-slate-200 text-slate-700 font-normal">
                            {tool}
                          </Badge>
                        )}
                        <Badge
                          variant="outline"
                          className="px-2.5 py-1 border-dashed cursor-pointer hover:bg-slate-50 text-slate-500 font-normal">
                          + Attach tool
                        </Badge>
                        <Badge
                          variant="outline"
                          className="px-2.5 py-1 border-dashed cursor-pointer hover:bg-slate-50 text-slate-500 font-normal">
                          + Attach KB
                        </Badge>
                      </div>
                    </div>

                    <div className="h-px bg-slate-100 -mx-6"></div>

                    <div className="space-y-4">
                      <h3 className="font-medium text-base text-slate-900">Data</h3>
                      <div className="border rounded-lg overflow-hidden">
                        <button
                          onClick={() => setIsInputExpanded(!isInputExpanded)}
                          className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 transition-colors text-sm">
                          <span className="font-medium text-slate-700">
                            Input: {activeAgent.inputs[0] || 'none'}
                            {activeAgent.inputs.length > 1 &&
                            <span className="text-slate-500 font-normal ml-1">
                                (+{activeAgent.inputs.length - 1} fields)
                              </span>
                            }
                          </span>
                          {isInputExpanded ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                        </button>
                        {isInputExpanded &&
                        <div className="p-3 bg-white border-t">
                            <textarea
                            value={activeAgent.inputs.map((i) => `${i}: string`).join('\n')}
                            onChange={(e) => {
                              const lines = e.target.value.split('\n').map((l) => l.split(':')[0].trim()).filter(Boolean);
                              updateActiveAgent({ inputs: lines });
                            }}
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-slate-50 px-3 py-2 text-xs font-mono ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y" />
                          </div>
                        }
                      </div>
                      <div className="border rounded-lg overflow-hidden">
                        <button
                          onClick={() => setIsOutputExpanded(!isOutputExpanded)}
                          className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 transition-colors text-sm">
                          <span className="font-medium text-slate-700">
                            Output: {activeAgent.outputs[0] || 'none'}
                            {activeAgent.outputs.length > 1 &&
                            <span className="text-slate-500 font-normal ml-1">
                                (+{activeAgent.outputs.length - 1} fields)
                              </span>
                            }
                          </span>
                          {isOutputExpanded ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                        </button>
                        {isOutputExpanded &&
                        <div className="p-3 bg-white border-t">
                            <textarea
                            value={activeAgent.outputs.map((o) => `${o}: string`).join('\n')}
                            onChange={(e) => {
                              const lines = e.target.value.split('\n').map((l) => l.split(':')[0].trim()).filter(Boolean);
                              updateActiveAgent({ outputs: lines });
                            }}
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-slate-50 px-3 py-2 text-xs font-mono ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y" />
                          </div>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div> :

            <div className="max-w-3xl mx-auto space-y-6">
                <div className="bg-white border rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold mb-4">Test</h3>
                  <div className="space-y-4">
                    <textarea
                      value={testInput}
                      onChange={(e) => setTestInput(e.target.value)}
                      placeholder="Enter a test message..."
                      className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y" />
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        Available capabilities are used only when your workflow or model calls them.
                      </p>
                      <Button onClick={handleRunTest} className="bg-blue-500 hover:bg-blue-600 text-white gap-2">
                        <Play className="w-4 h-4" /> Run Test
                      </Button>
                    </div>
                  </div>
                </div>
                {testOutput &&
                <div className="bg-white border rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center">
                        <Bot className="w-3.5 h-3.5 text-blue-600" />
                      </div>
                      <span className="font-medium text-sm">Agent Response</span>
                    </div>
                    <div className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                      {testOutput}
                    </div>
                  </div>
                }
              </div>
            }
          </div>
        </div>
      </div>);

  }
  // Default List View
  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Agents</h1>
          <p className="text-muted-foreground">
            Build and manage your AI agents.
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="bg-blue-500 hover:bg-blue-600 text-white gap-2 h-10 px-4">
          
          <Plus className="w-4 h-4" /> Create Agent
        </Button>
      </div>

      <div className="border rounded-lg bg-card mb-6">
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search agents by name or description"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9" />
            
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {filteredAgents.length === 0 ?
        <div className="border rounded-lg bg-card p-12 text-center text-muted-foreground">
            {agents.length === 0 ?
          'No agents yet. Click "Create Agent" to get started.' :
          'No agents match your search.'}
          </div> :

        filteredAgents.map((agent) =>
        <div
          key={agent.id}
          className="border rounded-lg bg-card overflow-hidden hover:border-blue-200 transition-colors cursor-pointer"
          onClick={() => openBuilder(agent.id)}>
          
              <div className="flex items-start gap-4 px-5 py-4">
                <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-5 h-5 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-base mb-1 text-slate-900">
                    {agent.name}
                  </div>
                  <div className="text-sm text-muted-foreground leading-relaxed">
                    {agent.description || 'No description provided.'}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                onClick={(e) => {
                  e.stopPropagation();
                  openBuilder(agent.id);
                }}
                title="Edit agent">
                
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50"
                onClick={(e) => {
                  e.stopPropagation();
                  openDelete(agent.id);
                }}
                title="Delete agent">
                
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
        )
        }
      </div>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Delete Agent</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{' '}
              <span className="font-medium text-foreground">
                {agents.find((a) => a.id === deleteId)?.name}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700">
              
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>);

}