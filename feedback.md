# Agent Builder UX Feedback and Required Changes

## Context
This document consolidates the UX feedback from the current agent builder screens and the design changes needed to make the product feel like a simple workflow builder first, and a LangGraph-powered system second.

The main principle is:

- **Simple mode** should feel like a prompt-based agent setup.
- **Step mode** should feel like an explicit workflow editor.
- The **system prompt** should remain global.
- The initial **tools / knowledge** should remain available capabilities, not automatically consumed by the first step.
- A step can be **LLM, Tool, Condition, or Human Review**.
- The first step does **not** have to be an LLM step.

---

## 1. Reduce the “Add steps for more control” section

### Issue
The current transition card is too large and dominates the page. It feels like a major feature block instead of a lightweight action.

### Required change
- Replace the large card with a compact inline CTA directly under the system prompt.
- Use a small, clear label such as:
  - `Add steps for more control`
  - `Break into steps`
  - `Turn into a workflow`
- Keep the explanation short and scannable.
- Only show the detailed transition explanation after the user clicks the CTA.

### Goal
Make the transition feel optional and lightweight, not like the main event on the page.

---
2. Replace and Reposition “Remove steps” (Mode Control)
Issue

“Remove steps” feels destructive and abrupt. It also appears in the header, which breaks the mental model because the user enabled steps near the system prompt, but has to disable them somewhere else.

Required change

A. Change the label (softer language):
Replace:

Remove steps

With:

Back to simple mode
Switch to prompt mode
Return to single prompt

B. Move the control below the System Prompt (same location as “Add steps”):

The same section where user clicked “Add steps” should now show:
⚙️ Step-based workflow enabled
← Back to simple mode
This replaces the original CTA

C. Remove it completely from the header

Do NOT show any “Remove steps” or mode toggle in the top bar
The header should stay clean and context-free
Goal
Maintain spatial consistency (action happens where it was initiated)
Reduce confusion about modes
Make the transition feel reversible and safe
Keep the header focused on navigation, not mode control

---

## 3. Keep global settings stable and visible

### Issue
When step mode is enabled, the right-side panel starts behaving like a step editor and the original global agent controls become less obvious.

### Required change
Keep these as **global agent-level controls**:
- System prompt
- Model
- Available tools / knowledge
- Input / output

They should remain visible even after steps are enabled.

### Goal
The user should always understand what belongs to the whole agent versus what belongs to a single step.

---

## 4. Separate global configuration from step configuration

### Issue
The current right panel feels disconnected from the selected step because it mixes global agent settings with step-specific settings.

### Required change
Use a clear separation:
- **Global settings area**: system prompt, model, available capabilities, data
- **Step editor**: only the currently selected step’s configuration

### Recommended behavior
- The step itself should be the main editing unit.
- The sidebar should not replace the step’s identity.
- If needed, the step editor can appear inline or as a contextual panel tied to the active step.

### Goal
Make it obvious that the user is editing a specific node in the workflow, not a generic settings sheet.

---

## 5. Make the step card the primary editing surface

### Issue
Step configuration currently feels detached from the step itself.

### Required change
Each step should expand into a self-contained card or inline editor that includes:
- Step name
- Step type
- Step prompt or configuration
- Model override
- Assigned tools
- Input mapping
- Output mapping
- Routing

### Goal
Editing should feel local to the step, not separated into an unrelated sidebar.

---

## 6. Keep step cards visually prominent and consistent

### Issue
The step currently feels like a list row, but it needs to behave like the core unit of the workflow.

### Required change
Each step card should include:
- Step number
- Step name
- Step type chip
- Quick summary of input/output
- Routing summary
- Expand/collapse control
- Delete action

### Default collapsed state should show:
- Step name
- Step type
- Input
- Output
- Next step summary

### Expanded state should show:
- Full configuration for that step type

### Goal
Make the workflow easy to scan while still allowing deep editing.

---

## 7. Treat the system prompt as global instruction

### Issue
The prompt entered before step mode should not be lost or turned into a confusing per-step value.

### Required change
When the user transitions to step mode:
- Keep the prompt as **global system prompt**
- Do not auto-delete it
- Do not auto-merge it into every step editor
- Allow step-specific instructions to add on top of it, if needed

### Goal
The prompt should become the global behavior layer for the whole agent.

---

## 8. Do not auto-attach tools to the first step

### Issue
The user may have originally selected tools for the simple agent, but once step mode begins they may want the first step to be a Tool step, a Rule step, or even a Human Review step.

### Required change
When the user transitions to step mode:
- Keep selected tools as **available capabilities**
- Do not auto-assign them to Step 1
- Only attach a tool when the user explicitly assigns it to a step

