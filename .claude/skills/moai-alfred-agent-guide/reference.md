# CLAUDE-AGENTS-GUIDE.md

> MoAI-ADK Agent Architecture & Decision Guide

---

## For Alfred: Why This Document Matters

When Alfred reads this document:

1. Upon receiving a new task - Decide "Which Sub-agent should I invoke?"
2. When complex tasks are required - Determine sequence and collaboration patterns among multiple agents
3. When reviewing team structure - Verify responsibility scope of each agent

Alfred's Decision Making:

- "Should this task be handled by spec-builder or code-builder?"
- "When should I invoke the Explore agent and when should I not?"
- "All agents now use Sonnet 4.5 for consistency and quality"

After reading this document:

- Clearly understand the responsibility scope of 19 Sub-agents
- Grasp how 55 Skills are organized by tier
- Master Agent collaboration principles (Command Precedence, Single Responsibility, etc.)
- Understand unified Sonnet model strategy for all agents

---

→ Related Documents:

- [For Alfred's decision-making rules, see CLAUDE-RULES.md](./CLAUDE-RULES.md#skill-invocation-rules)
- [For actual Agent invocation examples, see CLAUDE-PRACTICES.md](./CLAUDE-PRACTICES.md#practical-workflow-examples)

---

## 4-Layer Architecture

| Layer           | Owner              | Purpose                                                            | Examples                                                                                                 |
| --------------- | ------------------ | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| **Commands**    | User ↔ Alfred      | Workflow entry points that establish the Plan → Run → Sync cadence | `/alfred:0-project`, `/alfred:1-plan`, `/alfred:2-run`, `/alfred:3-sync`                                 |
| **Sub-agents**  | Alfred             | Deep reasoning and decision making for each phase                  | project-manager, spec-builder, code-builder pipeline, doc-syncer                                         |
| **Skills (55)** | Claude Skills      | Reusable knowledge capsules loaded just-in-time                    | Foundation (TRUST/TAG/Git), Essentials (debug/refactor/review), Alfred workflow, Domain & Language packs |
| **Hooks**       | Runtime guardrails | Fast validation + JIT context hints (<100 ms)                      | SessionStart status card, PreToolUse destructive-command blocker                                         |

---

## Core Sub-agent Roster

> Alfred + 10 core sub-agents + 6 zero-project specialists + 2 built-in Claude agents = **19-member team**
>
> **Note on Counting**: The "code-builder pipeline" is counted as 1 conceptual agent but implemented as 2 physical files (`implementation-planner` + `tdd-implementer`) for sequential RED → GREEN → REFACTOR execution. This maintains the 19-member team concept while acknowledging that 20 distinct agent files exist in `.claude/agents/alfred/`.

| Sub-agent                    | Model  | Phase       | Responsibility                                                                                 | Trigger                      |
| ---------------------------- | ------ | ----------- | ---------------------------------------------------------------------------------------------- | ---------------------------- |
| **project-manager** 📋       | Sonnet | Init        | Project bootstrap, metadata interview, mode selection                                          | `/alfred:0-project`          |
| **spec-builder** 🏗️          | Sonnet | Plan        | Plan board consolidation, EARS-based SPEC authoring                                            | `/alfred:1-plan`             |
| **code-builder pipeline** 💎 | Sonnet | Run         | Phase 1 `implementation-planner` → Phase 2 `tdd-implementer` to execute RED → GREEN → REFACTOR | `/alfred:2-run`              |
| **doc-syncer** 📖            | Sonnet | Sync        | Living documentation, README/CHANGELOG updates                                                 | `/alfred:3-sync`             |
| **tag-agent** 🏷️             | Sonnet | Sync        | TAG inventory, orphan detection, chain repair                                                  | `@agent-tag-agent`           |
| **git-manager** 🚀           | Sonnet | Plan · Sync | GitFlow automation, Draft→Ready PR, auto-merge policy                                          | `@agent-git-manager`         |
| **debug-helper** 🔍          | Sonnet | Run         | Failure diagnosis, fix-forward guidance                                                        | `@agent-debug-helper`        |
| **trust-checker** ✅         | Sonnet | All phases  | TRUST 5 principle enforcement and risk flags                                                   | `@agent-trust-checker`       |
| **quality-gate** 🛡️          | Sonnet | Sync        | Coverage delta review, release gate validation                                                 | Auto during `/alfred:3-sync` |
| **cc-manager** 🛠️            | Sonnet | Ops         | Claude Code session tuning, Skill lifecycle management                                         | `@agent-cc-manager`          |

The **code-builder pipeline** runs two Sonnet specialists in sequence: **implementation-planner** (strategy, libraries, TAG design) followed by **tdd-implementer** (RED → GREEN → REFACTOR execution).

---

## Expert Agents (Proactively Triggered by SPEC Keywords)

| Expert Agent            | Model  | Specialty                                                                           | Trigger Keywords                                                                                   | Trigger Source      |
| ----------------------- | ------ | ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ------------------- |
| **backend-expert** 🔧   | Sonnet | Backend architecture, API design, database schema, microservices, authentication    | 'backend', 'api', 'server', 'database', 'microservice', 'deployment', 'authentication'            | implementation-planner |
| **frontend-expert** 💻  | Sonnet | Frontend architecture, component design, state management, UI/UX implementation     | 'frontend', 'ui', 'page', 'component', 'client-side', 'browser', 'web interface'                  | implementation-planner |
| **devops-expert** 🚀    | Sonnet | DevOps strategy, deployment automation, containerization, CI/CD, cloud infrastructure | 'deployment', 'docker', 'kubernetes', 'ci/cd', 'pipeline', 'infrastructure', 'railway', 'vercel', 'aws' | implementation-planner |
| **ui-ux-expert** 🎨     | Sonnet | UI/UX design, accessibility (WCAG 2.1 AA/AAA), design systems, Figma MCP, design-to-code | 'design', 'ux', 'ui', 'accessibility', 'a11y', 'user experience', 'wireframe', 'prototype', 'design system', 'figma', 'user research', 'persona', 'journey map' | implementation-planner |

### How Expert Agents Work

1. **Automatic Keyword Detection**: When `implementation-planner` analyzes a SPEC, it scans for expert trigger keywords
2. **Proactive Delegation**: If keywords match, `implementation-planner` automatically invokes the relevant expert agent(s)
3. **Expert Consultation**: Each expert provides domain-specific architecture guidance, technology recommendations, and risk analysis

### Example: Full-Stack Authentication SPEC

```
SPEC Keywords: 'api', 'authentication', 'design', 'accessibility'

→ Trigger backend-expert (for API & auth architecture)
→ Trigger ui-ux-expert (for login UI & accessibility)

Result:

Implementation Plan includes:
- Backend: JWT token strategy, rate limiting, audit logging
- UI/UX: Accessible login form (WCAG 2.1 AA), error messaging
```

---

## Zero-project Specialists

| Sub-agent                  | Model  | Focus                                                       | Trigger                         |
| -------------------------- | ------ | ----------------------------------------------------------- | ------------------------------- |
| **language-detector** 🔍   | Sonnet | Stack detection, language matrix                            | Auto during `/alfred:0-project` |
| **backup-merger** 📦       | Sonnet | Backup restore, checkpoint diff                             | `@agent-backup-merger`          |
| **project-interviewer** 💬 | Sonnet | Requirement interviews, persona capture                     | `/alfred:0-project` Q&A         |
| **document-generator** 📝  | Sonnet | Project docs seed (`product.md`, `structure.md`, `tech.md`) | `/alfred:0-project`             |
| **feature-selector** 🎯    | Sonnet | Skill pack recommendation                                   | `/alfred:0-project`             |
| **template-optimizer** ⚙️  | Sonnet | Template cleanup, migration helpers                         | `/alfred:0-project`             |

> **Implementation Note**: Zero-project specialists may be embedded within other agents (e.g., functionality within `project-manager`) or implemented as dedicated Skills (e.g., `moai-alfred-language-detection`). For example, `language-detector` functionality is provided by the `moai-alfred-language-detection` Skill during `/alfred:0-project` initialization.

---

## Built-in Claude Agents

| Agent               | Model  | Specialty                                     | Invocation       |
| ------------------- | ------ | --------------------------------------------- | ---------------- |
| **Explore** 🔍      | Sonnet | Repository-wide search & architecture mapping | `@agent-Explore` |
| **general-purpose** | Sonnet | General assistance                            | Automatic        |

### Explore Agent Guide

The **Explore** agent excels at navigating large codebases.

**Use cases**:

- ✅ **Code analysis** (understand complex implementations, trace dependencies, study architecture)
- ✅ Search for specific keywords or patterns (e.g., "API endpoints", "authentication logic")
- ✅ Locate files (e.g., `src/components/**/*.tsx`)
- ✅ Understand codebase structure (e.g., "explain the project architecture")
- ✅ Search across many files (Glob + Grep patterns)

**Recommend Explore when**:

- 🔍 You need to understand a complex structure
- 🔍 The implementation spans multiple files
- 🔍 You want the end-to-end flow of a feature
- 🔍 Dependency relationships must be analyzed
- 🔍 You're planning a refactor and need impact analysis

**Usage**: Use `Task(subagent_type="Explore", ...)` for deep codebase analysis. Declare `thoroughness: quick|medium|very thorough` in the prompt.

**Examples**:

- Deep analysis: "Analyze TemplateProcessor class and its dependencies" (thoroughness: very thorough)
- Domain search: "Find all AUTH-related files in SPEC/tests/src/docs" (thoroughness: medium)
- Natural language: "Where is JWT authentication implemented?" → Alfred auto-delegates

---

## Claude Skills (55 packs)

Alfred relies on 55 Claude Skills grouped by tier. Skills load via Progressive Disclosure: metadata is available at session start, full `SKILL.md` content loads when a sub-agent references it, and supporting templates stream only when required.

**Skills Distribution by Tier**:

| Tier            | Count  | Purpose                                      |
| --------------- | ------ | -------------------------------------------- |
| Foundation      | 6      | Core TRUST/TAG/SPEC/Git/EARS/Lang principles |
| Essentials      | 4      | Debug/Perf/Refactor/Review workflows         |
| Alfred          | 11     | Internal workflow orchestration              |
| Domain          | 10     | Specialized domain expertise                 |
| Language        | 23     | Language-specific best practices             |
| Claude Code Ops | 1      | Session management                           |
| **Total**       | **55** | Complete knowledge capsule library           |

**Foundation Tier (6)**: `moai-foundation-trust`, `moai-foundation-tags`, `moai-foundation-specs`, `moai-foundation-ears`, `moai-foundation-git`, `moai-foundation-langs` (TRUST/TAG/SPEC/EARS/Git/language detection)

**Essentials Tier (4)**: `moai-essentials-debug`, `moai-essentials-perf`, `moai-essentials-refactor`, `moai-essentials-review` (Debug/Perf/Refactor/Review workflows)

**Alfred Tier (11)**: `moai-alfred-code-reviewer`, `moai-alfred-debugger-pro`, `moai-alfred-ears-authoring`, `moai-alfred-git-workflow`, `moai-alfred-language-detection`, `moai-alfred-performance-optimizer`, `moai-alfred-refactoring-coach`, `moai-alfred-spec-metadata-validation`, `moai-alfred-tag-scanning`, `moai-alfred-trust-validation`, `moai-alfred-ask-user-questions` (code review, debugging, EARS, Git, language detection, performance, refactoring, metadata, TAG scanning, trust validation, interactive questions)

**Domain Tier (10)** — `moai-domain-backend`, `web-api`, `frontend`, `mobile-app`, `security`, `devops`, `database`, `data-science`, `ml`, `cli-tool`.

**Language Tier (23)** — Python, TypeScript, Go, Rust, Java, Kotlin, Swift, Dart, C/C++, C#, Scala, Haskell, Elixir, Clojure, Lua, Ruby, PHP, JavaScript, SQL, Shell, Julia, R, plus supporting stacks.

**Claude Code Ops (1)** — `moai-claude-code` manages session settings, output styles, and Skill deployment.

Skills keep the core knowledge lightweight while allowing Alfred to assemble the right expertise for each request.

---

## Agent Collaboration Principles

- **Command precedence**: Command instructions outrank agent guidelines; follow the command if conflicts occur.
- **Single responsibility**: Each agent handles only its specialty.
- **Zero overlapping ownership**: When unsure, hand off to the agent with the most direct expertise.
- **Confidence reporting**: Always share confidence levels and identified risks when completing a task.
- **Escalation path**: When blocked, escalate to Alfred with context, attempted steps, and suggested next actions.

---

## Model Selection Guide

| Model                 | Primary use cases                                                    | Representative sub-agents                                                              | Why it fits                                                    |
| --------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| **Claude 4.5 Sonnet** | All tasks - unified model for consistency                           | All agents use Sonnet exclusively                                                     | Consistent high-quality output, eliminates API compatibility issues |

**Guidelines**:

- **Unified Model Strategy**: All agents use Sonnet 4.5 for consistency and quality
- **Benefits**: No API compatibility issues, consistent reasoning quality across all tasks
- **Trade-off**: Higher cost but ensures reliable execution without model-specific errors
- Record any configuration changes in task notes for tracking

---

## Agent Selection Decision Tree

| Situation                   | Recommended Agent         | Reason                                                                                                 |
| --------------------------- | ------------------------- | ------------------------------------------------------------------------------------------------------ |
| Need codebase understanding | **Explore**               | Specialized in rapid analysis of large projects. Understand entire structure with Glob + Grep patterns |
| Write SPEC for new feature  | **spec-builder**          | Expert in EARS syntax + SPEC structure. Auto-manage YAML metadata + HISTORY                            |
| Analyze bug causes          | **debug-helper**          | Expert in stack trace + error pattern analysis. Recommends fix-forward vs rollback                     |
| Code implementation (TDD)   | **code-builder pipeline** | Automates RED → GREEN → REFACTOR. Sequential execution of implementation-planner + tdd-implementer     |
| Need document sync          | **doc-syncer**            | Automates Living Documents. Generates README + CHANGELOG, verifies TAG chain                           |
| Git/PR management           | **git-manager**           | Automates GitFlow + Draft→Ready. Creates feature branches + PRs                                        |
| Version release             | **git-manager**           | Automates releases. Generates CHANGELOG + creates tags + merges PR                                     |
| Verify TAG integrity        | **tag-agent**             | Specializes in TAG chain verification. Detects orphan TAGs + recommends fixes                          |
| Verify code quality         | **trust-checker**         | Verifies TRUST 5 principles. Checks Test/Readable/Unified/Secured/Trackable                            |
| Verify release gate         | **quality-gate**          | Coverage delta + security scan. Final verification before release                                      |
| Project initialization      | **project-manager**       | Metadata interview + mode selection. Dedicated to `/alfred:0-project`                                  |
| Claude Code session mgmt    | **cc-manager**            | Skill lifecycle + output style management. Specialized in session tuning                               |

---

**Usage Examples**:

- "User requests 'Add login feature'" → **spec-builder** (Write SPEC) → **code-builder pipeline** (Implement) → **doc-syncer** (Document)
- "Tests are failing" → **debug-helper** (Analyze cause) → **code-builder pipeline** (Fix) → **trust-checker** (Re-verify quality)
- "Prepare for release" → **quality-gate** (Final verification) → **git-manager** (PR merge + tag)

---

**Last Updated**: 2025-10-27
**Document Version**: v1.0.0