### Example
If the user originally selected a knowledge base for the simple prompt, but later creates a first step that is a tool step to fetch data, the tool is still available, but it should be used only when assigned.

### Goal
Avoid hidden behavior and keep the workflow explicit.

---

## 9. Make the transition from simple mode to step mode explicit

### Issue
Users need to understand what changes when they enable steps.

### Required change
Show a short transition panel that explains:
- The system prompt stays global
- The workflow will be broken into steps
- Steps can be LLM, Tool, Condition, or Human Review
- Tools and knowledge become available capabilities and must be assigned explicitly

### Goal
Prevent confusion and make the mode switch feel intentional.

---

## 10. Let the first step be any type

### Issue
The builder should not assume that the first step is always an LLM step.

### Required change
When creating step mode, ask:
- Start with LLM
- Start with Tool
- Start with Condition
- Start with Human Review

### Goal
Support workflows that are tool-first, rule-first, or human-first.

---

## 11. Keep Build / Test navigation visually strong

### Issue
Build/Test is a major mode switch, but it can still feel too subtle.

### Required change
- Make Build/Test look like a strong segmented control or pill toggle.
- Increase contrast and size.
- Keep the active tab very clear.
- Make Test feel like a real second mode, not a secondary label.

### Goal
Users should instantly understand that they are either editing the workflow or testing it.

---

## 12. Place Input / Output in a compact data area

### Issue
Input / Output can easily take too much visual space if shown as large editors in the main canvas.

### Required change
Move Input / Output into the right panel as a compact **Data** section.
- Show a short summary by default
- Expand only when needed
- Avoid large raw JSON areas in the default state

### Example summary
- `Input: message (+2 fields)`
- `Output: response`

### Goal
Keep the main canvas focused on the flow.

---

## 13. Keep Tools / Knowledge in a compact capabilities area

### Issue
Tools and knowledge should remain visible, but they should not dominate the layout.

### Required change
Create a compact **Capabilities** section in the right panel:
- Show selected tools as chips
- Show attached knowledge bases as chips
- Use `+ Attach tool` and `+ Attach KB`
- Do not turn this into a large configuration block

### Goal
Keep available capabilities easy to scan without distracting from the workflow.

---

## 14. Make routing feel like graph logic, not a form field

### Issue
Routing should feel connected to the workflow, especially for Condition steps.

### Required change
Use a clear routing layout inside the step card:
- Default next step
- Conditional routes
- Optional fallback route

### Example
- `If confidence < 0.7 → Human Review`
- `If complaint → Escalate`
- `Else → Next step`

### Goal
Help the user understand that the workflow is a graph of transitions, not a flat list.

---

## 15. Add a dedicated Human Review step type

### Issue
Human-in-the-loop behavior should not feel like a special workaround.

### Required change
Add a first-class step type:
- `Human Review`

### This step should show:
- A warning that execution will pause
- Reviewer instructions
- Input fields being reviewed
- Output / decision after review
- Routing after approval

### Goal
Make human review feel native to the workflow system.

---

## 16. Improve the empty state after switching to steps

### Issue
After the user enables steps, the page can still feel ambiguous if the workflow is empty.

### Required change
Show a clear empty-state message:
- `Start building your workflow`
- `Add your first step`

### Goal
Help the user understand what to do next.

---

## 17. Preserve continuity between simple mode and step mode

### Issue
The system should not feel like two separate products.

### Required change
Use the same top-level agent context in both modes:
- Agent name
- System prompt
- Model
- Tools / knowledge
- Input / output

Then let step mode introduce:
- steps
- routing
- human review
- explicit tool assignment

### Goal
Simple mode and step mode should feel like different levels of the same builder.

---

## 18. Use language that matches the user’s mental model

### Replace technical wording with clearer wording
Use:
- `Global instruction` instead of complex prompt terminology
- `Available capabilities` instead of hidden tool behavior
- `Workflow steps` instead of abstract nodes
- `Routing` instead of low-level graph terms
- `Human review` instead of special-case execution handling

### Goal
Keep the product understandable for low-code and no-code users.

---

## Final UX Direction

The product should feel like this progression:

1. Write a system prompt  
2. Set model, tools, and input/output  
3. Test quickly in simple mode  
4. Switch to step mode when more control is needed  
5. Build a workflow with steps  
6. Assign tools explicitly to steps  
7. Add conditions and human review  
8. Test and refine the workflow

The core principle is:

- **Prompt remains global**
- **Tools remain available unless assigned**
- **Steps become the visible workflow**
- **The step card becomes the main editing surface**
- **Global settings stay stable and compact**

This keeps the product simple at the start and powerful later without making the user feel like they are switching to a completely different tool.
